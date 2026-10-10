import { createMatch, humanAction, chooseAim, switchPlayer, powerAction, pause, resume, update, ATTACK_ZONES } from '../src/game.js';
import { createInput } from '../src/input.js';
import { createClock } from '../src/clock.js';
import { render } from '../src/render.js';
import { predict } from '../src/physics.js';

const canvas=document.getElementById('court'),ctx=canvas.getContext('2d'),clock=createClock();
let match=createMatch(()=>.5),recorded=false;
const records=[];
const input=createInput(canvas,()=>match.phase==='rally',code=>{
  if(code==='Space')humanAction(match,input.direction());
  if(code.startsWith('Arrow'))chooseAim(match,code);
  if(code==='Tab')switchPlayer(match);
  if(code==='KeyQ')powerAction(match,true);
  if(code==='KeyE')powerAction(match);
  if(code==='Escape')stop('Pausa manual');
  record();
});
function stop(reason){pause(match,reason);input.clear();clock.reset();}
function load(type){
  match=createMatch(()=>.5);match.phase='rally';match.item=null;recorded=false;
  const p=match.players[0];Object.assign(p,{x:5,y:10.8});
  Object.assign(match.ball,{x:p.x,y:p.y,z:1.8,vx:0,vy:0,vz:0,lastTeam:0});match.contacts=2;
  if(type==='normal'||type==='power'){
    match.powers.pending.spike=Number(type==='power');humanAction(match);
  }else{
    match.contacts=0;match.ball.lastTeam=1;match.ball.z=8;
    match.ball.vz=0;
    if(type==='pickup')match.item={x:p.x,y:p.y,type:'spike',collected:false};
  }
  stop('Caso preparado');
  document.getElementById('continue').focus();
}
function record(){
  if(recorded)return;
  if(match.lastAttack?.team===0){
    const target=predict(match.ball);
    records.push(`Remate ${match.lastAttack.powered?'potente':'normal'}: destino (${target.x.toFixed(2)}, ${target.y.toFixed(2)}), vuelo ${target.time.toFixed(3)} s, contactos ${match.contacts}, preparados ${match.powers.pending.spike}`);
    recorded=true;stop('Trayectoria registrada');
  }else if(match.item?.collected){
    records.push(`Recogida: ${match.notice.text}; disponibles ${match.powers.stock.spike}, preparados ${match.powers.pending.spike}`);
    recorded=true;stop('Recogida registrada');
  }
  document.getElementById('record').textContent=records.join('\n')||'Sin registros.';
}
for(const [id,type]of [['attack','normal'],['power','power'],['pickup','pickup'],['receive','receive']])document.getElementById(id).addEventListener('click',()=>load(type));
document.getElementById('continue').addEventListener('click',()=>{input.clear();clock.reset();resume(match);canvas.focus();});
window.addEventListener('blur',()=>stop('Ventana sin foco'));
canvas.addEventListener('blur',()=>stop('Cancha sin foco'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('Pestaña oculta');});
function frame(time){
  if(match.phase==='rally')clock.advance(time,(dt,realDt)=>update(match,dt,input.direction(),realDt));else clock.reset();
  record();render(ctx,match);
  document.getElementById('state').textContent=`Estado: ${match.phase}; motivo: ${match.pauseReason}; zona: ${match.aim?ATTACK_ZONES[match.aim.zone].label:'ninguna'}; tiempo: ${match.aim?match.aim.remaining.toFixed(2):'—'}; activo: ${match.active}; contactos: ${match.contacts}; preparados: ${match.powers.pending.spike}`;
  requestAnimationFrame(frame);
}
load('normal');requestAnimationFrame(frame);
