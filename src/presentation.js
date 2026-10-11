export function emitPresentation(m, kind, source = {}) {
  m.presentationId = (m.presentationId ?? 0) + 1;
  const event = { id: m.presentationId, kind, time: m.elapsed, x: source.x ?? m.ball.x, y: source.y ?? m.ball.y, z: source.z ?? 0 };
  (m.presentationEvents ??= []).push(event);
  if (m.presentationEvents.length > 32) m.presentationEvents.shift();
  return event;
}
export function clearPresentation(m) { m.presentationEvents = []; }
export function createEventCursor() {
  let match = null, last = 0;
  return {
    read(m) {
      if (m !== match) { match = m; last = 0; }
      const events = (m.presentationEvents ?? []).filter(e => e.id > last);
      last = m.presentationId ?? 0;
      return events;
    },
    discard(m) { match = m; last = m.presentationId ?? 0; },
  };
}
