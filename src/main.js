import './style.css';
import { CONFIG } from './config.js';
import { createMatch, update, humanAction, switchPlayer, powerAction, pause, resume } from './game.js';
import { render } from './render.js';
import { createInput } from './input.js';

const $ = id => document.getElementById(id);
const canvas = $('court'), ctx = canvas.getContext('2d');
let match = createMatch(); match.phase = 'home';
let accumulator = 0, lastTime = 0, lastMessage = '', lastPhase = '';

function pauseGame() { pause(match); input.clear(); accumulator = 0; sync(); }
function start() { match = createMatch(); input.clear(); accumulator = 0; sync(); canvas.focus({ preventScroll: true }); }
function resumeGame() { resume(match); input.clear(); accumulator = 0; sync(); canvas.focus({ preventScroll: true }); }
const input = createInput(canvas, () => ['serve','rally','point'].includes(match.phase), code => {
  if (code === 'Space') humanAction(match, input.direction());
  if (code === 'Tab') switchPlayer(match);
  if (code === 'KeyQ') powerAction(match, true);
  if (code === 'KeyE') powerAction(match);
  if (code === 'Escape') pauseGame();
  sync();
});
$('play-button').addEventListener('click', start);
$('rematch-button').addEventListener('click', start);
$('resume-button').addEventListener('click', resumeGame);
$('pause-button').addEventListener('click', pauseGame);
window.addEventListener('blur', pauseGame);
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }));
$('help-button').addEventListener('click', () => { pauseGame(); $('help-dialog').showModal(); });
$('close-help').addEventListener('click', () => $('help-dialog').close());
for (const type of ['jump','spike']) $(''+type+'-card').addEventListener('click', () => {
  if (!['rally','serve'].includes(match.phase)) return;
  match.powers.selected = type; sync(); canvas.focus({ preventScroll: true });
});

function sync() {
  $('score-home').textContent = match.score[0]; $('score-away').textContent = match.score[1];
  $('serve-home').hidden = match.server !== 0; $('serve-away').hidden = match.server !== 1;
  for (let i=0;i<2;i++) $('player-'+i).classList.toggle('active',match.active===i);
  for(const type of ['jump','spike']) {
    $(type+'-stock').textContent = match.powers.stock[type];
    $(type+'-pending').textContent = `${match.powers.pending[type]} preparados`;
    $(type+'-card').classList.toggle('selected',match.powers.selected===type);
    $(type+'-card').setAttribute('aria-pressed',String(match.powers.selected===type));
    $(type+'-selected').textContent = match.powers.selected===type ? 'E PREPARAR' : 'Q ELEGIR';
  }
  const message = match.phase==='home' ? 'Tu equipo está listo. Es hora de volver a jugar.' : match.message;
  if(message!==lastMessage){$('status').textContent=message;lastMessage=message;}
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
  if(match.phase==='paused'&&lastPhase!=='paused'&&!$('help-dialog').open) $('resume-button').focus({preventScroll:true});
  lastPhase=match.phase;
}
function frame(time) {
  const elapsed = lastTime ? Math.min((time-lastTime)/1000,CONFIG.maxFrame) : 0;
  lastTime=time;
  if(!['home','paused','results'].includes(match.phase)) {
    accumulator+=elapsed;
    while(accumulator>=CONFIG.step){update(match,CONFIG.step,input.direction());accumulator-=CONFIG.step;}
  }else accumulator=0;
  render(ctx,match); sync(); requestAnimationFrame(frame);
}
sync(); requestAnimationFrame(frame);
