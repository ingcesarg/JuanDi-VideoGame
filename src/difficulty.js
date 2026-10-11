import { CONFIG } from './config.js';

export const DIFFICULTIES = Object.freeze({
  beginner: Object.freeze({ id: 'beginner', name: 'Principiante', rivalSpeed: CONFIG.rivalSpeed, rivalMissChance: CONFIG.rivalMissChance, hintScale: 1, description: 'Rivales más tranquilos y espacios libres destacados.' }),
  normal: Object.freeze({ id: 'normal', name: 'Normal', rivalSpeed: 3.8, rivalMissChance: 0.08, hintScale: 0.6, description: 'Rivales más rápidos, menos errores y pistas de espacios más pequeñas.' }),
});
export function difficultyProfile(id) {
  return Object.hasOwn(DIFFICULTIES, id) ? DIFFICULTIES[id] : DIFFICULTIES.beginner;
}
