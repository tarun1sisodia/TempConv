// History: capped, deduped, string-first entries rendered with DOM APIs only (never innerHTML).

import { UNITS, UNIT_LABELS, format, fromCelsius, toCelsius } from '../converter.js';
import { KEYS } from './store.js';

export const MAX_ENTRIES = 20;

/** Display time for a timestamp. @returns {string} */
export function timeLabel(ts, now = Date.now()) {
  const clock = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' });
  if (!Number.isFinite(ts)) return '';
  if (ts >= now) return clock.format(ts);
  const n = new Date(now);
  const midnightNow = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
  if (ts >= midnightNow) return clock.format(ts);
  if (ts >= midnightNow - 86400000) return 'yesterday';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(ts);
}

/** @param {object[]} entries @returns {object[]} last MAX_ENTRIES, in order */
export function capEntries(entries) { return entries.slice(-MAX_ENTRIES); }

/** Consecutive-identical dedupe by Celsius string, then cap. */
export function pushEntry(entries, entry) {
  if (entries.length && entries[entries.length - 1].units.c === entry.units.c) return entries;
  return capEntries([...entries, entry]);
}

/** Snapshot the active value as a display-string entry (schema v1, PLAN 15.03). */
export function snapshotEntry(state) {
  const parsed = state.parsed[state.active];
  if (parsed === null || parsed === undefined || state.errors[state.active]) return null;
  const units = {};
  for (const u of UNITS) units[u] = format(fromCelsius(u, toCelsius(state.active, parsed)), state.precision);
  const id = (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { id, units, p: state.precision, ts: Date.now(), c: units.c };
}

export function createHistory({ store, state, listEl, emptyEl, countEl, clearBtn, headerEl, onRestore, notify }) {
  let entries = (store.read(KEYS.history) || []).filter((e) => e && e.units && typeof e.units.c === 'string');
  let confirmTimer = null;
  let warnedQuota = false;
  let lastPushC = null; // dedupe vs *committed* value, not list tail (focus-steal blur must not re-push; PLAN 15.04)

  function persist() {
    if (!store.write(KEYS.history, entries) && !warnedQuota) {
      warnedQuota = true;
      notify('Couldn\u2019t save this to history.', 'error');
    }
  }

  function makeIcon(id) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  function render() {
    if (!store.ok) {
      listEl.classList.add('u-hidden');
      emptyEl.classList.add('u-hidden');
      clearBtn.hidden = true;
      if (!headerEl.querySelector('.history-note')) {
        const note = document.createElement('p');
        note.className = 'history-count u-t-label';
        note.classList.add('history-note');
        note.textContent = 'History isn\u2019t available in this browser session.';
        headerEl.appendChild(note);
      }
      return;
    }
    countEl.textContent = `${entries.length} saved`;
    emptyEl.classList.toggle('u-hidden', entries.length > 0);
    listEl.classList.toggle('u-hidden', entries.length === 0);
    const scrollTop = listEl.scrollTop;
    const frag = document.createDocumentFragment();
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      const li = document.createElement('li');
      li.className = 'history-item';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'history-item__btn';
      btn.dataset.index = String(i);
      btn.textContent = `${e.units.c}\u00A0${UNIT_LABELS.c} → ${e.units.f}\u00A0${UNIT_LABELS.f}`;
      btn.setAttribute('aria-label', `Restore ${e.units.c} ${UNIT_LABELS.c} to the converter`);

      const time = document.createElement('span');
      time.className = 'history-item__time';
      time.textContent = timeLabel(e.ts);

      const acts = document.createElement('span');
      acts.className = 'history-item__actions';
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn btn--icon';
      del.dataset.remove = String(i);
      del.setAttribute('aria-label', `Delete ${e.units.c} ${UNIT_LABELS.c} from history`);
      del.appendChild(makeIcon('icon-trash'));
      acts.appendChild(del);

      li.append(btn, time, acts);
      frag.appendChild(li);
    }
    listEl.textContent = '';
    listEl.appendChild(frag);
    listEl.scrollTop = scrollTop;
  }

  function restoreFocusTo(index) {
    const next = listEl.querySelector(`.history-item__btn[data-index="${index - 1}"]`)
      || listEl.querySelector(`.history-item__btn[data-index="${index + 1}"]`);
    if (next) next.focus();
    else clearBtn.focus();
  }

  listEl.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('[data-remove]');
    if (removeBtn) {
      const i = Number(removeBtn.dataset.remove);
      entries = entries.filter((_, idx) => idx !== i);
      persist();
      render();
      restoreFocusTo(i);
      return;
    }
    const restoreBtn = event.target.closest('.history-item__btn');
    if (restoreBtn) {
      const entry = entries[Number(restoreBtn.dataset.index)];
      if (entry) onRestore(entry);
    }
  });

  function exitConfirm() {
    clearTimeout(confirmTimer);
    clearBtn.dataset.confirm = '';
    clearBtn.textContent = 'Clear';
    clearBtn.setAttribute('aria-label', 'Clear all history entries');
  }
  clearBtn.addEventListener('click', () => {
    if (clearBtn.dataset.confirm === '1') {
      entries = [];
      lastPushC = null;
      persist();
      render();
      exitConfirm();
      notify('History cleared', 'ok');
      clearBtn.focus();
      return;
    }
    clearBtn.dataset.confirm = '1';
    clearBtn.textContent = 'Confirm?';
    clearBtn.setAttribute('aria-label', 'Clear all history entries — press again to confirm');
    confirmTimer = setTimeout(exitConfirm, 3000);
  });

  window.addEventListener('storage', (e) => {
    if (e.key === KEYS.history) { entries = store.read(KEYS.history) || []; render(); }
  });

  return {
    render,
    /** Commit one entry if the state holds a valid value (called from main on blur/preset). */
    push() {
      const entry = snapshotEntry(state.get());
      if (!entry) return;
      if (entry.units.c === lastPushC) return; // unchanged since last commit — ignore spurious re-commits
      lastPushC = entry.units.c;
      const before = entries;
      entries = pushEntry(before, entry);
      if (entries !== before) {
        persist();
        render();
      }
    },
    reload() { entries = store.read(KEYS.history) || []; render(); }
  };
}
