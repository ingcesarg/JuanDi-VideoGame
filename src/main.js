import { createAudio } from './audio.js';
import { createPreferences } from './preferences.js';
import { createEventCursor } from './presentation.js';
import { difficultyProfile } from './difficulty.js';
import './style.css';
import { CONFIG, POWER_NAMES } from './config.js';
import { createProgress } from './progress.js';
import { createClock } from './clock.js';
import { createMatch, update, humanAction, switchPlayer, powerAction, pause, resume, chooseAim, ATTACK_ZONES, contactContext } from './game.js';
import { render } from './render.js';
import { createInput } from './input.js';

const $ = id => document.getElementById(id);
const canvas = $('court'), ctx = canvas.getContext('2d');
let match = createMatch(); match.phase = 'home';
const clock = createClock();
let storage;
try { storage = window.localStorage; } catch { storage = null; }
const progress = createProgress(storage);
const preferences = createPreferences(storage, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const audio = createAudio(() => new (window.AudioContext || window.webkitAudioContext)());
const audioCursor = createEventCursor();
async function activateAudio() {
  audioCursor.discard(match);
  if (!preferences.snapshot().muted) await audio.enable(preferences.snapshot().volume);
  syncPresentation();
}
function syncPresentation() {
  const p = preferences.snapshot(), status = audio.status();
  $('sound-toggle').textContent = p.muted ? 'Activar sonido' : 'Silenciar';
  $('sound-toggle').setAttribute('aria-pressed', String(!p.muted));
  $('sound-volume').value = Math.round(p.volume * 100);
  $('volume-value').textContent = `${Math.round(p.volume * 100)} %`;
  $('reduced-motion').checked = p.reducedMotion;
  $('sound-status').textContent = !status.available ? 'Sonido no disponible. Puedes seguir jugando.' : p.muted ? 'Sonido silenciado' : status.enabled ? 'Sonido activado' : 'Sonido en pausa · se activa al continuar';
  $('preferences-warning').textContent = p.persistent ? '' : 'Preferencias temporales: no se guardarán al recargar.';
}
let matchId = '', reward = 0, shopMessage = '', selectedDifficulty = 'beginner';
let lastMessage = '', lastPhase = '';

function resetClock() { clock.reset(); }
function pauseGame(reason = 'Pausa manual') { pause(match, reason); if (match.phase === 'paused' || ['Ventana sin foco','Pestaña oculta'].includes(reason)) audio.stop(); audioCursor.discard(match); input.clear(); resetClock(); sync(); }
function start() {
  const reserve = progress.takeReserve();
  match = createMatch(Math.random, { difficulty: selectedDifficulty });
  for (const type of ['jump', 'spike']) match.powers.stock[type] += reserve[type];
  matchId = crypto.randomUUID(); reward = 0; shopMessage = '';
  audio.stop(); audioCursor.discard(match);
  input.clear(); resetClock(); sync(); canvas.focus({ preventScroll: true }); activateAudio();
}
function resumeGame() { input.clear(); resetClock(); resume(match); audioCursor.discard(match); sync(); canvas.focus({ preventScroll: true }); activateAudio(); }
const input = createInput(canvas, () => ['serve','rally','point'].includes(match.phase), code => {
  if (code === 'Space') humanAction(match, input.direction());
  if (code.startsWith('Arrow')) chooseAim(match, code);
  if (code === 'Tab') switchPlayer(match);
  if (code === 'KeyQ') powerAction(match, true);
  if (code === 'KeyE') powerAction(match);
  if (code === 'Escape') pauseGame();
  sync();
});
$('play-button').addEventListener('click', start);
$('rematch-button').addEventListener('click', start);
$('resume-button').addEventListener('click', resumeGame);
$('pause-button').addEventListener('click', () => pauseGame('Pausa manual'));
window.addEventListener('blur', () => pauseGame('Ventana sin foco'));
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame('Pestaña oculta'); });
canvas.addEventListener('blur', event => pauseGame(event.relatedTarget?.id === 'help-button' ? 'Instrucciones abiertas' : event.relatedTarget?.id === 'presentation-button' ? 'Ajustes de sonido y movimiento' : 'Cancha sin foco'));
canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }));
$('help-button').addEventListener('click', () => { pauseGame('Instrucciones abiertas'); $('help-dialog').showModal(); });
$('close-help').addEventListener('click', () => $('help-dialog').close());
$('presentation-button').addEventListener('click', () => { pauseGame('Ajustes de sonido y movimiento'); $('presentation-dialog').showModal(); });
$('close-presentation').addEventListener('click', () => $('presentation-dialog').close());
$('presentation-dialog').addEventListener('close', () => { audio.stop(); audioCursor.discard(match); syncPresentation(); });
$('sound-toggle').addEventListener('click', async () => {
  const muted = !preferences.snapshot().muted;
  preferences.set({ muted }); audioCursor.discard(match);
  if (muted) audio.stop(); else await activateAudio();
  syncPresentation();
});
$('test-sound').addEventListener('click', async () => {
  preferences.set({ muted: false });
  await activateAudio(); audio.play('pickup'); syncPresentation();
});
$('sound-volume').addEventListener('input', event => {
  const volume = Number(event.target.value) / 100;
  preferences.set({ volume }); audio.setVolume(volume); syncPresentation();
});
$('reduced-motion').addEventListener('change', event => { preferences.set({ reducedMotion: event.target.checked }); syncPresentation(); });
for (const type of ['jump','spike']) {
  // Selecting a power with the mouse keeps the court's keyboard focus.
  $(type+'-card').addEventListener('mousedown', event => {
    if (event.button === 0 && document.activeElement === canvas) event.preventDefault();
  });
  $(''+type+'-card').addEventListener('click', () => {
  if (!['rally','serve'].includes(match.phase)) return;
  match.powers.selected = type; sync(); canvas.focus({ preventScroll: true });
  });
}

for (const place of ['home', 'result']) {
  $(place+'-difficulty').addEventListener('change', event => {
    if (!['home', 'results'].includes(match.phase)) return;
    selectedDifficulty = difficultyProfile(event.target.value).id;
    sync();
  });
  for (const type of ['jump', 'spike']) $(place+'-buy-'+type).addEventListener('click', () => {
    shopMessage = progress.buy(type, match.phase)
      ? `${POWER_NAMES[type]}: +1 reservado para el próximo partido.`
      : 'No tienes créditos suficientes para esta compra.';
    sync();
  });
}

function sync() {
  syncPresentation();
  if (match.phase === 'results' && lastPhase !== 'results') reward = progress.reward(matchId, match.winner);
  const profile = progress.snapshot();
  $('match-difficulty').textContent = difficultyProfile(match.difficulty).name;
  $('result-difficulty').textContent = `Nivel jugado: ${difficultyProfile(match.difficulty).name}`;
  for (const place of ['home', 'result']) {
    $(place+'-difficulty').value = selectedDifficulty;
    $(place+'-difficulty').disabled = !['home', 'results'].includes(match.phase);
    $(place+'-difficulty-help').textContent = difficultyProfile(selectedDifficulty).description;
    $(place+'-credits').textContent = `${profile.credits} créditos`;
    $(place+'-reserve').textContent = `Reserva: ${profile.reserve.jump} súper saltos · ${profile.reserve.spike} remates potentes`;
    $(place+'-shop-message').textContent = shopMessage;
    $(place+'-storage-warning').textContent = profile.warning;
    for (const type of ['jump', 'spike']) {
      const button = $(place+'-buy-'+type);
      button.textContent = `${POWER_NAMES[type]} · ${CONFIG.powerPrices[type]} créditos`;
      button.disabled = !['home', 'results'].includes(match.phase);
    }
  }
  $('result-reward').textContent = `Premio del partido: +${reward} créditos`;
  $('score-home').textContent = match.score[0]; $('score-away').textContent = match.score[1];
  $('serve-home').hidden = match.server !== 0; $('serve-away').hidden = match.server !== 1;
  for (let i=0;i<2;i++) $('player-'+i).classList.toggle('active',match.active===i);
  for(const type of ['jump','spike']) {
    $(type+'-stock').textContent = `${match.powers.stock[type]} disponibles`;
    $(type+'-pending').textContent = `${match.powers.pending[type]} preparados`;
    $(type+'-card').classList.toggle('selected',match.powers.selected===type);
    $(type+'-card').setAttribute('aria-pressed',String(match.powers.selected===type));
    $(type+'-selected').textContent = match.powers.selected===type ? 'E PREPARAR' : 'Q ELEGIR';
    $(type+'-card').disabled = ['home','paused','point','results'].includes(match.phase);
  }
  const message = match.phase==='home' ? 'Tu equipo está listo. Es hora de volver a jugar.' : match.message;
  if(message!==lastMessage){$('status').textContent=message;lastMessage=message;}
  $('contact-context').textContent = contactContext(match);
  const notification = match.notice?.text ?? '';
  if ($('notification').textContent !== notification) $('notification').textContent = notification;
  $('notification').hidden = !notification;
  $('pause-reason').textContent = match.pauseReason;
  $('aim-panel').hidden = !match.aim || match.phase !== 'rally';
  if (match.aim) {
    $('aim-target').textContent = ATTACK_ZONES[match.aim.zone].label;
    $('aim-time').textContent = `${match.aim.remaining.toFixed(1)} s`;
  }
  $('home-overlay').hidden = match.phase !== 'home';
  $('pause-overlay').hidden = match.phase !== 'paused';
  $('results-overlay').hidden = match.phase !== 'results';
  $('pause-button').hidden = !['serve','rally','point'].includes(match.phase);
  if(match.phase==='results'&&lastPhase!=='results') {
    $('result-title').textContent = match.winner===0 ? '¡GOCA vuelve a brillar!' : 'La próxima es nuestra.';
    $('result-score').textContent = `${match.score[0]} — ${match.score[1]}`;
    $('result-placement').textContent = match.stats.placements;
    $('result-streak').textContent = match.stats.bestStreak;
    $('result-tip').textContent = match.stats.placements>0 ? 'Bien visto: apuntaste a los espacios. Sigue leyendo la posición rival antes de rematar.' : 'Prueba dirigir tu remate con las flechas hacia las zonas verdes. El espacio es tu mejor aliado.';
    $('rematch-button').focus({preventScroll:true});
  }
  if(match.phase==='paused'&&lastPhase!=='paused'&&!$('help-dialog').open&&!$('presentation-dialog').open) $('resume-button').focus({preventScroll:true});
  lastPhase=match.phase;
}
function frame(time) {
  if(!['home','paused','results'].includes(match.phase)) {
    clock.advance(time, (dt, realDt) => update(match,dt,input.direction(),realDt));
  }else clock.reset();
  if (['home','paused'].includes(match.phase)) audioCursor.discard(match);
  else for (const event of audioCursor.read(match)) audio.play(event.kind);
  render(ctx,match,preferences.snapshot()); sync(); requestAnimationFrame(frame);
}
sync(); requestAnimationFrame(frame);
