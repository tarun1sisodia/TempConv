// Namespaced, versioned keys + a defensive localStorage wrapper (dependency-injectable for tests).

export const KEYS = {
  history: 'tempconv.v1.history',
  theme: 'tempconv.v1.theme',
  rankine: 'tempconv.v1.rankine'
};

/**
 * @param {Storage|null} storage real localStorage, or any {getItem,setItem,removeItem} fake in tests
 */
export function createStore(storage) {
  let ok = !!storage;
  return {
    get ok() { return ok; },
    /** Parse JSON at key; corrupted payloads are wiped silently; storage failure disables the store. */
    read(key) {
      if (!ok) return null;
      try {
        const raw = storage.getItem(key);
        if (raw === null || raw === undefined) return null;
        return JSON.parse(raw);
      } catch (e) {
        if (e instanceof SyntaxError) {
          try { storage.removeItem(key); } catch { /* ignore */ }
          return null;
        }
        ok = false; // access itself threw (private mode): degrade, never crash the app
        return null;
      }
    },
    write(key, value) {
      if (!ok) return false;
      try {
        storage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        ok = false;
        return false;
      }
    },
    remove(key) {
      if (!ok) return;
      try { storage.removeItem(key); } catch { /* ignore */ }
    }
  };
}
