import { CONFIG } from './config.js';

export function setWinner(score) {
  if (Math.max(...score) < CONFIG.targetScore || Math.abs(score[0] - score[1]) < 2) return null;
  return score[0] > score[1] ? 0 : 1;
}
export function landingWinner(ball) {
  const inside = ball.x >= 0 && ball.x <= CONFIG.width && ball.y >= 0 && ball.y <= CONFIG.length;
  return inside ? (ball.y > CONFIG.netY ? 1 : 0) : 1 - (ball.lastTeam ?? 0);
}
export function awardPoint(match, team, reason) {
  if (match.phase !== 'rally') return false;
  match.score[team]++;
  match.server = team;
  match.stats.streak = team === 0 ? match.stats.streak + 1 : 0;
  match.stats.bestStreak = Math.max(match.stats.bestStreak, match.stats.streak);
  if (team === 0 && match.lastAttack?.team === 0 && match.lastAttack.free) {
    match.powers.stock.spike++;
    match.stats.placementPoints++;
  }
  match.item = null;
  match.winner = setWinner(match.score);
  match.phase = match.winner === null ? 'point' : 'results';
  match.timer = CONFIG.pointDelay;
  match.message = `${team === 0 ? '¡Punto GOCA!' : 'Punto de Los del Parque'} · ${reason}`;
  return true;
}
export function registerContact(match, team, block = false) {
  if (match.ball.lastTeam !== team) match.contacts = 0;
  if (!block) match.contacts++;
  match.ball.lastTeam = team;
  if (match.contacts > 3) {
    awardPoint(match, 1 - team, 'Cuatro contactos');
    return false;
  }
  return true;
}
