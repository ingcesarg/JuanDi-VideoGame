import { difficultyProfile } from './difficulty.js';
import { CONFIG, POWER_NAMES } from './config.js';
import { predict } from './physics.js';
import { canHit, freeZones, ATTACK_ZONES } from './game.js';

export function project(x, y, z = 0) {
  return { x: 500 + (x - 5) * (45 + y * 1.5), y: 155 + y * 20 - z * 31 };
}
function polygon(ctx, points, fill, stroke = null, width = 2) {
  ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function rectCourt(ctx, x1, y1, x2, y2, fill, stroke) {
  polygon(ctx, [project(x1,y1),project(x2,y1),project(x2,y2),project(x1,y2)], fill, stroke);
}
function ellipse(ctx, x,y,rx,ry,fill,stroke) {
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}
}
function text(ctx, str, x, y, size, color, weight = 600) {
  ctx.font=`${weight} ${size}px Arial`;ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(str,x,y);
}

function background(ctx) {
  const sky=ctx.createLinearGradient(0,0,0,620);sky.addColorStop(0,'#b3c2a2');sky.addColorStop(.3,'#91a889');sky.addColorStop(1,'#5f8777');
  ctx.fillStyle=sky;ctx.fillRect(0,0,1000,620);
  // Arquitectura, vecinos y árboles dibujados como recursos propios.
  for(let i=0;i<8;i++){
    const x=i*145-25,h=80+(i%3)*22;
    ctx.fillStyle=['#819381','#a4aa8d','#8b9a87'][i%3];ctx.fillRect(x,85-h/2,125,h);
    ctx.fillStyle='#697e73';ctx.fillRect(x+8,80-h/2,108,6);
    for(let row=0;row<3;row++)for(let col=0;col<4;col++){ctx.fillStyle=(row+col+i)%4===0?'#d3cba0':'#607c72';ctx.fillRect(x+12+col*26,99-h/2+row*23,13,15);}
  }
  for(const x of [35,115,887,967]){
    ctx.fillStyle='#655e42';ctx.fillRect(x-4,74,8,121);
    ellipse(ctx,x,57,33,40,'#5d8268');ellipse(ctx,x-18,80,25,30,'#658d6d');ellipse(ctx,x+22,77,29,34,'#749974');
  }
  ctx.fillStyle='#4f7565';ctx.fillRect(0,142,1000,4);
  ctx.strokeStyle='#688273';ctx.lineWidth=1;
  for(let x=0;x<1000;x+=25){ctx.beginPath();ctx.moveTo(x,123);ctx.lineTo(x,185);ctx.stroke();}
  for(let y=126;y<186;y+=13){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1000,y);ctx.stroke();}
  // Bancos y público a ambos lados.
  for(const side of [0,1]){
    const x=side===0?27:906;
    for(let row=0;row<3;row++){
      const y=218+row*45;
      ctx.fillStyle='#667b6f';ctx.fillRect(x-5,y+20,73,12);
      for(let j=0;j<3;j++){
        const px=x+7+j*24;
        ellipse(ctx,px,y,6,7,['#d7b08a','#ae795a','#c99874'][j],null);
        ctx.fillStyle=['#ecd08b','#728fa1','#bd7964'][(j+row)%3];ctx.fillRect(px-6,y+7,12,15);
      }
    }
  }
  ctx.fillStyle='#28493f';ctx.fillRect(155,100,150,27);
  text(ctx,'GOCA · CANCHA DEL BARRIO',230,118,9,'#eaf2ce',800);
  ctx.fillStyle='#24483f';ctx.save();ctx.translate(110,440);ctx.rotate(-Math.PI/2);text(ctx,'CLUB GOCA · DESDE EL BARRIO',0,0,11,'#e4e7c3aa',700);ctx.restore();
}

function drawNet(ctx) {
  const a=project(-.25,9),b=project(10.25,9),at=project(-.25,9,CONFIG.netHeight),bt=project(10.25,9,CONFIG.netHeight);
  polygon(ctx,[a,b,bt,at],'#173a3820');
  ctx.lineWidth=1;ctx.strokeStyle='#e6eada99';
  for(let x=0;x<=10;x+=.4){const g=project(x,9),t=project(x,9,CONFIG.netHeight);ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(t.x,t.y);ctx.stroke();}
  for(let z=.4;z<CONFIG.netHeight;z+=.4){const l=project(-.25,9,z),r=project(10.25,9,z);ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(r.x,r.y);ctx.stroke();}
  ctx.strokeStyle='#eff2df';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(at.x,at.y);ctx.lineTo(bt.x,bt.y);ctx.stroke();
  for(const x of [-.35,10.35]){const g=project(x,9),t=project(x,9,3.1);ctx.strokeStyle='#233e3d';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(g.x,g.y+5);ctx.lineTo(t.x,t.y);ctx.stroke();ctx.strokeStyle='#e7dca4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(t.x,t.y+16);ctx.stroke();}
}

const visualPlayers = new WeakMap();
function player(ctx,p,m,options) {
  let visual = visualPlayers.get(p);
  if (!visual) { visual = { x:p.x, y:p.y, time:m.elapsed, moving:false, arms:[-18,-22,18,-22] }; visualPlayers.set(p,visual); }
  const delta = Math.max(0,m.elapsed-visual.time);
  if(delta>0){visual.moving=Math.hypot(p.x-visual.x,p.y-visual.y)>.002;visual.x=p.x;visual.y=p.y;visual.time=m.elapsed;}
  const stride = options.reducedMotion || !visual.moving ? 0 : Math.sin(m.elapsed*15)*4;
  const ground=project(p.x,p.y),pos=project(p.x,p.y,p.z),scale=.8+p.y*.023;
  ellipse(ctx,ground.x+4,ground.y+3,16*scale,6*scale,'#173c3840');
  const active=p.id===m.active;
  if(active){ellipse(ctx,ground.x,ground.y+1,24*scale,10*scale,'#c3ec6620','#c3ec66');}
  const action=p.action;
  if(action?.powered && p.z>0.15){
    ctx.strokeStyle='#fff9ce';ctx.lineWidth=2;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(pos.x-22,ground.y-4);ctx.quadraticCurveTo(pos.x-36,pos.y-35,pos.x-20,pos.y-62);ctx.stroke();ctx.setLineDash([]);
    text(ctx,'↑↑',pos.x+28,pos.y-25,17,'#fff9ce',800);
  }
  ctx.save();ctx.translate(pos.x,pos.y);ctx.scale(scale,scale);
  const skin=['#c88e62','#dca375','#ae7754','#dba078'][p.id];
  // Piernas y zapatillas.
  ctx.strokeStyle='#233947';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-5,-13);ctx.lineTo(-8,1+stride);ctx.moveTo(5,-13);ctx.lineTo(9,1-stride);ctx.stroke();
  ctx.strokeStyle='#eeecc9';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-9,1+stride);ctx.lineTo(-14,2+stride);ctx.moveTo(8,1-stride);ctx.lineTo(14,2-stride);ctx.stroke();
  const jersey=ctx.createLinearGradient(-12,-40,12,-14);
  jersey.addColorStop(0,p.team===0?'#e3f9a5':'#ffd4ae');jersey.addColorStop(1,p.team===0?'#7aa940':'#ce7455');
  ctx.fillStyle=jersey;ctx.beginPath();ctx.roundRect(-12,-40,24,26,5);ctx.fill();
  ctx.strokeStyle=p.team===0?'#365a37':'#763f34';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-10,-39);ctx.lineTo(-7,-25);ctx.moveTo(10,-39);ctx.lineTo(7,-25);ctx.stroke();
  ctx.fillStyle='#ffffff9a';ctx.fillRect(-3,-39,6,3);
  ctx.fillStyle='#283c40';ctx.fillRect(-11,-18,22,7);
  let arms=[-18,-22,18,-22];
  if(action?.kind==='spike') arms=[-24,-29,24,-57];
  else if(action?.kind==='block'||action?.kind==='set') arms=[-19,-57,19,-57];
  else if(action?.kind==='receive') arms=[-3,-24,3,-24];
  else if(p.z>.15) arms=[-24,-41,24,-41];
  const blend=options.reducedMotion?1:Math.min(1,delta*18);
  visual.arms=visual.arms.map((v,i)=>v+(arms[i]-v)*blend);
  ctx.strokeStyle=skin;ctx.lineWidth=6;ctx.beginPath();
  ctx.moveTo(-12,-35);ctx.lineTo(visual.arms[0],visual.arms[1]);
  ctx.moveTo(12,-35);ctx.lineTo(visual.arms[2],visual.arms[3]);ctx.stroke();
  ellipse(ctx,0,-49,9,10,skin);ctx.fillStyle='#293331';ctx.beginPath();ctx.arc(0,-53,9,Math.PI,Math.PI*2);ctx.fill();
  if(p.id===1||p.id===3){ellipse(ctx,8,-49,5,6,'#293331');}
  text(ctx,String(p.number).padStart(2,'0'),0,-24,11,'#26412e',800);
  if(active){polygon(ctx,[{x:-6,y:-75},{x:6,y:-75},{x:0,y:-65}],'#d1f778');}
  ctx.restore();
  if(action){
    const labels={jump:'SALTO NORMAL',superJump:'SÚPER SALTO',block:action.powered?'BLOQUEO · SÚPER SALTO':'BLOQUEO',receive:'RECEPCIÓN',set:'ARMADO',spike:action.powered?'REMATE POTENTE':'REMATE'};
    const label=labels[action.kind];
    ctx.fillStyle='#18332fdd';ctx.beginPath();ctx.roundRect(pos.x-75,pos.y-98,150,20,4);ctx.fill();
    text(ctx,label,pos.x,pos.y-84,9,'#fff8d5',700);
  }
  text(ctx,p.name.toUpperCase(),ground.x,ground.y+26*scale,10*scale,active?'#eff8d3':'#e7eee0',700);
  if(active)text(ctx,'TU JUGADOR',ground.x,ground.y+39*scale,7*scale,'#d1f778',600);
}

function ball(ctx,b,m,options) {
  const ground=project(b.x,b.y),pos=project(b.x,b.y,b.z);
  if(m.lastAttack?.powered&&m.phase==='rally'){
    const trail=project(b.x-b.vx*.08,b.y-b.vy*.08,b.z-b.vz*.08);
    ctx.strokeStyle='#fff2bd';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(trail.x,trail.y);ctx.lineTo(pos.x,pos.y);ctx.stroke();
    text(ctx,'POTENTE',pos.x+48,pos.y-14,9,'#fff9ce',800);
  }
  ellipse(ctx,ground.x,ground.y,Math.max(4,11-b.z),4,'#213d3c50');
  if(m.phase==='rally'){
    ctx.strokeStyle='#faf5c444';ctx.lineWidth=2;ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(pos.x,pos.y+9);ctx.lineTo(ground.x,ground.y-5);ctx.stroke();ctx.setLineDash([]);
  }
  ctx.save();ctx.translate(pos.x,pos.y);ctx.rotate(options.reducedMotion?0:m.elapsed*3);ellipse(ctx,0,0,9,9,'#fcf6d9','#fcf6d9');
  ctx.strokeStyle='#4a7595';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-5,0,7,-Math.PI/2,Math.PI/2);ctx.stroke();ctx.strokeStyle='#d3b34b';ctx.beginPath();ctx.arc(5,0,7,Math.PI/2,Math.PI*1.5);ctx.stroke();ctx.restore();
}

export function render(ctx,m,options = {}) {
  ctx.clearRect(0,0,1000,620);background(ctx);
  rectCourt(ctx,-.7,-.7,10.7,18.7,'#537d71');
  rectCourt(ctx,0,0,10,9,'#c5a47b','#f1e8cd');rectCourt(ctx,0,9,10,18,'#d0b087','#f1e8cd');
  for(let i=0;i<32;i++){
    const x=.5+(i*1.73)%9,y=.4+(i*2.41)%17;
    const a=project(x,y),b=project(x+.08,y+.025);
    ctx.strokeStyle='#65543918';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  rectCourt(ctx,0,6,10,6,null,'#f1e8cdbb');rectCourt(ctx,0,12,10,12,null,'#f1e8cdbb');
  ctx.save();ctx.globalAlpha=.2;const label=project(5,15.2);text(ctx,'GOCA',label.x,label.y,54,'#fff2cd',900);ctx.restore();
  for(const zone of (m.aim ? [] : freeZones(m).filter(z=>z.clearance>=CONFIG.freeRadius).slice(0,3))){
    const p=project(zone.x,zone.y),scale=difficultyProfile(m.difficulty).hintScale;ellipse(ctx,p.x,p.y,46*scale,20*scale,'#bde86d24','#d5f89d88');text(ctx,'ESPACIO',p.x,p.y+3,8,'#f0f9c5',700);
  }
  if(m.aim){
    ATTACK_ZONES.forEach((zone,index)=>{
      const column=index%3,row=Math.floor(index/3),selected=m.aim.zone===index;
      rectCourt(ctx,column*10/3,row*4.5,(column+1)*10/3,(row+1)*4.5,selected?'#f9f3b975':'#203b3b25',selected?'#fff9d2':'#fff9d270');
      const p=project(zone.x,zone.y);
      if(selected){ellipse(ctx,p.x,p.y,30,13,null,'#fff9d2');text(ctx,'⊕',p.x,p.y+5,22,'#fff9d2',800);}
      text(ctx,zone.label.toUpperCase(),p.x,p.y+28,9,selected?'#243d32':'#f7f2d9',700);
    });
  }
  if(m.item&&!m.item.collected&&m.phase==='rally'){
    const p=project(m.item.x,m.item.y);ellipse(ctx,p.x,p.y,CONFIG.pickupRadius*60,CONFIG.pickupRadius*20,'#fff4c92b','#fff4c9');
    const bob=options.reducedMotion?0:Math.sin(m.elapsed*3)*3;polygon(ctx,[{x:p.x,y:p.y-29-bob},{x:p.x+11,y:p.y-17-bob},{x:p.x,y:p.y-5-bob},{x:p.x-11,y:p.y-17-bob}],m.item.type==='jump'?'#d1f386':'#f6bc83','#fcf6cc');
    text(ctx,m.item.type==='jump'?'↑':'ϟ',p.x,p.y-13-bob,16,'#355042',800);
    text(ctx,POWER_NAMES[m.item.type].toUpperCase(),p.x,p.y+20,10,'#213c32',800);
    text(ctx,'PASA SOBRE ÉL PARA RECOGERLO',p.x,p.y+34,8,'#213c32',700);
  }
  if(m.phase==='rally'){
    const target=predict(m.ball);const p=project(target.x,target.y);
    if(target.x>-1&&target.x<11&&target.y>-1&&target.y<19){
      ellipse(ctx,p.x,p.y,18+(options.reducedMotion?0:Math.sin(m.elapsed*7)*2),8,null,'#fff4c9');
      ctx.strokeStyle='#fff4c9aa';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-25,p.y);ctx.lineTo(p.x+25,p.y);ctx.moveTo(p.x,p.y-12);ctx.lineTo(p.x,p.y+12);ctx.stroke();
    }
  }
  m.players.filter(p=>p.y<9).sort((a,b)=>a.y-b.y).forEach(p=>player(ctx,p,m,options));
  if(m.ball.y<9)ball(ctx,m.ball,m,options);
  drawNet(ctx);
  m.players.filter(p=>p.y>=9).sort((a,b)=>a.y-b.y).forEach(p=>player(ctx,p,m,options));
  if(m.ball.y>=9)ball(ctx,m.ball,m,options);
  const active=m.players[m.active];
  if(m.phase==='rally'&&!m.aim&&canHit(m,active)){
    const p=project(active.x,active.y,active.z);ctx.fillStyle='#142d2bde';ctx.beginPath();ctx.roundRect(p.x-80,p.y-129,160,23,5);ctx.fill();
    text(ctx,m.contacts>=2&&m.ball.lastTeam===0?'ESPACIO · APUNTA':'ESPACIO · GOLPEA',p.x,p.y-113,10,'#d5f58c',700);
  }
  if(m.phase==='serve'){
    const p=project(m.ball.x,m.ball.y);text(ctx,m.server===0?'ESPACIO PARA SACAR':'SAQUE RIVAL',p.x,p.y+57,11,'#fbf5d1',800);
  }
  if(!options.reducedMotion){
    for(const event of (m.presentationEvents??[])){
      const age=m.elapsed-event.time;
      if(age<0||age>.45||['point','result'].includes(event.kind))continue;
      const p=project(event.x,event.y,event.z),radius=10+age*45;
      ctx.save();ctx.globalAlpha=(1-age/.45)*.65;
      ctx.strokeStyle=['superJump','powerSpike','pickup','prepare'].includes(event.kind)?'#f4e6a0':'#f6fbef';ctx.lineWidth=2;
      for(let i=0;i<5;i++){const angle=i*Math.PI*2/5;ctx.beginPath();ctx.moveTo(p.x+Math.cos(angle)*radius,p.y-25+Math.sin(angle)*radius*.7);ctx.lineTo(p.x+Math.cos(angle)*(radius+5),p.y-25+Math.sin(angle)*(radius+5)*.7);ctx.stroke();}
      ctx.restore();
    }
  }
  if(m.phase==='point'){
    text(ctx,m.server===0?'¡PUNTO GOCA!':'PUNTO RIVAL',500,48,22,'#fff8d9',800);
  }
  if(m.flash>0&&!options.reducedMotion){ctx.strokeStyle='#dbf89d';ctx.lineWidth=4;ctx.globalAlpha=m.flash;ctx.strokeRect(3,3,994,614);ctx.globalAlpha=1;}
}
