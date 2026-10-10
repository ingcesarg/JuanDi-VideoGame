const controls = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab','KeyQ','KeyE','Escape']);
export function createInput(canvas, isPlaying, action) {
  const keys = new Set();
  const clear = () => keys.clear();
  window.addEventListener('keydown', event => {
    if (!isPlaying() || document.activeElement !== canvas || !controls.has(event.code)) return;
    event.preventDefault();
    keys.add(event.code);
    if (!event.repeat) action(event.code);
  });
  window.addEventListener('keyup', event => keys.delete(event.code));
  window.addEventListener('blur', clear);
  canvas.addEventListener('blur', clear);
  return { clear, direction: () => ({ x: Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft')), y: Number(keys.has('ArrowDown')) - Number(keys.has('ArrowUp')) }) };
}
