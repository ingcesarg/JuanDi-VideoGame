import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, serve, hit, pause, resume, powerAction, jump } from '../src/game.js';
import { awardPoint } from '../src/rules.js';
import { createEventCursor, emitPresentation } from '../src/presentation.js';
import { createPreferences, PREFERENCES_KEY } from '../src/preferences.js';
import { createAudio } from '../src/audio.js';
import { render } from '../src/render.js';

test('Eventos únicos, cola acotada, golpe fallido y pausa/revancha sin backlog',()=>{
  const m=createMatch(),cursor=createEventCursor();
  assert.equal(serve(m),true);assert.deepEqual(cursor.read(m).map(e=>e.kind),['serve']);
  assert.deepEqual(cursor.read(m),[]);
  m.lock=0;Object.assign(m.ball,{x:0,y:0,z:1});
  assert.equal(hit(m,m.players[0]),false);assert.deepEqual(cursor.read(m),[]);
  powerAction(m);assert.equal(cursor.read(m)[0].kind,'prepare');
  for(let i=0;i<40;i++)emitPresentation(m,'pickup');
  assert.equal(m.presentationEvents.length,32);
  pause(m);resume(m);assert.deepEqual(cursor.read(m),[]);
  const next=createMatch();serve(next);assert.equal(cursor.read(next).length,1);
  cursor.discard(next);assert.deepEqual(cursor.read(next),[]);
});
test('Punto y resultado emiten solo una vez por jugada',()=>{
  const m=createMatch();m.phase='rally';m.score=[14,0];
  awardPoint(m,0,'Test');awardPoint(m,0,'Repeated');
  assert.deepEqual(m.presentationEvents.map(e=>e.kind),['result']);
});
test('Preferencias independientes, volumen validado y fallback conservan documento inválido',()=>{
  let raw=null;const keys=[];
  const store={getItem:()=>raw,setItem:(key,value)=>{keys.push(key);raw=value;}};
  const p=createPreferences(store,true);
  assert.equal(p.snapshot().muted,true);assert.equal(p.snapshot().volume,.3);assert.equal(p.snapshot().reducedMotion,true);
  assert.equal(p.set({volume:2}),false);p.set({volume:.5,muted:false});
  assert.deepEqual(keys,[PREFERENCES_KEY]);
  assert.equal(createPreferences(store).snapshot().volume,.5);
  raw='{"version":2}';const invalid=createPreferences(store);invalid.set({volume:.2});
  assert.equal(raw,'{"version":2}');assert.equal(invalid.snapshot().persistent,false);
  assert.equal(createPreferences(null).snapshot().muted,true);
});
function fakeAudio(){
  const state={starts:0,stops:0,suspends:0,resumes:0,gains:[]};
  const param={setValueAtTime(){},exponentialRampToValueAtTime(){}};
  const context={currentTime:0,sampleRate:48000,createBuffer:(_,length)=>({getChannelData:()=>new Float32Array(length)}),createBufferSource:()=>({connect(){},disconnect(){},start(){state.starts++;},stop(){state.stops++;}}),destination:{},resume:async()=>{state.resumes++;},suspend:async()=>{state.suspends++;},
    createOscillator:()=>({frequency:param,connect(){},disconnect(){},start(){state.starts++;},stop(){state.stops++;}}),
    createGain:()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(value){state.gains.push(value);}},connect(){},disconnect(){}})};
  return {state,context};
}
test('Audio exige gesto, limita ganancia y detiene fuentes al silenciar',async()=>{
  const {state,context}=fakeAudio();let created=0;
  const audio=createAudio(()=>{created++;return context;});
  assert.equal(audio.play('serve'),false);assert.equal(created,0);
  await audio.enable(.3);assert.equal(audio.play('serve'),true);
  assert.ok(Math.max(...state.gains)<=.12);assert.equal(state.starts,1);
  audio.stop();assert.equal(audio.play('serve'),false);assert.ok(state.stops>=2);
  await audio.enable(.3);assert.equal(audio.play('unknown'),false);
  audio.setVolume(0);assert.equal(audio.play('pickup'),false);
});
test('Cursor de audio impide repetición y descarta sonidos durante pausa',async()=>{
  const {state,context}=fakeAudio(),audio=createAudio(()=>context),cursor=createEventCursor(),m=createMatch();
  await audio.enable(.3);emitPresentation(m,'serve');
  for(let i=0;i<3;i++)for(const e of cursor.read(m))audio.play(e.kind);
  assert.equal(state.starts,1);audio.stop();emitPresentation(m,'pickup');cursor.discard(m);
  await audio.enable(.3);for(const e of cursor.read(m))audio.play(e.kind);
  assert.equal(state.starts,1);
});
test('Ausencia/rechazo de audio y pausa durante activación no dejan promesas rechazadas ni audio activo',async()=>{
  const unavailable=createAudio(()=>{throw Error('Unsupported');});
  assert.equal(await unavailable.enable(.3),false);assert.equal(unavailable.status().available,false);
  const {context}=fakeAudio();context.resume=async()=>{throw Error('Denied');};
  const denied=createAudio(()=>context);assert.equal(await denied.enable(.3),false);
  let finish;context.resume=()=>new Promise(resolve=>{finish=resolve;});
  const racing=createAudio(()=>context),pending=racing.enable(.3);racing.stop();finish();
  assert.equal(await pending,false);assert.equal(racing.status().enabled,false);
});
test('Render normal/reducido no modifica simulación y pausa congela comandos de dibujo',()=>{
  const calls=[];
  const ctx=new Proxy({}, {get:(_,key)=>{
    if(key==='createLinearGradient')return ()=>({addColorStop(){}});
    return (...args)=>calls.push([key,...args]);
  },set:()=>true});
  const m=createMatch();serve(m);const before=JSON.stringify(m);
  render(ctx,m);render(ctx,m,{reducedMotion:true});assert.equal(JSON.stringify(m),before);
  pause(m);calls.length=0;render(ctx,m,{reducedMotion:true});const one=JSON.stringify(calls);
  calls.length=0;render(ctx,m,{reducedMotion:true});assert.equal(JSON.stringify(calls),one);
});


test('Poder ejecutado emite su sonido propio; preparar no ejecuta el poder', () => {
  const m=createMatch();
  powerAction(m);
  assert.deepEqual(m.presentationEvents.map(e=>e.kind),['prepare']);
  jump(m,m.players[0]);
  assert.equal(m.presentationEvents.at(-1).kind,'superJump');
  m.players[0].z=0;m.powers.pending.jump=0;
  jump(m,m.players[0]);assert.equal(m.presentationEvents.at(-1).kind,'jump');
  m.phase='rally';m.lock=0;m.contacts=2;m.powers.pending.spike=1;
  Object.assign(m.ball,{x:m.players[0].x,y:m.players[0].y,z:1.7,lastTeam:0});
  assert.equal(hit(m,m.players[0]),true);
  assert.equal(m.presentationEvents.at(-1).kind,'powerSpike');
});

test('Sonidos de poderes tienen timbre y capas distintos, con silencio para todas las fuentes', async () => {
  for (const [normal,powered] of [['jump','superJump'],['spike','powerSpike']]) {
    const sources=[],levels=[];
    const {context}=fakeAudio();
    context.createOscillator=()=>{
      const source={frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(time){this.startTime=time;},stop(){this.stopped=true;}};
      sources.push(source);return source;
    };
    context.createBufferSource=()=>{
      const source={connect(){},disconnect(){},start(time){this.startTime=time;},stop(){this.stopped=true;}};
      sources.push(source);return source;
    };
    context.createGain=()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(value){levels.push(value);}},connect(){},disconnect(){}});
    const audio=createAudio(()=>context);await audio.enable(1);
    audio.play(normal);const ordinary=sources.splice(0);levels.length=0;
    audio.play(powered);
    assert.ok(sources.length>ordinary.length);
    if(powered==='powerSpike')assert.ok(sources.some(source=>source.buffer),'El impacto potente incluye ruido, no solo tonos');
    assert.notEqual(sources[0].type,ordinary[0].type);
    assert.ok(sources[1].startTime>sources[0].startTime);
    assert.ok(levels.filter(n=>n>.0001).reduce((a,b)=>a+b,0)<=.12);
    audio.stop();assert.ok(sources.every(source=>source.stopped));
    const count=sources.length;assert.equal(audio.play(powered),false);assert.equal(sources.length,count);
  }
});
