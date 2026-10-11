import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgress, PROGRESS_KEY } from '../src/progress.js';
import { createMatch } from '../src/game.js';
function store(initial = null) {
  let value = initial;
  return { getItem: () => value, setItem: (key, next) => { assert.equal(key, PROGRESS_KEY); value = next; }, raw: () => value };
}
test('Perfil nuevo y victoria-compra-recarga-transferencia-revancha', () => {
  const storage = store(), p = createProgress(storage);
  assert.equal(p.snapshot().credits, 0);
  assert.equal(p.reward('one', 0), 10);
  assert.equal(p.buy('jump', 'results'), true);
  assert.equal(p.buy('spike', 'results'), true);
  const restored = createProgress(storage);
  assert.equal(restored.snapshot().credits, 0);
  const m = createMatch(), reserve = restored.takeReserve();
  for (const type of ['jump', 'spike']) m.powers.stock[type] += reserve[type];
  assert.deepEqual(m.powers.stock, {jump:3, spike:3});
  assert.deepEqual(m.powers.pending, {jump:0, spike:0});
  assert.deepEqual(createProgress(storage).takeReserve(), {jump:0, spike:0});
  assert.deepEqual(createMatch().powers.stock, {jump:2, spike:2});
});
test('Premio repetido incluso tras recarga; derrota conserva saldo', () => {
  const storage = store(), p = createProgress(storage);
  p.reward('one', 0);
  assert.equal(p.reward('one', 0), 0);
  const restored = createProgress(storage);
  assert.equal(restored.reward('one', 0), 0);
  assert.equal(restored.reward('two', 1), 0);
  assert.equal(restored.snapshot().credits, 10);
  assert.equal(restored.reward('three', 0), 10);
});
test('Saldo insuficiente, tipos inválidos y partido/pausa no permiten compra', () => {
  const p = createProgress(store());
  assert.equal(p.buy('jump','home'), false);
  p.reward('one',0);
  const before = p.snapshot();
  for (const phase of ['serve','rally','paused','point']) assert.equal(p.buy('jump',phase),false);
  assert.equal(p.buy('unknown','home'),false);
  assert.deepEqual(p.snapshot(),before);
  assert.equal(p.buy('jump','home'),true);
  assert.equal(p.buy('jump','home'),true);
  assert.equal(p.buy('jump','home'),false);
  assert.deepEqual(p.snapshot().reserve,{jump:2,spike:0});
});
test('Datos corruptos o incompatibles no se sobrescriben', () => {
  for (const value of ['{', JSON.stringify({version:2}), JSON.stringify({version:1,credits:-1,reserve:{jump:0,spike:0},lastReward:null}),JSON.stringify({version:1,credits:2.5,reserve:{jump:0,spike:0},lastReward:null}),JSON.stringify({version:1,credits:0,reserve:{jump:-1,spike:0},lastReward:null})]) {
    const storage=store(value),p=createProgress(storage);
    assert.equal(p.snapshot().persistent,false);
    assert.equal(p.snapshot().credits,0);
    p.reward('one',0);p.buy('spike','home');p.takeReserve();
    assert.equal(storage.raw(),value);
  }
});
test('Fallo de lectura o acceso mantiene perfil seguro en memoria', () => {
  for (const storage of [null,{getItem(){throw Error('denied');}}]) {
    const p=createProgress(storage);
    assert.equal(p.snapshot().persistent,false);
    p.reward('one',0);
    assert.equal(p.snapshot().credits,10);
    assert.ok(p.snapshot().warning);
  }
});
test('Fallo de escritura conserva operación y no duplica en la sesión', () => {
  const p=createProgress({getItem:()=>null,setItem(){throw Error('quota');}});
  p.reward('one',0);
  assert.equal(p.snapshot().persistent,false);
  assert.equal(p.reward('one',0),0);
  assert.equal(p.buy('jump','results'),true);
  assert.equal(p.snapshot().credits,5);
  assert.deepEqual(p.takeReserve(),{jump:1,spike:0});
  assert.deepEqual(p.takeReserve(),{jump:0,spike:0});
});
test('Snapshot no permite mutar reserva externamente', () => {
  const p=createProgress(store());
  p.snapshot().reserve.jump=100;
  assert.equal(p.snapshot().reserve.jump,0);
});
