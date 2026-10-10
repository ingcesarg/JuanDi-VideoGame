// Valores provisionales para ajustar con Juan Diego durante la prueba familiar.
export const CONFIG = {
  width: 10, length: 18, netY: 9, netHeight: 2.4,
  gravity: 9.8, step: 1 / 60, maxFrame: 0.1,
  playerSpeed: 5.2, aiSpeed: 3.8, rivalSpeed: 3.0, rivalMissChance: 0.16, contactRadius: 1.5,
  contactHeight: 2.15, contactLock: 0.38, actionWindow: 0.32,
  jumpSpeed: 6.3, superJumpSpeed: 9, powerSpeed: 1.5,
  serveTime: 2.3, receiveTime: 1.45, setTime: 1.55, spikeTime: 1.25,
  pointDelay: 1.8, rivalServeDelay: 1.5, freeRadius: 2.25,
  initialPowers: 2, targetScore: 15,
};
export const POWER_NAMES = { jump: 'Súper salto', spike: 'Remate potente' };
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
