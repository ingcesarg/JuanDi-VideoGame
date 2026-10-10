import test from 'node:test';
import assert from 'node:assert/strict';
import { createInput } from '../src/input.js';
import { createClock } from '../src/clock.js';
import { createMatch, humanAction, chooseAim, switchPlayer, pause, resume, update } from '../src/game.js';

function surface() {
  const handlers=new Map();
  return { addEventListener(type,fn){if(!handlers.has(type))handlers.set(type,new Set());handlers.get(type).add(fn);}, removeEventListener(type,fn){handlers.get(type)?.delete(fn);}, emit(type,event={}){for(const fn of handlers.get(type)??[])fn(event);} };
}
function keyboard(m) {
  const canvas=surface(),window=surface(),document={activeElement:canvas};
  const input=createInput(canvas,()=>m.phase==='rally'||m.phase==='serve',code=>{
    if(code==='Tab')switchPlayer(m);
    if(code==='Space')humanAction(m,input.direction());
    if(code.startsWith('Arrow'))chooseAim(m,code);
  },{window,document});
  const down=(code,repeat=false,target=canvas)=>window.emit('keydown',{code,repeat,target,preventDefault(){}});
  const up=code=>window.emit('keyup',{code});
  return {input,down,up,window,canvas,document};
}
test('Tab sostenido y keydown duplicado cambian una vez; pulsaciones nuevas cambian una vez cada una',()=>{
  const m=createMatch(),k=keyboard(m);
  k.down('Tab');assert.equal(m.active,1);k.down('Tab',true);k.down('Tab');assert.equal(m.active,1);
  k.up('Tab');k.down('Tab');assert.equal(m.active,0);k.input.dispose();
});
test('Espacio sostenido abre pero no confirma; nueva pulsación confirma',()=>{
  const m=createMatch();m.phase='rally';m.contacts=2;
  Object.assign(m.ball,{x:3,y:15.8,z:1.8,lastTeam:0});const k=keyboard(m);
  k.down('Space');assert.ok(m.aim);k.down('Space',true);k.down('Space');assert.equal(m.contacts,2);
  k.down('ArrowRight');k.up('ArrowRight');assert.equal(m.aim.zone,2);
  k.up('Space');k.down('Space');assert.equal(m.aim,null);assert.equal(m.contacts,3);
});
test('Foco y reanudación limpian flecha; teclado del botón no dispara juego',()=>{
  const m=createMatch(),k=keyboard(m);k.down('ArrowRight');assert.equal(k.input.direction().x,1);
  pause(m,'Cancha sin foco');k.canvas.emit('blur');assert.equal(k.input.direction().x,0);
  resume(m);k.down('Space',false,{});assert.equal(m.phase,'serve');
  k.document.activeElement={};k.down('Tab');assert.equal(m.active,0);
});
test('Reloj reiniciado no recupera tiempo fuera, y la física limita frames largos',()=>{
  const clock=createClock();let simulated=0,real=0;
  const step=(dt,elapsed)=>{simulated+=dt;real+=elapsed;};
  clock.advance(0,step);clock.advance(20,step);assert.ok(simulated>0);
  clock.reset();simulated=real=0;clock.advance(100000,step);assert.equal(simulated,0);assert.equal(real,0);
  clock.advance(101000,step);assert.ok(simulated<=.101);assert.equal(real,1);
});
test('Apuntado cuenta tiempo real de frame lento sin acelerar física',()=>{
  const m=createMatch();m.phase='rally';m.contacts=2;Object.assign(m.ball,{x:3,y:15.8,z:1.8,lastTeam:0});humanAction(m);
  const clock=createClock();const step=(dt,elapsed)=>update(m,dt,{x:0,y:0},elapsed);
  clock.advance(0,step);clock.advance(1000,step);assert.ok(m.aim);assert.equal(m.aim.remaining,1);
  pause(m);clock.reset();clock.advance(100000,()=>{});resume(m);clock.reset();clock.advance(100010,step);assert.equal(m.aim.remaining,1);
});
