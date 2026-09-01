// DOM renderer — the only module that writes to converter fields, plus toast + done-flash helpers.
// State is the truth; this file projects it (see docs/ARCHITECTURE.md).

import { UNITS, UNIT_LABELS, format, fromCelsius, toCelsius, nextUnit, visibleUnits, ABS_ZERO_C } from '../converter.js';

const NBSP = '\u00A0';

export const ERROR_TEXT = {
  'not-a-number': 'Enter a number, like 20.',
  'too-large': 'That number is too large.'
};

/** @returns {string} copy for an error code, unit-localized for the absolute-zero floor. */
export function errorText(code, unit) {
  if (code === 'below-absolute-zero') {
    const floor = format(fromCelsius(unit, ABS_ZERO_C), 2);
    return `Below absolute zero — ${floor}${NBSP}${UNIT_LABELS[unit]} is the floor.`;
  }
  return ERROR_TEXT[code] || 'Something is off with that input.';
}

const els = { rows: {}, inputs: {}, errors: {} };

export function initUI() {
  for (const u of UNITS) {
    const row = document.querySelector(`[data-unit-row="${u}"]`);
    els.rows[u] = row;
    els.inputs[u] = row.querySelector('.field__input');
    els.errors[u] = row.querySelector('.field__error');
  }
  els.copyBtn = document.getElementById('btn-copy');
  els.thR = document.getElementById('th-r');
  els.rankineChip = document.getElementById('rankine-chip');
  els.seg = document.querySelector('.seg');
}

/** Project state onto the converter card. Returns nothing; DOM only. */
export function render(state) {
  const active = state.active;
  const activeErr = state.errors[active];
  const activeParsed = state.parsed[active];
  const hasActive = activeParsed !== null && activeParsed !== undefined && !activeErr;
  // Programmatic updates (presets, rotate, restore, reset) must paint even into a focused field;
  // only genuine in-progress typing (edited flag) is left untouched (caret guard, PLAN 11.04).
  const typing = (u) => document.activeElement === els.inputs[u] && !!state.edited[u];
  // parsed[] is in each field's own unit space; the canon for cross-unit math is Celsius.
  const celsius = hasActive ? toCelsius(active, activeParsed) : null;

  for (const u of UNITS) {
    const row = els.rows[u];
    if (u === 'r') row.hidden = !state.showRankine;
    const err = state.errors[u];
    row.classList.toggle('is-error', !!err);
    row.classList.toggle('is-active', u === active);
    els.errors[u].textContent = err ? errorText(err, u) : '';
    els.inputs[u].setAttribute('aria-invalid', err ? 'true' : 'false');
  }

  // Siblings echo the computed values; the field under the caret is never written.
  // Empty active -> clear siblings. Errored active -> leave the last computed values and mark stale (PLAN 12.04).
  const activeRaw = state.values[active];
  const sourceEmpty = activeRaw === '' || activeRaw === null || activeRaw === undefined;
  for (const u of UNITS) {
    if (u === active) continue;
    const input = els.inputs[u];
    let out = null;
    if (hasActive) out = format(fromCelsius(u, celsius), state.precision);
    else if (sourceEmpty) out = '';
    if (out !== null && !typing(u) && input.value !== out) input.value = out;
    els.rows[u].classList.toggle('is-stale', !!activeErr);
  }
  const activeInput = els.inputs[active];
  if (!typing(active) && activeInput.value !== state.values[active]) {
    activeInput.value = state.values[active];
  }

  els.thR.hidden = !state.showRankine;
  els.rankineChip.setAttribute('aria-pressed', String(state.showRankine));
  syncSeg(state.precision);

  els.copyBtn.disabled = !hasActive;
  els.copyBtn.setAttribute('aria-disabled', String(!hasActive));
}

export function syncSeg(precision) {
  for (const opt of els.seg.querySelectorAll('[role="radio"]')) {
    const on = Number(opt.dataset.value) === precision;
    opt.setAttribute('aria-checked', String(on));
    opt.tabIndex = on ? 0 : -1;
  }
}

/** Clipboard lines for every visible unit, derived from the active parsed value. */
export function buildCopyPairs(state) {
  const parsed = state.parsed[state.active];
  const ok = parsed !== null && parsed !== undefined && !state.errors[state.active];
  const celsius = ok ? toCelsius(state.active, parsed) : null;
  return visibleUnits(state.showRankine).map((u) => ({
    unit: u,
    text: ok ? format(fromCelsius(u, celsius), state.precision) : null
  }));
}

// --- title + URL sync (rAF-throttled, replaceState-only) ---
let syncQueued = false;
export function syncDoc(state) {
  if (syncQueued) return;
  syncQueued = true;
  requestAnimationFrame(() => {
    syncQueued = false;
    const parsed = state.parsed[state.active];
    const has = parsed !== null && parsed !== undefined && !state.errors[state.active];
    let title = 'TempConv — Minimal Temperature Converter';
    if (has) {
      const from = state.active;
      const to = nextUnit(from, visibleUnits(state.showRankine));
      const shown = format(parsed, state.precision);
      const target = format(fromCelsius(to, toCelsius(from, parsed)), state.precision);
      let line = `${shown}${NBSP}${UNIT_LABELS[from]} → ${target}${NBSP}${UNIT_LABELS[to]}`;
      if (line.length > 60) line = line.slice(0, 57) + '…';
      title = `${line} · TempConv`;
    }
    if (document.title !== title) document.title = title;
    try {
      const q = new URLSearchParams();
      if (has) q.set('c', String(toCelsius(state.active, parsed)));
      if (state.precision !== 2) q.set('p', String(state.precision));
      const qs = q.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
    } catch { /* sandboxed contexts: URL sync is best-effort */ }
  });
}

// --- toasts ---
let toastTimer = null;
export function notify(message, type = 'info') {
  const host = document.getElementById('toasts');
  host.textContent = '';
  const t = document.createElement('div');
  t.className = 'toast' + (type === 'error' ? ' is-error' : type === 'ok' ? ' is-ok' : '');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', type === 'error' ? '#icon-info' : '#icon-check');
  svg.appendChild(use);
  const span = document.createElement('span');
  span.textContent = message;
  t.append(svg, span);
  host.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 2400);
}

/** Copy-confirmation icon swap with single-timer hygiene (PLAN 13.13). */
export function flashDone(btn) {
  clearTimeout(btn._doneTimer);
  btn.classList.add('is-done');
  btn._doneTimer = setTimeout(() => btn.classList.remove('is-done'), 1200);
}
