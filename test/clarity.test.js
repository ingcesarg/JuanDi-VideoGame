import test from 'node:test';
import assert from 'node:assert/strict';
import * as game from '../src/game.js';
import { CONFIG } from '../src/config.js';
import { activatePower } from '../src/powers.js';
import { predict } from '../src/physics.js';

function fixture(contacts = 2) {
  const m=game.createMatch(()=>.5);m.phase='rally';m.contacts=contacts;m.flight=10;
  const p=m.players[0];Object.assign(p,{x:5,y:10.8,z:0,vz:0});
  Object.assign(m.ball,{x:p.x,y:p.y,z:1.8,vx:0,vy:0,vz:0,lastTeam:contacts ? 0 : 1});
  m.item=null;return m;
}

test('Tab discreto repetido no delega primera recepción ni tercer contacto',()=>{
  for(const contacts of [0,2]){
    const m=fixture(contacts);const last=m.ball.lastTeam;
    for(let i=0;i<5;i++){game.switchPlayer(m);m.ball.vz=-1;game.updateAI(m,CONFIG.step);}
    assert.equal(m.contacts,contacts);assert.equal(m.ball.lastTeam,last);assert.equal(m.stats.hits,0);
  }
});
test('Segundo contacto sigue asistido y cambiar borra el intento saliente',()=>{
  const m=fixture(1);game.switchPlayer(m);m.players[1].attempt=.3;
  m.ball.vz=-1;game.updateAI(m,CONFIG.step);assert.equal(m.contacts,2);
  game.switchPlayer(m);assert.equal(m.players[1].attempt,0);
});
test('Pausa repetida conserva origen y motivo, bloquea todas las acciones',()=>{
  const m=fixture();game.pause(m,'Ventana sin foco');const before=JSON.stringify(m);
  game.pause(m,'Pestaña oculta');game.update(m,10,{x:1,y:1});game.humanAction(m);game.switchPlayer(m);game.powerAction(m);game.powerAction(m,true);
  assert.equal(JSON.stringify(m),before);assert.equal(m.pauseReason,'Ventana sin foco');
  game.resume(m);assert.equal(m.phase,'rally');
});
test('Reserva de ataque sin contacto ni consumo; Tab no transfiere atacante',()=>{
  const m=fixture();m.powers.pending.spike=1;game.humanAction(m);
  assert.ok(m.aim);assert.equal(m.contacts,2);assert.equal(m.powers.pending.spike,1);
  assert.equal(m.aim.zone,1);game.switchPlayer(m);assert.equal(m.active,0);assert.match(m.message,/Confirma/);
});
test('Seis zonas conservan destinos con y sin remate potente',()=>{
  const destinations=new Set();
  for(const powered of [false,true])for(let zone=0;zone<6;zone++){
    const m=fixture();m.powers.pending.spike=Number(powered);game.humanAction(m);
    assert.ok(m.aim);m.aim.zone=zone;game.humanAction(m);
    assert.equal(m.aim,null);assert.equal(m.contacts,3);assert.equal(m.powers.pending.spike,0);
    const destination=predict(m.ball);destinations.add(`${destination.x.toFixed(2)},${destination.y.toFixed(2)}`);
    const expected=game.ATTACK_ZONES[zone];assert.ok(Math.abs(destination.x-expected.x)<1e-8);assert.ok(Math.abs(destination.y-expected.y)<1e-8);
    assert.equal(m.lastAttack.powered,powered);
  }
  assert.equal(destinations.size,6);
});
test('Flechas durante apuntado cambian zona sin mover atacante',()=>{
  const m=fixture();game.humanAction(m);game.chooseAim(m,'ArrowRight');game.chooseAim(m,'ArrowDown');
  assert.equal(m.aim.zone,5);const pos={x:m.players[0].x,y:m.players[0].y};
  game.update(m,.05,{x:1,y:1});assert.equal(m.players[0].x,pos.x);assert.equal(m.players[0].y,pos.y);
  game.chooseAim(m,'ArrowLeft');game.chooseAim(m,'ArrowUp');assert.equal(m.aim.zone,1);
});
test('Apuntado ralentiza gravedad y movimiento rival uniformemente',()=>{
  const a=fixture(),b=fixture();game.humanAction(a);
  game.update(a,.05);game.update(b,.05*CONFIG.aimScale);
  assert.deepEqual(a.ball,b.ball);assert.equal(a.players[2].x,b.players[2].x);assert.equal(a.players[2].y,b.players[2].y);
  assert.ok(Math.abs(a.aim.remaining-(CONFIG.aimSeconds-.05))<1e-8);
});
test('Expirar ejecuta solo un ataque y restaura velocidad',()=>{
  const m=fixture();game.humanAction(m);m.aim.remaining=.01;game.update(m,.02);
  assert.equal(m.aim,null);assert.equal(m.contacts,3);assert.equal(m.stats.hits,1);
  const elapsed=m.elapsed;game.update(m,.02);assert.ok(Math.abs(m.elapsed-elapsed-.02)<1e-8);
});
test('Perder alcance cancela, no consume poder y no permite reabrir oportunidad',()=>{
  const m=fixture();m.powers.pending.spike=1;game.humanAction(m);m.ball.x=9;
  game.update(m,.01);assert.equal(m.aim,null);assert.equal(m.contacts,2);assert.equal(m.powers.pending.spike,1);
  m.ball.x=5;game.humanAction(m);assert.equal(m.aim,null);assert.equal(m.contacts,2);
});
test('Confirmación sin alcance cancela sin golpe remoto',()=>{
  const m=fixture();m.powers.pending.spike=1;game.humanAction(m);m.ball.z=8;game.humanAction(m);
  assert.equal(m.aim,null);assert.equal(m.contacts,2);assert.equal(m.powers.pending.spike,1);
});
test('Pausa en apuntado conserva atacante, zona y tiempo real restante',()=>{
  const m=fixture();game.humanAction(m);game.chooseAim(m,'ArrowRight');game.update(m,.05);
  const aim={...m.aim},ball={...m.ball};game.pause(m,'Cancha sin foco');game.update(m,99);game.humanAction(m);
  assert.deepEqual(m.aim,aim);assert.deepEqual(m.ball,ball);game.resume(m);assert.deepEqual(m.aim,aim);
});
test('Recogida exclusiva del activo una vez, separada de preparados',()=>{
  const m=fixture(0);m.item={x:7,y:12.2,type:'spike',collected:false};game.update(m,CONFIG.step);
  assert.equal(m.item.collected,false);assert.equal(m.powers.stock.spike,2);
  Object.assign(m.players[0],{x:7,y:12.2,z:1});game.update(m,CONFIG.step);game.update(m,CONFIG.step);
  assert.equal(m.item.collected,true);assert.equal(m.powers.stock.spike,3);assert.equal(m.powers.pending.spike,0);
  assert.match(m.notice.text,/\+1 Remate potente/);assert.match(m.notice.text,/Q.*E/);
});
test('No se recogen objetos durante pausa o apuntado',()=>{
  for(const phase of ['paused','aim']){
    const m=fixture();m.item={x:5,y:10.8,type:'jump',collected:false};
    if(phase==='paused')game.pause(m);else game.humanAction(m);
    game.update(m,.05);assert.equal(m.item.collected,false);assert.equal(m.powers.stock.jump,2);
  }
});
test('Misma posición: súper salto supera altura y alcance del salto normal',()=>{
  const a=fixture(0),b=fixture(0);b.powers.pending.jump=1;game.jump(a,a.players[0]);game.jump(b,b.players[0]);
  let normalMax=0,superMax=0;
  for(let i=0;i<50;i++){
    // Pelota alta: no hay contactos automáticos ni puntos mientras se comparan saltos.
    for(const m of [a,b])Object.assign(m.ball,{x:5,y:11,z:6,vz:0});
    game.update(a,CONFIG.step);game.update(b,CONFIG.step);
    normalMax=Math.max(normalMax,a.players[0].z);superMax=Math.max(superMax,b.players[0].z);
  }
  assert.ok(superMax>normalMax);assert.equal(b.powers.pending.jump,0);
  for(const m of [a,b])m.ball.z=5;
  assert.equal(game.canHit(a,a.players[0]),false);assert.equal(game.canHit(b,b.players[0]),true);
});
test('Remate potente reduce vuelo a idéntico destino y fallo conserva preparación',()=>{
  const a=fixture(),b=fixture();b.powers.pending.spike=1;
  for(const m of [a,b]){game.humanAction(m);game.humanAction(m);}
  assert.ok(predict(b.ball).time<predict(a.ball).time);
  const c=fixture();c.powers.pending.spike=1;c.ball.x=9;game.humanAction(c);assert.equal(c.powers.pending.spike,1);
});
test('Q y E informan transferencias sin caducidad; sin stock no altera estado',()=>{
  const m=fixture();game.powerAction(m,true);assert.equal(m.powers.selected,'spike');assert.equal(m.powers.stock.spike,2);
  game.powerAction(m);game.powerAction(m);const snapshot=JSON.stringify(m.powers);game.powerAction(m);
  assert.equal(JSON.stringify(m.powers),snapshot);assert.equal(m.powers.pending.spike,2);
  assert.match(m.notice.text,/Sin usos/);
  activatePower(m.powers);assert.equal(m.powers.pending.spike,2);
});
