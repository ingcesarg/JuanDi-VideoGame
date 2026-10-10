import { CONFIG } from './config.js';

export function launch(ball, target, duration, targetHeight = 0) {
  ball.vx = (target.x - ball.x) / duration;
  ball.vy = (target.y - ball.y) / duration;
  ball.vz = (targetHeight - ball.z + 0.5 * CONFIG.gravity * duration ** 2) / duration;
}
export function predict(ball, height = 0) {
  const discriminant = ball.vz ** 2 + 2 * CONFIG.gravity * (ball.z - height);
  if (discriminant < 0) return { x: ball.x, y: ball.y, time: 0 };
  const time = Math.max(0, (ball.vz + Math.sqrt(discriminant)) / CONFIG.gravity);
  return { x: ball.x + ball.vx * time, y: ball.y + ball.vy * time, time };
}
export function advanceBall(ball, dt) {
  const previousY = ball.y;
  const previousZ = ball.z;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.z += ball.vz * dt - 0.5 * CONFIG.gravity * dt ** 2;
  ball.vz -= CONFIG.gravity * dt;
  if ((previousY < CONFIG.netY && ball.y >= CONFIG.netY) || (previousY > CONFIG.netY && ball.y <= CONFIG.netY)) {
    const crossing = (CONFIG.netY - previousY) / (ball.y - previousY);
    const height = previousZ + (ball.z - previousZ) * crossing;
    if (ball.x >= 0 && ball.x <= CONFIG.width && height < CONFIG.netHeight) {
      ball.y = CONFIG.netY + (previousY < CONFIG.netY ? -0.04 : 0.04);
      ball.vy *= -0.18;
      ball.vx *= 0.5;
      ball.vz = Math.min(ball.vz, 0);
      return true;
    }
  }
  return false;
}
