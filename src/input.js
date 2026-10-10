const controls = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab','KeyQ','KeyE','Escape']);
export function createInput(canvas, isPlaying, action, environment = { window, document }) {
  const { window: target, document: doc } = environment;
  const keys = new Set();
  const clear = () => keys.clear();
  const keydown = event => {
    if (!isPlaying() || doc.activeElement !== canvas || event.target !== canvas || !controls.has(event.code)) return;
    event.preventDefault();
    const held = keys.has(event.code);
    keys.add(event.code);
    if (!event.repeat && !held) action(event.code);
  };
  const keyup = event => keys.delete(event.code);
  target.addEventListener('keydown', keydown);
  target.addEventListener('keyup', keyup);
  target.addEventListener('blur', clear);
  canvas.addEventListener('blur', clear);
  return {
    clear,
    direction: () => ({ x: Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft')), y: Number(keys.has('ArrowDown')) - Number(keys.has('ArrowUp')) }),
    dispose() {
      target.removeEventListener('keydown', keydown); target.removeEventListener('keyup', keyup);
      target.removeEventListener('blur', clear); canvas.removeEventListener('blur', clear);
    },
  };
}
