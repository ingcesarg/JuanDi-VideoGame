export const PREFERENCES_KEY = 'juandivoley.presentation.v1';
export function createPreferences(storage, systemReduced = false) {
  const defaults = { version: 1, muted: true, volume: 0.3, reducedMotion: Boolean(systemReduced) };
  let data = { ...defaults }, persistent = true;
  try {
    const raw = storage.getItem(PREFERENCES_KEY);
    if (raw !== null) {
      const p = JSON.parse(raw);
      if (p.version !== 1 || typeof p.muted !== 'boolean' || typeof p.reducedMotion !== 'boolean' || !Number.isFinite(p.volume) || p.volume < 0 || p.volume > 1) throw Error('Invalid preferences');
      data = { version: 1, muted: p.muted, volume: p.volume, reducedMotion: p.reducedMotion };
    }
  } catch { persistent = false; }
  return {
    snapshot: () => ({ ...data, persistent }),
    set(patch) {
      const next = { ...data, ...patch, version: 1 };
      if (typeof next.muted !== 'boolean' || typeof next.reducedMotion !== 'boolean' || !Number.isFinite(next.volume) || next.volume < 0 || next.volume > 1) return false;
      data = { version: 1, muted: next.muted, volume: next.volume, reducedMotion: next.reducedMotion };
      if (persistent) { try { storage.setItem(PREFERENCES_KEY, JSON.stringify(data)); } catch { persistent = false; } }
      return true;
    },
  };
}
