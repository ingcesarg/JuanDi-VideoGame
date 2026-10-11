const voices = {
  serve: [350, 180, .12], receive: [190, 110, .1], set: [280, 450, .12], block: [120, 70, .13], spike: [150, 65, .14],
  jump: [260, 370, .1], superJump: [340, 720, .2], powerSpike: [220, 70, .23], pickup: [660, 990, .16], prepare: [440, 660, .12],
  point: [520, 780, .22], result: [660, 1320, .35],
};
// Powers have their own timbre and layered rhythm, beyond a pitch change.
const powerVoices = {
  superJump: [
    { from: 320, to: 960, duration: .24, delay: 0, type: 'square' },
    { from: 640, to: 1440, duration: .18, delay: .08, type: 'sine' },
  ],
  powerSpike: [
    { from: 240, to: 55, duration: .19, delay: 0, type: 'square' },
    { duration: .13, delay: .005, type: 'noise' },
    { from: 95, to: 38, duration: .24, delay: .018, type: 'sine' },
  ],
};
export function createAudio(makeContext) {
  let context = null, enabled = false, available = true, epoch = 0, volume = .3;
  const sources = new Set();
  function stop() {
    enabled = false; epoch++;
    for (const source of sources) { try { source.stop(); } catch {} }
    sources.clear();
    if (context) { try { Promise.resolve(context.suspend()).catch(() => { available = false; }); } catch { available = false; } }
  }
  return {
    async enable(nextVolume) {
      const token = ++epoch;
      try {
        context ??= makeContext();
        await context.resume();
        if (token !== epoch) { if (!enabled) await context.suspend(); return false; }
        volume = nextVolume; enabled = true; available = true;
        return true;
      } catch { available = false; enabled = false; return false; }
    },
    stop,
    setVolume(value) { volume = Math.max(0, Math.min(1, value)); },
    status: () => ({ enabled, available }),
    play(kind) {
      if (!enabled || !context || !voices[kind] || volume === 0) return false;
      try {
        const [from, to, duration] = voices[kind], now = context.currentTime;
        const layers = powerVoices[kind] ?? [{ from, to, duration, delay: 0, type: ['receive','block','spike'].includes(kind) ? 'triangle' : 'sine' }];
        for (const layer of layers) {
          const start = now + layer.delay;
          const gain = context.createGain();
          let source;
          if (layer.type === 'noise') {
            const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * layer.duration), context.sampleRate);
            const samples = buffer.getChannelData(0);
            let previous = 0;
            for (let i = 0; i < samples.length; i++) {
              // Rounded noise burst gives the impact a rough attack without a piercing hiss.
              previous = .55 * previous + .45 * (Math.random() * 2 - 1);
              samples[i] = previous;
            }
            source = context.createBufferSource(); source.buffer = buffer;
          } else {
            source = context.createOscillator(); source.type = layer.type;
            source.frequency.setValueAtTime(layer.from, start);
            source.frequency.exponentialRampToValueAtTime(layer.to, start + layer.duration);
          }
          gain.gain.setValueAtTime(.0001, start);
          gain.gain.exponentialRampToValueAtTime(Math.max(.0001, volume * .12 / layers.length), start + (layer.type === 'noise' ? .003 : .008));
          gain.gain.exponentialRampToValueAtTime(.0001, start + layer.duration);
          source.connect(gain); gain.connect(context.destination); sources.add(source);
          source.onended = () => { sources.delete(source); source.disconnect(); gain.disconnect(); };
          source.start(start); source.stop(start + layer.duration + .02);
        }
        return true;
      } catch { stop(); available = false; return false; }
    },
  };
}
