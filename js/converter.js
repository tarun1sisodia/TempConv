// TempConv conversion engine — pure module: no DOM, importable from node tests.
// Every conversion routes through Celsius as the canonical unit (PLAN 10.02).
// JSDoc inline; see tests/converter.test.mjs for the contract.

/** @typedef {'c'|'f'|'k'|'r'} Unit */
/** @typedef {{ok: true, value: number|null}|{ok: false, code: 'not-a-number'|'too-large'|'below-absolute-zero'}} ParsedResult */

export const UNITS = ['c', 'f', 'k', 'r'];
export const UNIT_LABELS = { c: '°C', f: '°F', k: 'K', r: '°R' };
export const UNIT_NAMES = { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin', r: 'Rankine' };
export const PRECISIONS = [0, 1, 2, 3, 6];
export const ABS_ZERO_C = -273.15;
const EPS = 1e-9;

/** Snap floating-point dust to integers at unit boundaries (67.99999999999999 -> 68). */
export function snap(v) {
  const r = Math.round(v);
  return Math.abs(v - r) < EPS ? r : v;
}

/** @param {Unit} unit @param {number} v @returns {number} degrees Celsius */
export function toCelsius(unit, v) {
  switch (unit) {
    case 'c': return v;
    case 'f': return (v - 32) * 5 / 9;
    case 'k': return v - 273.15;
    case 'r': return v * 5 / 9 - 273.15;
  }
  throw new Error('unknown unit: ' + unit);
}

/** @param {Unit} unit @param {number} c degrees Celsius @returns {number} */
export function fromCelsius(unit, c) {
  switch (unit) {
    case 'c': return c;
    case 'f': return c * 9 / 5 + 32;
    case 'k': return c + 273.15;
    case 'r': return (c + 273.15) * 9 / 5;
  }
  throw new Error('unknown unit: ' + unit);
}

/** @param {Unit} from @param {number} value @param {Unit} to */
export function convert(from, value, to) {
  return fromCelsius(to, toCelsius(from, value));
}

const formatters = new Map();
function formatter(precision, notation) {
  const key = precision + '|' + notation;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
      useGrouping: true,
      notation
    });
    formatters.set(key, f);
  }
  return f;
}

/**
 * Display string for a number: up to `precision` decimals (trailing zeros trimmed),
 * thousand-grouping, scientific beyond 1e9 / below 1e-6, U+2212 minus, negative zero -> "0".
 * @param {number|null|undefined} value @param {number} precision @returns {string}
 */
export function format(value, precision) {
  if (value === null || value === undefined || value === '') return '';
  const v = snap(Number(value));
  if (Number.isNaN(v)) return '';
  if (v === 0) return '0';
  if (!Number.isFinite(v)) {
    // Infinity: render the sign only via a stable word; callers normally reject this in parse.
    return v > 0 ? '∞' : '−∞';
  }
  const a = Math.abs(v);
  const notation = (a >= 1e9 || a < 1e-6) ? 'scientific' : 'standard';
  const s = formatter(precision, notation).format(v);
  // Anything that *rounds* to zero renders "0" — never "−0" or "−0.00" (PLAN 10.10).
  if (/^-0*(\.0+)?$/.test(s)) return '0';
  return s.replace('-', '\u2212');
}

const NUM_RE = /^-?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

/**
 * Forgiving number parser: trims, accepts U+2212, strips a trailing unit ("72°F"),
 * takes the first token of multi-line pastes, accepts decimal commas and scientific input.
 * @param {string} raw @param {Unit} unit @returns {ParsedResult}
 */
export function parseInput(raw, unit) {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  let s = String(raw).trim().replace(/\u2212/g, '-');
  if (s === '') return { ok: true, value: null };
  s = s.split(/\s+/)[0];
  s = s.replace(/[°º]/g, '');
  s = s.replace(/(celsius|fahrenheit|kelvin|rankine)$/i, '');
  s = s.replace(/[CFKR]$/, '');
  s = s.replace(/(\d),(?=\d{3}(\D|$))/g, '$1');
  s = s.replace(/,/g, '.');
  if (!NUM_RE.test(s)) return { ok: false, code: 'not-a-number' };
  const v = Number(s);
  if (!Number.isFinite(v)) return { ok: false, code: 'too-large' };
  if (toCelsius(unit, v) < ABS_ZERO_C - 1e-6) return { ok: false, code: 'below-absolute-zero' };
  return { ok: true, value: snap(v) };
}

/** True for errors that should validate live while typing (range), vs on blur (syntax). */
export function isHardError(code) {
  return code === 'too-large' || code === 'below-absolute-zero';
}

/** @param {boolean} showRankine @returns {Unit[]} */
export function visibleUnits(showRankine) {
  return showRankine ? UNITS : UNITS.filter((u) => u !== 'r');
}

/** Rotate active unit one step through the visible list (wrap-around). @returns {Unit} */
export function nextUnit(active, visible) {
  const list = visible && visible.length ? visible : UNITS;
  const i = list.indexOf(active);
  return list[(i + 1) % list.length];
}

/** Value + nbsp + unit, single source for DOM, clipboard, title, share. */
export function unitString(unit, formatted) {
  return formatted + '\u00A0' + UNIT_LABELS[unit];
}

/**
 * Clipboard text: one line per visible unit.
 * @param {{unit: Unit, text: string|null}[]} pairs @returns {string}
 */
export function buildCopyText(pairs) {
  return pairs
    .map(({ unit, text }) => `${UNIT_NAMES[unit]}: ${text || '—'}${text ? '\u00A0' + UNIT_LABELS[unit] : ''}`)
    .join('\n');
}
