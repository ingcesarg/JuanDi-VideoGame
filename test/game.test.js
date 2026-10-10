import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, prepareServe, update, serve, hit, humanAction, jump, switchPlayer, pause, resume } from '../src/game.js';
import { setWinner, landingWinner, awardPoint, registerContact } from '../src/rules.js';
import { activatePower, consumePower, selectPower, collectItem } from '../src/powers.js';
import { launch, advanceBall, predict } from '../src/physics.js';
import { CONFIG } from '../src/config.js';

const match = () => createMatch(() => 0.5);
test('Set a 15 exige dos puntos, también en sets extendidos', () => {
  for (const [score, winner] of [[[15,14],null],[[16,14],0],[[15,13],0],[[14,16],1],[[30,29],null],[[31,29],0],[[29,31],1],[[14,0],null]]) assert.equal(setWinner(score),winner);
});
test('Una jugada y su premio solo se adjudican una vez', () => {
  const m=match();m.phase='rally';m.lastAttack={team:0,free:true};
  assert.equal(awardPoint(m,0,'Remate'),true);
  assert.equal(awardPoint(m,0,'Remate'),false);
  assert.deepEqual(m.score,[1,0]);assert.equal(m.powers.stock.spike,3);assert.equal(m.stats.placementPoints,1);assert.equal(m.item,null);
});
test('Dentro pierde el equipo de ese campo; fuera pierde el último en tocar', () => {
  assert.equal(landingWinner({x:5,y:12,lastTeam:1}),1);
  assert.equal(landingWinner({x:5,y:3,lastTeam:0}),0);
  assert.equal(landingWinner({x:-.1,y:3,lastTeam:0}),1);
  assert.equal(landingWinner({x:10.1,y:19,lastTeam:1}),0);
  assert.equal(landingWinner({x:0,y:18,lastTeam:0}),1);
});
test('Cuarto contacto da punto al rival; posesión y bloqueo reinician correctamente', () => {
  const m=match();m.phase='rally';
  for(let i=0;i<3;i++) assert.equal(registerContact(m,0),true);
  assert.equal(registerContact(m,0),false);assert.deepEqual(m.score,[0,1]);
  const n=match();n.phase='rally';registerContact(n,1);registerContact(n,1);registerContact(n,0,true);
  assert.equal(n.contacts,0);registerContact(n,0);assert.equal(n.contacts,1);
});
test('Dos activaciones consecutivas acumulan y stock vacío no crea mejoras', () => {
  const p=match().powers;assert.equal(activatePower(p),true);assert.equal(activatePower(p),true);assert.equal(activatePower(p),false);
  assert.equal(p.stock.jump,0);assert.equal(p.pending.jump,2);selectPower(p);assert.equal(p.stock.spike,2);
  assert.equal(consumePower(p,'spike'),false);assert.equal(consumePower(p,'jump'),true);assert.equal(p.pending.jump,1);
});
test('Mejoras sobreviven a puntos y se consumen solo por acciones compatibles humanas', () => {
  const m=match();activatePower(m.powers);selectPower(m.powers);activatePower(m.powers);
  m.phase='rally';awardPoint(m,1,'Suelo');prepareServe(m);
  assert.deepEqual(m.powers.pending,{jump:1,spike:1});
  jump(m,m.players[1]);assert.equal(m.powers.pending.jump,1);
  jump(m,m.players[0]);assert.equal(m.powers.pending.jump,0);assert.equal(m.players[0].vz,CONFIG.superJumpSpeed);
  m.phase='rally';m.lock=0;Object.assign(m.ball,{x:3,y:15.8,z:1.6,lastTeam:1});
  assert.equal(hit(m,m.players[0]),true);assert.equal(m.powers.pending.spike,1);
  m.lock=0;m.contacts=2;Object.assign(m.ball,{x:3,y:15.8,z:1.6,lastTeam:0});
  hit(m,m.players[0]);assert.equal(m.powers.pending.spike,0);
});
test('Cada objeto se recoge una vez y desaparece tras punto', () => {
  const m=match();m.item.type='spike';assert.equal(collectItem(m),true);assert.equal(collectItem(m),false);assert.equal(m.powers.stock.spike,3);
  m.phase='rally';awardPoint(m,1,'Suelo');assert.equal(collectItem(m),false);
});
test('Golpe fuera de alcance no altera pelota y mantener sin acción no da recepción humana', () => {
  const m=match();m.phase='rally';Object.assign(m.ball,{x:9,y:16,z:1.5,lastTeam:1});
  assert.equal(hit(m,m.players[0]),false);assert.equal(m.ball.lastTeam,1);
  Object.assign(m.ball,{x:m.players[0].x,y:m.players[0].y,z:1.2,vz:-1,lastTeam:1});
  update(m,CONFIG.step);assert.equal(m.ball.lastTeam,1);
});
test('Dirección cambia trayectoria del saque y remate', () => {
  const a=match(),b=match();serve(a,{x:-1,y:-1});serve(b,{x:1,y:1});assert.ok(a.ball.vx<b.ball.vx);
  for(const m of [a,b]){m.lock=0;m.contacts=2;Object.assign(m.ball,{x:3,y:15.8,z:1.8,lastTeam:0});}
  hit(a,a.players[0],{x:-1,y:0});hit(b,b.players[0],{x:1,y:0});assert.ok(a.ball.vx<b.ball.vx);
});
test('Red detiene pelota baja y deja pasar alta', () => {
  const low={x:5,y:8.9,z:1,vx:0,vy:10,vz:0};assert.equal(advanceBall(low,.03),true);assert.ok(low.vy<0);
  const high={x:5,y:8.9,z:3,vx:0,vy:10,vz:0};assert.equal(advanceBall(high,.03),false);assert.ok(high.y>9);
});
test('Trayectoria balística llega al objetivo y altura fijados', () => {
  const ball={x:3,y:15,z:1.7};launch(ball,{x:7,y:4},2);
  for(let i=0;i<120;i++)advanceBall(ball,1/60);
  assert.ok(Math.abs(ball.x-7)<1e-8);assert.ok(Math.abs(ball.y-4)<1e-8);assert.ok(Math.abs(ball.z)<1e-8);
});
test('Pausa congela todo; reanudar, cambiar y revancha mantienen estado coherente', () => {
  const m=match();serve(m);m.players[0].attempt=.2;pause(m);const ball={...m.ball};
  update(m,5,{x:1,y:0});assert.deepEqual(m.ball,ball);assert.equal(m.players[0].attempt,0);
  resume(m);assert.equal(m.phase,'rally');switchPlayer(m);assert.equal(m.active,1);
  const fresh=match();assert.deepEqual(fresh.score,[0,0]);assert.equal(fresh.contacts,0);assert.deepEqual(fresh.powers.pending,{jump:0,spike:0});assert.equal(fresh.stats.hits,0);
});
test('Bloqueo humano salta antes del contacto y no consume contacto deportivo', () => {
  const m=match();m.phase='rally';const p=m.players[0];p.x=5;p.y=9.6;Object.assign(m.ball,{x:5,y:9.6,z:2.6,vx:0,vy:0,vz:-.5,lastTeam:1});
  humanAction(m);assert.ok(p.vz>0);assert.equal(m.ball.lastTeam,1);
  for(let i=0;i<8;i++)update(m,CONFIG.step);
  assert.equal(m.ball.lastTeam,0);assert.equal(m.contacts,0);
});
test('Rival puede devolver un saque por física y contactos reales', () => {
  const m=match();serve(m);let rivalHit=false;
  for(let i=0;i<900&&m.phase==='rally'&&!rivalHit;i++){update(m,CONFIG.step);if(m.ball.lastTeam===1)rivalHit=true;}
  assert.equal(rivalHit,true);assert.ok(m.stats.hits===0);
});
test('Partido completo mediante movimiento y acción contextual termina con resultado válido', () => {
  let seed=42;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const m=createMatch(random);
  for(let frame=0;frame<36000&&m.phase!=='results';frame++){
    if(m.phase==='serve'&&m.server===0)serve(m,{x:-1,y:0});
    let direction={x:0,y:0};
    if(m.phase==='rally'){
      const target=predict(m.ball,1.7),p=m.players[m.active];
      if(target.y>9)direction={x:Math.abs(target.x-p.x)>.15?Math.sign(target.x-p.x):0,y:Math.abs(target.y-p.y)>.15?Math.sign(target.y-p.y):0};
      if(m.ball.vz<0&&Math.hypot(m.ball.x-p.x,m.ball.y-p.y)<1.5&&m.ball.z<3.3&&m.lock<=0)humanAction(m,direction);
    }
    update(m,CONFIG.step,direction);
  }
  assert.equal(m.phase,'results');assert.equal(m.winner,setWinner(m.score));
  assert.ok(m.stats.hits>0);assert.ok(m.stats.placements>0);assert.ok(m.stats.bestStreak>0);
  const finalScore=[...m.score];update(m,10,{x:1,y:1});assert.deepEqual(m.score,finalScore);
});
