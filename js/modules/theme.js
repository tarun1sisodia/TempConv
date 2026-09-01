// Theme controller — deliberately NOT part of app state (PLAN 11.18 rationale).
// Three modes: system (no attribute) | light | dark, persisted via KEYS.theme.

import { KEYS } from './store.js';

export function createThemeController({ storage, button, metaColorLight = '#F8F9FA', metaColorDark = '#131314' }) {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try {
      const v = storage ? JSON.parse(storage.getItem(KEYS.theme)) : null;
      return v === 'dark' || v === 'light' ? v : null;
    } catch { return null; }
  }
  function persist(mode) {
    try {
      if (mode) storage.setItem(KEYS.theme, JSON.stringify(mode));
      else storage.removeItem(KEYS.theme);
    } catch { /* storage unavailable: theme still works for the session */ }
  }
  function isDark() {
    const s = stored();
    return s === 'dark' || (s === null && media.matches);
  }
  function syncUI() {
    const dark = isDark();
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Light theme' : 'Dark theme');
      button.title = (dark ? 'Switch to light theme' : 'Switch to dark theme') + ' (Alt+T)';
    }
    // theme-color meta can't read CSS vars — documented literal (CONVENTIONS exception, like the manifest).
    let m = document.querySelector('meta[name="theme-color"].js-theme');
    if (!m) {
      m = document.createElement('meta');
      m.setAttribute('name', 'theme-color');
      m.classList.add('js-theme');
      document.head.appendChild(m);
    }
    m.setAttribute('content', dark ? metaColorDark : metaColorLight);
  }
  function toggle() {
    const next = isDark() ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.dataset.theme = next;
    persist(next);
    syncUI();
    const done = () => root.classList.remove('theme-anim');
    root.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 400); // cleanup guard when transitions are disabled
  }

  media.addEventListener('change', () => { if (!stored()) syncUI(); });
  syncUI();
  return { toggle, syncUI, isDark };
}
