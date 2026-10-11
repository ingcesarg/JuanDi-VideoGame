import { CONFIG } from './config.js';

export const PROGRESS_KEY = 'juandivoley.progress.v1';
const empty = () => ({ version: 1, credits: 0, reserve: { jump: 0, spike: 0 }, lastReward: null });
const amount = value => Number.isSafeInteger(value) && value >= 0;
function valid(p) {
  return p && p.version === 1 && amount(p.credits) && amount(p.reserve?.jump) && amount(p.reserve?.spike) && (p.lastReward === null || typeof p.lastReward === 'string');
}
export function createProgress(storage) {
  let data = empty(), persistent = true, warning = '';
  const temporary = () => { persistent = false; warning = 'Progreso temporal: no se guardará al cerrar o recargar. Puedes seguir jugando.'; };
  try {
    const raw = storage.getItem(PROGRESS_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (!valid(parsed)) throw new Error('Invalid profile');
      data = { version: 1, credits: parsed.credits, reserve: { ...parsed.reserve }, lastReward: parsed.lastReward };
    }
  } catch { temporary(); }
  function save(next) {
    data = next;
    if (persistent) {
      try { storage.setItem(PROGRESS_KEY, JSON.stringify(data)); }
      catch { temporary(); }
    }
  }
  return {
    snapshot: () => ({ ...data, reserve: { ...data.reserve }, persistent, warning }),
    reward(id, winner) {
      if (winner !== 0 || typeof id !== 'string' || !id || data.lastReward === id) return 0;
      const credits = data.credits + CONFIG.victoryCredits;
      if (!amount(credits)) return 0;
      save({ ...data, credits, lastReward: id });
      return CONFIG.victoryCredits;
    },
    buy(type, phase) {
      if (!['home', 'results'].includes(phase) || !['jump', 'spike'].includes(type)) return false;
      const price = CONFIG.powerPrices[type];
      if (data.credits < price || !amount(data.reserve[type] + 1)) return false;
      save({ ...data, credits: data.credits - price, reserve: { ...data.reserve, [type]: data.reserve[type] + 1 } });
      return true;
    },
    takeReserve() {
      const reserve = { ...data.reserve };
      save({ ...data, reserve: { jump: 0, spike: 0 } });
      return reserve;
    },
  };
}
