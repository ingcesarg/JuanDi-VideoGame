import { CONFIG, clamp, distance, POWER_NAMES } from './config.js';
import { createPowers, activatePower, consumePower, selectPower, collectItem } from './powers.js';
import { awardPoint, registerContact, landingWinner } from './rules.js';
import { launch, predict, advanceBall } from './physics.js';

export const ATTACK_ZONES = [2.4, 5.8].flatMap((y, row) => [2, 5, 8].map((x, column) => ({
  x, y, label: `${['Izquierda', 'Centro', 'Derecha'][column]} ${row === 0 ? 'profunda' : 'corta'}`,
})));

function notify(m, text) { m.notice = { text, remaining: CONFIG.noticeSeconds }; }
function humanContactNumber(m) { return m.ball.lastTeam === 0 ? m.contacts + 1 : 1; }
export function contactContext(m) {
  if (m.phase === 'home') return 'Recepción y ataque son tuyos · el compañero ayuda a armar';
  if (m.phase === 'paused') return 'Partido pausado · reanuda con el botón';
  if (m.aim) return 'Tu ataque · flechas eligen zona, Espacio confirma';
  if (m.phase === 'serve') return m.server === 0 ? 'Tu saque · Espacio' : 'Prepárate para tu recepción';
  if (m.phase !== 'rally') return 'Siguiente jugada';
  const n = humanContactNumber(m);
  return n === 1 ? 'Tu recepción · tú debes pulsar Espacio' : n === 2 ? 'Armado · compañero asistido o Espacio si lo seleccionas' : n === 3 ? 'Tu ataque · acércate y pulsa Espacio para apuntar' : 'Defiende la devolución rival';
}

export function createMatch(random = Math.random) {
  const match = {
    phase: 'serve', score: [0, 0], server: 0, active: 0, winner: null,
    timer: 0, elapsed: 0, contacts: 0, lock: 0, flight: 0, random,
    aim: null, aimUsedFlight: null, notice: null, pauseReason: '',
    players: [
      { id: 0, team: 0, name: 'Leo', number: 7, x: 3, y: 15, z: 0, vz: 0, attempt: 0 },
      { id: 1, team: 0, name: 'Vale', number: 12, x: 7, y: 12, z: 0, vz: 0, attempt: 0 },
      { id: 2, team: 1, name: 'Rayo', number: 3, x: 3, y: 4, z: 0, vz: 0, attempt: 0 },
      { id: 3, team: 1, name: 'Luna', number: 9, x: 7, y: 5, z: 0, vz: 0, attempt: 0 },
    ],
    ball: { x: 3, y: 15, z: 1.7, vx: 0, vy: 0, vz: 0, lastTeam: null },
    powers: createPowers(), stats: { placements: 0, placementPoints: 0, streak: 0, bestStreak: 0, hits: 0 },
    lastAttack: null, lastHitter: null, item: null, message: 'Tu saque · Pulsa Espacio', flash: 0,
  };
  prepareServe(match);
  return match;
}

export function prepareServe(m) {
  m.phase = 'serve'; m.timer = CONFIG.rivalServeDelay; m.contacts = 0; m.lock = 0;
  m.lastAttack = null; m.lastHitter = null; m.flight++;
  m.aim = null;
  const positions = [[3, 15.8], [7, 12.2], [3, 3], [7, 5.8]];
  m.players.forEach((p, i) => { [p.x, p.y] = positions[i]; p.z = p.vz = p.attempt = 0; p.action = null; });
  const server = m.players[m.server === 0 ? m.active : 2];
  Object.assign(m.ball, { x: server.x, y: server.y, z: 1.7, vx: 0, vy: 0, vz: 0, lastTeam: null });
  m.item = { x: 2 + m.random() * 6, y: 11.5 + m.random() * 4, type: m.random() < 0.5 ? 'jump' : 'spike', collected: false };
  m.message = m.server === 0 ? 'Tu saque · Pulsa Espacio' : 'Los del Parque preparan el saque';
}

export function freeZones(m, team = 1) {
  const players = m.players.filter(p => p.team === team);
  return [2, 5, 8].flatMap(x => (team === 1 ? [2.4, 5.8] : [12.2, 15.6]).map(y => ({ x, y })))
    .map(zone => ({ ...zone, clearance: Math.min(...players.map(p => distance(p, zone))) }))
    .sort((a, b) => b.clearance - a.clearance);
}

export function canHit(m, p) {
  return m.phase === 'rally' && m.lock <= 0 && distance(p, m.ball) <= CONFIG.contactRadius &&
    m.ball.z > 0.2 && m.ball.z <= CONFIG.contactHeight + p.z;
}

export function jump(m, p) {
  if (p.z > 0.01) return false;
  const powered = p.id === m.active && consumePower(m.powers, 'jump');
  p.vz = powered ? CONFIG.superJumpSpeed : CONFIG.jumpSpeed;
  p.action = { kind: powered ? 'superJump' : 'jump', powered, remaining: 1 };
  if (p.id === m.active) notify(m, powered ? 'Súper salto ejecutado · 1 preparado consumido' : 'Salto normal · busca la pelota en el aire');
  if (powered) { m.message = '¡Súper salto!'; m.flash = 0.7; }
  return true;
}

function attackTarget(m, p, direction) {
  if (p.team === 1) {
    // La máquina apunta a espacios, con variación provisional y sin teletransporte.
    const zone = freeZones(m, 0)[0];
    return { x: clamp(zone.x + (m.random() - 0.5) * 1.8, 0.8, 9.2), y: zone.y };
  }
  return { x: clamp(5 + direction.x * 3.2, 1, 9), y: clamp(4 + direction.y * 2.2, 1, 8) };
}

export function serve(m, direction = { x: 0, y: 0 }) {
  if (m.phase !== 'serve') return false;
  const p = m.players[m.server === 0 ? m.active : 2];
  Object.assign(m.ball, { x: p.x, y: p.y, z: 1.7, lastTeam: p.team });
  m.phase = 'rally'; m.contacts = 0; m.lastHitter = p.id;
  launch(m.ball, attackTarget(m, p, direction), CONFIG.serveTime);
  m.flight++;
  m.lock = CONFIG.contactLock;
  m.message = p.team === 0 ? '¡Saque GOCA! Prepárate para la devolución' : '¡Recibe! Acércate al círculo de caída';
  return true;
}

export function hit(m, p, direction = { x: 0, y: 0 }, block = false, aimedTarget = null) {
  if (!canHit(m, p)) return false;
  const previousTeam = m.ball.lastTeam;
  const count = previousTeam !== p.team ? 1 : m.contacts + 1;
  if (!registerContact(m, p.team, block)) return false;
  const mate = m.players.find(other => other.team === p.team && other.id !== p.id);
  let target, duration, height;
  if (block) {
    target = { x: clamp(m.ball.x, 0.5, 9.5), y: p.team === 0 ? 6.5 : 11.5 };
    duration = 0.7; height = 0;
    m.message = `${p.name} · ¡Bloqueo!`;
    p.action = { kind: 'block', powered: p.action?.powered ?? false, remaining: 0.8 };
    m.lastAttack = null;
  } else if (count === 1) {
    target = { x: mate.x, y: p.team === 0 ? 12 : 6 };
    duration = CONFIG.receiveTime; height = 1.6;
    m.message = `${p.name} · Recepción → ${mate.name}`;
    p.action = { kind: 'receive', remaining: 0.65 };
    m.lastAttack = null;
  } else if (count === 2) {
    target = { x: clamp(mate.x, 1.5, 8.5), y: p.team === 0 ? 10.8 : 7.2 };
    duration = CONFIG.setTime; height = 2.6;
    m.message = `${p.name} · Armado → ${mate.name}, ¡a rematar!`;
    p.action = { kind: 'set', remaining: 0.65 };
  } else {
    target = aimedTarget ?? attackTarget(m, p, direction);
    const powered = p.id === m.active && consumePower(m.powers, 'spike');
    duration = CONFIG.spikeTime / (powered ? CONFIG.powerSpeed : 1); height = 0;
    const free = Math.min(...m.players.filter(q => q.team !== p.team).map(q => distance(q, target))) >= CONFIG.freeRadius;
    m.lastAttack = { team: p.team, free, powered, target: { x: target.x, y: target.y } };
    p.action = { kind: 'spike', powered, remaining: 0.8 };
    if (free && p.team === 0) m.stats.placements++;
    m.message = `${p.name} · ${powered ? '¡Remate potente!' : '¡Remate!'}${free ? ' Espacio libre' : ''}`;
    m.flash = powered ? 0.7 : 0;
    if (powered) notify(m, `Remate potente ejecutado · 1 preparado consumido · ${target.label ?? 'destino conservado'}`);
  }
  launch(m.ball, target, duration, height);
  m.flight++;
  m.lock = CONFIG.contactLock; m.lastHitter = p.id;
  if (p.team === 0) m.stats.hits++;
  p.attempt = 0;
  return true;
}

function openAim(m, p) {
  if (!canHit(m, p) || humanContactNumber(m) !== 3 || m.aimUsedFlight === m.flight) return false;
  m.aimUsedFlight = m.flight;
  m.aim = { attackerId: p.id, zone: 1, remaining: CONFIG.aimSeconds, flight: m.flight };
  p.attempt = 0;
  m.message = 'Elige una de seis zonas con las flechas · pulsa Espacio de nuevo para confirmar';
  return true;
}
export function chooseAim(m, code) {
  if (m.phase !== 'rally' || !m.aim) return;
  let column = m.aim.zone % 3, row = Math.floor(m.aim.zone / 3);
  if (code === 'ArrowLeft') column = Math.max(0, column - 1);
  if (code === 'ArrowRight') column = Math.min(2, column + 1);
  if (code === 'ArrowUp') row = 0;
  if (code === 'ArrowDown') row = 1;
  m.aim.zone = row * 3 + column;
}
function cancelAim(m) {
  m.aim = null;
  m.message = 'Ataque cancelado · la pelota salió de tu alcance. Conservas el remate preparado.';
  notify(m, m.message);
}
export function confirmAim(m) {
  if (m.phase !== 'rally' || !m.aim) return false;
  const aim = m.aim, p = m.players[aim.attackerId];
  if (!canHit(m, p) || m.flight !== aim.flight || humanContactNumber(m) !== 3) { cancelAim(m); return false; }
  m.aim = null;
  return hit(m, p, { x: 0, y: 0 }, false, ATTACK_ZONES[aim.zone]);
}
function tryHumanContact(m, p, direction) {
  if (p.blocking) return p.z > 0.15 && hit(m, p, direction, true);
  if (humanContactNumber(m) === 3) return openAim(m, p);
  return hit(m, p, direction);
}

export function humanAction(m, direction = { x: 0, y: 0 }) {
  if (m.phase === 'serve' && m.server === 0) return serve(m, direction);
  if (m.phase !== 'rally') return false;
  if (m.aim) return confirmAim(m);
  const p = m.players[m.active];
  if (humanContactNumber(m) === 3 && m.aimUsedFlight === m.flight) {
    m.message = 'Esta oportunidad de ataque ya terminó · prepara la siguiente jugada';
    return false;
  }
  const block = Math.abs(p.y - CONFIG.netY) < 1.4 && m.ball.lastTeam === 1 && m.ball.z > 2;
  if (block || (distance(p, m.ball) <= CONFIG.contactRadius + 0.4 && m.ball.z > CONFIG.contactHeight)) jump(m, p);
  p.attempt = CONFIG.actionWindow;
  p.blocking = block;
  const success = tryHumanContact(m, p, direction);
  if (!success) m.message = block ? 'Bloqueo · alcanza la pelota durante el salto' : 'Acércate a la pelota y pulsa cuando esté a tu alcance';
  return success;
}

function moveTo(p, target, speed, dt) {
  const d = distance(p, target);
  if (d > 0.06) { const step = Math.min(d, speed * dt); p.x += (target.x - p.x) / d * step; p.y += (target.y - p.y) / d * step; }
  keepInCourt(p);
}
function keepInCourt(p) {
  p.x = clamp(p.x, 0.3, 9.7);
  p.y = clamp(p.y, p.team === 0 ? 9.35 : 0.3, p.team === 0 ? 17.7 : 8.65);
}

export function updateAI(m, dt) {
  const projected = predict(m.ball, 1.65);
  const team = projected.y > CONFIG.netY ? 0 : 1;
  const candidates = m.players.filter(p => p.team === team);
  // Levemente penalizar al último que tocó evita contactos sucesivos involuntarios.
  const receiver = [...candidates].sort((a, b) =>
    (distance(a, projected) + (a.id === m.lastHitter ? 2 : 0)) - (distance(b, projected) + (b.id === m.lastHitter ? 2 : 0)))[0];
  for (const p of m.players) {
    if (p.id === m.active) continue;
    const target = p.id === receiver.id ? projected : { x: p.id % 2 === 0 ? 3 : 7, y: p.team === 0 ? 12.2 : 5.8 };
    moveTo(p, target, p.team === 1 ? CONFIG.rivalSpeed : CONFIG.aiSpeed, dt);
    if (p.id === receiver.id && m.ball.vz < 0 && distance(p, m.ball) < CONFIG.contactRadius) {
      const count = m.ball.lastTeam === p.team ? m.contacts : 0;
      // Tab cambia selección, nunca la responsabilidad de recepción o ataque.
      if (p.team === 0 && count !== 1) continue;
      if (count >= 2 && m.ball.z > 2.3 && m.ball.z < 4) jump(m, p);
      if (canHit(m, p) && p.missedFlight !== m.flight) {
        if (p.team === 1 && m.random() < CONFIG.rivalMissChance) p.missedFlight = m.flight;
        else hit(m, p);
      }
    }
  }
}

export function update(m, simulationDt, direction = { x: 0, y: 0 }, realDt = simulationDt) {
  if (['paused', 'results', 'home'].includes(m.phase)) return;
  const aiming = Boolean(m.aim), dt = simulationDt * (aiming ? CONFIG.aimScale : 1);
  if (m.notice) { m.notice.remaining -= realDt; if (m.notice.remaining <= 0) m.notice = null; }
  m.elapsed += dt; m.flash = Math.max(0, m.flash - dt);
  if (m.phase === 'point') { m.timer -= dt; if (m.timer <= 0) prepareServe(m); return; }
  const active = m.players[m.active];
  const norm = Math.hypot(direction.x, direction.y) || 1;
  if (!aiming) {
    active.x += direction.x / norm * CONFIG.playerSpeed * dt;
    active.y += direction.y / norm * CONFIG.playerSpeed * dt;
  }
  keepInCourt(active);
  for (const p of m.players) {
    if (p.action) {
      p.action.remaining -= dt;
      const airborneJump = ['jump','superJump'].includes(p.action.kind) && (p.z > 0 || p.vz > 0);
      if (p.action.remaining <= 0 && !airborneJump) p.action = null;
    }
    if (p.z > 0 || p.vz > 0) {
      p.z = Math.max(0, p.z + p.vz * dt - 0.5 * CONFIG.gravity * dt * dt);
      p.vz -= CONFIG.gravity * dt;
      if (p.z === 0) p.vz = 0;
    }
  }
  if (m.phase === 'serve') {
    const p = m.players[m.server === 0 ? m.active : 2];
    Object.assign(m.ball, { x: p.x, y: p.y, z: 1.7 });
    m.timer -= dt;
    if (m.server === 1 && m.timer <= 0) serve(m);
    return;
  }
  m.lock = Math.max(0, m.lock - dt);
  if (advanceBall(m.ball, dt)) m.message = 'La pelota tocó la red';
  if (m.ball.z <= 0) { m.ball.z = 0; awardPoint(m, landingWinner(m.ball), 'Pelota fuera' + ((m.ball.x >= 0 && m.ball.x <= 10 && m.ball.y >= 0 && m.ball.y <= 18) ? ' de alcance' : ' de la cancha')); return; }
  if (m.aim) {
    m.aim.remaining = Math.max(0, m.aim.remaining - realDt);
    if (!canHit(m, m.players[m.aim.attackerId]) || m.flight !== m.aim.flight) cancelAim(m);
    else if (m.aim.remaining <= 0) confirmAim(m);
  } else if (active.attempt > 0) {
    active.attempt -= dt;
    tryHumanContact(m, active, direction);
  }
  if (m.phase !== 'rally') return;
  updateAI(m, dt);
  if (!aiming && !m.aim && m.item && !m.item.collected && distance(active, m.item) < CONFIG.pickupRadius) {
    const type = m.item.type;
    collectItem(m);
    const instructions = type === m.powers.selected ? 'pulsa E para preparar' : 'selecciona con Q y pulsa E para preparar';
    notify(m, `Objeto recogido · +1 ${POWER_NAMES[type]} disponible · ${instructions}`);
    m.message = m.notice.text; m.flash = 0.5;
  }
}

export function switchPlayer(m) {
  if (!['serve', 'rally'].includes(m.phase) || (m.phase === 'serve' && m.server === 1)) return;
  if (m.aim) { m.message = 'Confirma el destino antes de cambiar'; notify(m, m.message); return; }
  m.players[m.active].attempt = 0;
  m.active = 1 - m.active;
}
export function powerAction(m, select = false) {
  if (!['serve', 'rally'].includes(m.phase)) return;
  if (select) {
    selectPower(m.powers);
    m.message = `${POWER_NAMES[m.powers.selected]} seleccionado · E prepara un uso, no lo ejecuta aún`;
  } else m.message = activatePower(m.powers) ? `${POWER_NAMES[m.powers.selected]} · 1 disponible → 1 preparado · se usa en tu próxima acción compatible` : 'Sin usos disponibles · recoge un objeto en la cancha';
  notify(m, m.message);
}
export function pause(m, reason = 'Pausa manual') {
  if (!['serve', 'rally', 'point'].includes(m.phase)) return;
  m.pauseReason = reason;
  m.resumePhase = m.phase; m.phase = 'paused';
  m.players.forEach(p => { p.attempt = 0; });
}
export function resume(m) { if (m.phase === 'paused') m.phase = m.resumePhase; }
