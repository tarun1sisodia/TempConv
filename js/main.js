// Entry point: boots state, wires events, delegates [data-action] clicks, registers shortcuts.
// Boot order matters (PLAN 11.22): theme (pre-paint via inline script) -> URL seed -> render -> table -> history.

import { UNITS, parseInput, isHardError, nextUnit, visibleUnits, PRECISIONS, buildCopyText } from './converter.js';
import { createState, DEFAULT_STATE, segNavigate, createKeymap } from './modules/state.js';
import { initUI, render, syncDoc, notify, flashDone, buildCopyPairs } from './modules/ui.js';
import { createTableView } from './modules/table.js';
import { createHistory } from './modules/history.js';
import { createStore, KEYS } from './modules/store.js';
import { createThemeController } from './modules/theme.js';
import { copyText } from './modules/clipboard.js';

initUI();

const store = createStore(typeof localStorage !== 'undefined' ? localStorage : null);

const seed = {
  ...DEFAULT_STATE,
  values: { ...DEFAULT_STATE.values },
  parsed: { ...DEFAULT_STATE.parsed },
  errors: { ...DEFAULT_STATE.errors }
};

// URL params (PLAN 11.20): ?c=<celsius>&p=<precision>; malformed values are ignored, never crash.
const params = new URLSearchParams(location.search);
const pParam = params.get('p');
if (pParam !== null && /^\d$/.test(pParam) && PRECISIONS.includes(Number(pParam))) seed.precision = Number(pParam);
const cParam = params.get('c');
if (cParam !== null) {
  const res = parseInput(cParam, 'c');
  if (res.ok && res.value !== null) {
    seed.values.c = cParam;
    seed.parsed.c = res.value;
  }
}
try { if (sessionStorage.getItem(KEYS.rankine) === 'true') seed.showRankine = true; } catch { /* best effort */ }

const state = createState(seed);

const tableView = createTableView({
  tbody: document.getElementById('reference-body'),
  wrapper: document.querySelector('.table-scroll'),
  captionEl: document.getElementById('table-caption')
});

const inputs = {};
for (const u of UNITS) inputs[u] = document.getElementById(`input-${u}`);

let composing = false;
let historyApi;

function setField(unit, raw, validateSoft, userEdited = false) {
  const s = state.get();
  const res = parseInput(raw, unit);
  const values = { ...s.values, [unit]: raw };
  const parsed = { ...s.parsed };
  const errors = { ...s.errors };
  const edited = { ...s.edited, [unit]: userEdited };
  if (res.ok) {
    parsed[unit] = res.value;
    errors[unit] = null;
  } else if (validateSoft || isHardError(res.code)) {
    parsed[unit] = null;
    errors[unit] = res.code;
  }
  state.set({ values, parsed, errors, edited });
  syncDoc(state.get());
}

function commit(unit) {
  // parse state, never the DOM string (state is the truth; DOM may lag focus quirks)
  setField(unit, String(state.get().values[unit] ?? '').trim(), true, false);
  if (historyApi) historyApi.push();
}

function clearAll() {
  state.set({
    values: { c: '', f: '', k: '', r: '' },
    parsed: { c: null, f: null, k: null, r: null },
    errors: { c: null, f: null, k: null, r: null },
    edited: { c: false, f: false, k: false, r: false }
  });
  syncDoc(state.get());
}

function focusUnit(unit) {
  if (!visibleUnits(state.get().showRankine).includes(unit)) return;
  state.set({ active: unit });
  inputs[unit].focus();
}

function rotate() {
  const s = state.get();
  const to = nextUnit(s.active, visibleUnits(s.showRankine));
  const v = s.parsed[s.active];
  const raw = (v === null || v === undefined) ? '' : String(v);
  state.set({
    values: { c: '', f: '', k: '', r: '', [to]: raw },
    parsed: { c: null, f: null, k: null, r: null, [to]: raw === '' ? null : v },
    errors: { c: null, f: null, k: null, r: null },
    edited: { c: false, f: false, k: false, r: false },
    active: to
  });
  syncDoc(state.get());
  focusUnit(to);
}

function toggleRankine() {
  const on = !state.get().showRankine;
  const patch = { showRankine: on };
  if (!on && state.get().active === 'r') patch.active = 'c';
  state.set(patch);
  try { sessionStorage.setItem(KEYS.rankine, String(on)); } catch { /* best effort */ }
  if (on && document.activeElement === inputs.c) inputs.r.focus();
}

function setPrecision(p, focusEl) {
  state.set({ precision: p });
  syncDoc(state.get());
  if (focusEl) focusEl.focus();
  if (historyApi) historyApi.render(); // entries are display-string frozen; caption/time refresh keeps lists honest
}

async function performCopy(pairs, trigger, fallbackField) {
  const text = buildCopyText(pairs);
  if (!text || !text.trim()) {
    notify('Nothing valid to copy yet.', 'error');
    return;
  }
  const mode = await copyText(text, fallbackField);
  flashDone(trigger);
  if (mode === 'manual') notify('Couldn\u2019t copy — the number is selected, press Ctrl+C.', 'error');
  else notify('Copied', 'ok');
}

function restoreEntry(entry) {
  const res = parseInput(entry.units.c, 'c');
  if (!res.ok || res.value === null) {
    notify('This history entry can\u2019t be restored.', 'error');
    return;
  }
  state.set({
    values: { c: entry.units.c, f: '', k: '', r: '' },
    parsed: { c: res.value, f: null, k: null, r: null },
    errors: { c: null, f: null, k: null, r: null },
    edited: { c: false, f: false, k: false, r: false },
    active: 'c'
  });
  syncDoc(state.get());
  inputs.c.focus();
  inputs.c.select();
}

historyApi = createHistory({
  store,
  state,
  listEl: document.getElementById('history-list'),
  emptyEl: document.getElementById('history-empty'),
  countEl: document.getElementById('history-count'),
  clearBtn: document.getElementById('history-clear'),
  headerEl: document.querySelector('#history .card__head'),
  onRestore: restoreEntry,
  notify
});

const theme = createThemeController({
  storage: store.ok ? {
    getItem: (k) => { const v = store.read(k); return v === null ? null : JSON.stringify(v); },
    setItem: (k, v) => { try { store.write(k, JSON.parse(v)); } catch { /* keep going */ } },
    removeItem: (k) => store.remove(k)
  } : null,
  button: document.getElementById('theme-toggle')
});

// --- rendering subscription + immediate first paint ---
state.subscribe((s) => { render(s); tableView.update(s); });
render(seed);
tableView.update(seed);
historyApi.render();
syncDoc(state.get()); // deep-linked values must reflect in title immediately (PLAN 11.21)

// --- field events ---
for (const u of UNITS) {
  const input = inputs[u];
  input.addEventListener('compositionstart', () => { composing = true; });
  input.addEventListener('compositionend', () => { composing = false; setField(u, input.value, false, true); });
  input.addEventListener('input', () => { if (!composing) setField(u, input.value, false, true); });
  input.addEventListener('focus', () => state.set({ active: u }));
  input.addEventListener('blur', () => commit(u));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    else if (e.key === 'Escape') { input.value = ''; setField(u, '', false); }
  });
}

const form = document.getElementById('convert-form');
form.addEventListener('submit', (e) => { e.preventDefault(); if (document.activeElement !== document.body) document.activeElement.blur(); });

// --- action delegation (single listener; no inline handlers) ---
const actionMap = {
  'copy-all': (el) => performCopy(buildCopyPairs(state.get()), el, inputs[state.get().active]),
  'copy-field': (el) => {
    const u = el.dataset.unit;
    const shown = inputs[u].value.trim();
    if (!shown) { notify('This field is empty.', 'error'); return; }
    performCopy([{ unit: u, text: shown }], el, inputs[u]);
  },
  'reset': () => { clearAll(); inputs.c.focus(); },
  'rotate': rotate,
  'toggle-rankine': toggleRankine,
  'theme': () => theme.toggle(),
  'share': async () => {
    const text = buildCopyText(buildCopyPairs(state.get()));
    try { await navigator.share({ title: 'TempConv', text: text || 'Temperature conversion via TempConv', url: location.href }); }
    catch (err) { if (err && err.name !== 'AbortError') notify('Couldn\u2019t share — copy instead.', 'error'); }
  },
  'preset': (el) => {
    setField('c', el.dataset.value, false, false);
    if (historyApi) historyApi.push();
    inputs.c.focus();
  },
  'precision': (el) => setPrecision(Number(el.dataset.value), el)
};

document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = actionMap[el.dataset.action];
  if (fn) fn(el);
});

// --- segmented keyboard (radiogroup roving pattern) ---
const seg = document.querySelector('.seg');
seg.addEventListener('keydown', (e) => {
  const opts = Array.from(seg.querySelectorAll('[role="radio"]'));
  const idx = opts.findIndex((o) => o.getAttribute('aria-checked') === 'true');
  const next = segNavigate(idx, e.key, opts.length);
  if (next === idx) return;
  e.preventDefault();
  setPrecision(Number(opts[next].dataset.value), opts[next]);
});

// --- global shortcuts ---
window.addEventListener('keydown', createKeymap({
  t: () => theme.toggle(),
  c: () => { const el = document.getElementById('btn-copy'); if (!el.disabled) actionMap['copy-all'](el); },
  s: rotate,
  r: toggleRankine,
  p: () => setPrecision(PRECISIONS[(PRECISIONS.indexOf(state.get().precision) + 1) % PRECISIONS.length]),
  '1': () => focusUnit('c'),
  '2': () => focusUnit('f'),
  '3': () => focusUnit('k'),
  '4': () => focusUnit('r')
}));

// --- share availability ---
if (typeof navigator.share === 'function') document.getElementById('btn-share').hidden = false;

// --- cross-tab theme sync ---
window.addEventListener('storage', (e) => {
  if (e.key === KEYS.theme) theme.syncUI();
});
