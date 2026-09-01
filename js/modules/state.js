// Minimal observable store + UI-independent state helpers (testable in node).

export const DEFAULT_STATE = {
  values: { c: '', f: '', k: '', r: '' },   // raw input strings (display truth)
  parsed: { c: null, f: null, k: null, r: null }, // last valid parsed number (math truth)
  errors: { c: null, f: null, k: null, r: null }, // error code or null
  active: 'c',
  edited: { c: false, f: false, k: false, r: false }, // true while the user holds uncommitted typing in a field
  precision: 2,
  showRankine: false
};

/** Shallow-merge store; notifications coalesce on the microtask queue. */
export function createState(initial) {
  let state = { ...initial };
  const subs = new Set();
  let queued = false;
  const flush = () => { queued = false; for (const fn of subs) fn(state); };
  return {
    get() { return state; },
    set(patch) {
      state = { ...state, ...patch };
      if (!queued) { queued = true; queueMicrotask(flush); }
    },
    setSync(patch) {
      state = { ...state, ...patch };
      for (const fn of subs) fn(state);
    },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
  };
}

/** Roving-arrow navigation for the precision radiogroup. @returns {number} next index */
export function segNavigate(index, key, count) {
  if (index < 0) return index;
  switch (key) {
    case 'ArrowRight': case 'ArrowDown': return (index + 1) % count;
    case 'ArrowLeft': case 'ArrowUp': return (index - 1 + count) % count;
    case 'Home': return 0;
    case 'End': return count - 1;
    default: return index;
  }
}

/** Build a keydown handler mapping Alt+<key> to actions; ignores ctrl/meta/composing. */
export function createKeymap(actions) {
  return function onKeydown(event) {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    const fn = actions[event.key.toLowerCase()];
    if (!fn) return;
    event.preventDefault();
    fn(event);
  };
}
