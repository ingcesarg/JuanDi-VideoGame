import test from 'node:test';
import assert from 'node:assert/strict';
import { DIFFICULTIES, difficultyProfile } from '../src/difficulty.js';
import { CONFIG } from '../src/config.js';
import { createMatch, updateAI, pause, resume, humanAction } from '../src/game.js';
import { createProgress } from '../src/progress.js';
import { awardPoint } from '../src/rules.js';

test('Principiante conserva valores y fallback; perfiles inmutables e independientes', () => {
  assert.equal(difficultyProfile('beginner').rivalSpeed, CONFIG.rivalSpeed);
  assert.equal(difficultyProfile('beginner').rivalMissChance, CONFIG.rivalMissChance);
  assert.equal(difficultyProfile('toString'),DIFFICULTIES.beginner);
  assert.equal(difficultyProfile(undefined),DIFFICULTIES.beginner);
  assert.throws(()=>{DIFFICULTIES.normal.rivalSpeed=99;},TypeError);
  assert.equal(createMatch().difficulty,'beginner');
  assert.equal(createMatch(()=>.5,{difficulty:'invalid'}).difficulty,'beginner');
  const normal=createMatch(()=>.5,{difficulty:'normal'});
  const beginner=createMatch(()=>.5);
  assert.equal(normal.difficulty,'normal');
  assert.equal(beginner.difficulty,'beginner');
});
function setup(id,random=()=>.5){
  const m=createMatch(random,{difficulty:id});m.phase='rally';m.item=null;
  return m;
}
test('Misma trayectoria: Normal desplaza rivales más rápido sin cambiar compañero',()=>{
  const a=setup('beginner'),b=setup('normal');
  Object.assign(a.ball,{x:9,y:2,z:5,vx:0,vy:0,vz:0,lastTeam:0});
  Object.assign(b.ball,a.ball);
  const before=a.players.map(p=>({x:p.x,y:p.y}));
  updateAI(a,.05);updateAI(b,.05);
  for(const id of [2,3]){
    const distance=p=>Math.hypot(p.x-before[id].x,p.y-before[id].y);
    assert.ok(distance(b.players[id])>distance(a.players[id]));
  }
  assert.equal(a.players[1].x,b.players[1].x);
  assert.equal(a.players[1].y,b.players[1].y);
});
test('Aleatoriedad 0,12: Principiante falla mientras Normal recibe con alcance válido',()=>{
  const a=setup('beginner',()=>.12),b=setup('normal',()=>.12);
  for(const m of [a,b]){
    m.lock=0;m.flight=1;
    Object.assign(m.ball,{x:3,y:4,z:1.7,vx:0,vy:0,vz:-.1,lastTeam:0});
    updateAI(m,0);
  }
  assert.equal(a.ball.lastTeam,0);
  assert.equal(b.ball.lastTeam,1);
  assert.equal(b.contacts,1);
});
test('Normal no recibe lejos ni delega recepción humana',()=>{
  const m=setup('normal',()=>1);m.lock=0;
  Object.assign(m.ball,{x:10,y:0,z:1,vx:0,vy:0,vz:-1,lastTeam:0});
  updateAI(m,0);assert.equal(m.ball.lastTeam,0);
  Object.assign(m.ball,{x:7,y:12,z:1.7,vx:0,vy:0,vz:-.1,lastTeam:1});
  updateAI(m,0);assert.equal(m.ball.lastTeam,1);
});
test('Pausa y revancha conservan nivel por partido sin afectar progresión',()=>{
  const storage={getItem:()=>null,setItem(){}};
  const p=createProgress(storage);const normal=setup('normal');
  pause(normal);resume(normal);assert.equal(normal.difficulty,'normal');
  normal.phase='rally';normal.score=[14,0];awardPoint(normal,0,'Fixture');
  assert.equal(p.reward('normal',normal.winner),10);
  p.buy('spike','results');const reserve=p.takeReserve();
  const next=createMatch(()=>.5,{difficulty:'beginner'});
  next.powers.stock.spike+=reserve.spike;
  assert.equal(normal.difficulty,'normal');assert.equal(next.difficulty,'beginner');
  assert.equal(next.powers.stock.spike,3);assert.equal(p.snapshot().credits,5);
});
test('Apuntado Normal conserva ventana y zonas sin alterar poder preparado',()=>{
  const m=setup('normal');m.lock=0;m.contacts=2;
  Object.assign(m.players[0],{x:5,y:10.8});
  Object.assign(m.ball,{x:5,y:10.8,z:1.8,vx:0,vy:0,vz:0,lastTeam:0});
  m.powers.pending.spike=1;humanAction(m);
  assert.equal(m.aim.remaining,CONFIG.aimSeconds);
  assert.equal(m.aim.zone,1);assert.equal(m.powers.pending.spike,1);
  assert.ok(DIFFICULTIES.normal.hintScale<DIFFICULTIES.beginner.hintScale);
});
