import { CONFIG } from './config.js';

export function createPowers() {
  return { stock: { jump: CONFIG.initialPowers, spike: CONFIG.initialPowers }, pending: { jump: 0, spike: 0 }, selected: 'jump' };
}
export function selectPower(powers) {
  powers.selected = powers.selected === 'jump' ? 'spike' : 'jump';
}
export function activatePower(powers) {
  const type = powers.selected;
  if (powers.stock[type] <= 0) return false;
  powers.stock[type]--;
  powers.pending[type]++;
  return true;
}
export function consumePower(powers, type) {
  if (powers.pending[type] <= 0) return false;
  powers.pending[type]--;
  return true;
}
export function collectItem(match) {
  if (!match.item || match.item.collected) return false;
  match.item.collected = true;
  match.powers.stock[match.item.type]++;
  return true;
}
