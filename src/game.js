import { CONFIG, clamp, distance, POWER_NAMES } from './config.js';
import { createPowers, activatePower, consumePower, selectPower, collectItem } from './powers.js';
import { awardPoint, registerContact, landingWinner } from './rules.js';
import { launch, predict, advanceBall } from './physics.js';

export function createMatch(random = Math.random) {
  const match = {
    phase: 'serve', score: [0, 0], server: 0, active: 0, winner: null,
    timer: 0, elapsed: 0, contacts: 0, lock: 0, flight: 0, random,
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
  const positions = [[3, 15.8], [7, 12.2], [3, 3], [7, 5.8]];
  m.players.forEach((p, i) => { [p.x, p.y] = positions[i]; p.z = p.vz = p.attempt = 0; });
  if (m.server === 0) m.active = 0;
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

export function hit(m, p, direction = { x: 0, y: 0 }, block = false) {
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
    m.lastAttack = null;
  } else if (count === 1) {
    target = { x: mate.x, y: p.team === 0 ? 12 : 6 };
    duration = CONFIG.receiveTime; height = 1.6;
    m.message = `${p.name} · Recepción → ${mate.name}`;
    m.lastAttack = null;
  } else if (count === 2) {
    target = { x: clamp(mate.x, 1.5, 8.5), y: p.team === 0 ? 10.8 : 7.2 };
    duration = CONFIG.setTime; height = 2.6;
    m.message = `${p.name} · Armado → ${mate.name}, ¡a rematar!`;
  } else {
    target = attackTarget(m, p, direction);
    const powered = p.id === m.active && consumePower(m.powers, 'spike');
    duration = CONFIG.spikeTime / (powered ? CONFIG.powerSpeed : 1); height = 0;
    const free = Math.min(...m.players.filter(q => q.team !== p.team).map(q => distance(q, target))) >= CONFIG.freeRadius;
    m.lastAttack = { team: p.team, free };
    if (free && p.team === 0) m.stats.placements++;
    m.message = `${p.name} · ${powered ? '¡Remate potente!' : '¡Remate!'}${free ? ' Espacio libre' : ''}`;
    m.flash = powered ? 0.7 : 0;
  }
  launch(m.ball, target, duration, height);
  m.flight++;
  m.lock = CONFIG.contactLock; m.lastHitter = p.id;
  if (p.team === 0) m.stats.hits++;
  p.attempt = 0;
  return true;
}

export function humanAction(m, direction = { x: 0, y: 0 }) {
  if (m.phase === 'serve' && m.server === 0) return serve(m, direction);
  if (m.phase !== 'rally') return false;
  const p = m.players[m.active];
  const block = Math.abs(p.y - CONFIG.netY) < 1.4 && m.ball.lastTeam === 1 && m.ball.z > 2;
  if (block || (distance(p, m.ball) <= CONFIG.contactRadius + 0.4 && m.ball.z > CONFIG.contactHeight)) jump(m, p);
  p.attempt = CONFIG.actionWindow;
  p.blocking = block;
  const success = block && p.z <= 0.15 ? false : hit(m, p, direction, block);
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
      if (count >= 2 && m.ball.z > 2.3 && m.ball.z < 4) jump(m, p);
      if (canHit(m, p) && p.missedFlight !== m.flight) {
        if (p.team === 1 && m.random() < CONFIG.rivalMissChance) p.missedFlight = m.flight;
        else hit(m, p);
      }
    }
  }
}

export function update(m, dt, direction = { x: 0, y: 0 }) {
  if (['paused', 'results', 'home'].includes(m.phase)) return;
  m.elapsed += dt; m.flash = Math.max(0, m.flash - dt);
  if (m.phase === 'point') { m.timer -= dt; if (m.timer <= 0) prepareServe(m); return; }
  const active = m.players[m.active];
  const norm = Math.hypot(direction.x, direction.y) || 1;
  active.x += direction.x / norm * CONFIG.playerSpeed * dt;
  active.y += direction.y / norm * CONFIG.playerSpeed * dt;
  keepInCourt(active);
  for (const p of m.players) {
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
  if (active.attempt > 0) {
    active.attempt -= dt;
    hit(m, active, direction, active.blocking && active.z > 0.15);
  }
  if (m.phase !== 'rally') return;
  updateAI(m, dt);
  if (m.item && !m.item.collected && m.players.some(p => p.team === 0 && distance(p, m.item) < 0.65)) {
    const type = m.item.type;
    collectItem(m); m.message = `¡Recogiste ${POWER_NAMES[type]}!`; m.flash = 0.5;
  }
}

export function switchPlayer(m) {
  if (!['serve', 'rally'].includes(m.phase) || (m.phase === 'serve' && m.server === 1)) return;
  m.players[m.active].attempt = 0;
  m.active = 1 - m.active;
}
export function powerAction(m, select = false) {
  if (!['serve', 'rally'].includes(m.phase)) return;
  if (select) selectPower(m.powers);
  else m.message = activatePower(m.powers) ? `${POWER_NAMES[m.powers.selected]} preparado para la próxima acción compatible` : 'Sin usos · recoge un objeto en la cancha';
}
export function pause(m) {
  if (!['serve', 'rally', 'point'].includes(m.phase)) return;
  m.resumePhase = m.phase; m.phase = 'paused';
  m.players.forEach(p => { p.attempt = 0; });
}
export function resume(m) { if (m.phase === 'paused') m.phase = m.resumePhase; }
