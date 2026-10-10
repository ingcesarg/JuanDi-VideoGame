import { CONFIG } from './config.js';

// Física con pasos fijos; reloj de apuntado con tiempo real activo, incluso si un frame tarda.
export function createClock() {
  let last = null, accumulator = 0, pendingReal = 0;
  return {
    reset() { last = null; accumulator = 0; pendingReal = 0; },
    advance(time, step) {
      const elapsed = last === null ? 0 : Math.max(0, (time - last) / 1000);
      last = time;
      accumulator += Math.min(elapsed, CONFIG.maxFrame);
      pendingReal += elapsed;
      while (accumulator + 1e-10 >= CONFIG.step) {
        step(CONFIG.step, pendingReal);
        pendingReal = 0;
        accumulator -= CONFIG.step;
      }
    },
  };
}
