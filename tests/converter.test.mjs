import test from 'node:test';
import assert from 'node:assert/strict';

import {
  format, fromCelsius, toCelsius, convert, parseInput, snap,
  nextUnit, visibleUnits, unitString, buildCopyText, isHardError, UNITS, PRECISIONS
} from '../js/converter.js';
import { segNavigate } from '../js/modules/state.js';

test('freezing: 0 °C -> 32 °F / 273.15 K / 491.67 °R', () => {
  assert.equal(format(fromCelsius('f', 0), 2), '32');
  assert.equal(format(fromCelsius('k', 0), 2), '273.15');
  assert.equal(format(fromCelsius('r', 0), 2), '491.67');
});

test('body: 37 °C -> 98.6 °F / 310.15 K / 558.27 °R', () => {
  assert.equal(format(fromCelsius('f', 37), 2), '98.6');
  assert.equal(format(fromCelsius('k', 37), 2), '310.15');
  assert.equal(format(fromCelsius('r', 37), 2), '558.27');
});

test('boiling: 100 °C -> 212 °F / 373.15 K / 671.67 °R', () => {
  assert.equal(format(fromCelsius('f', 100), 2), '212');
  assert.equal(format(fromCelsius('k', 100), 2), '373.15');
  assert.equal(format(fromCelsius('r', 100), 2), '671.67');
});

test('crossover: -40 °C == -40 °F exactly', () => {
  assert.equal(format(fromCelsius('f', -40), 2), '\u221240');
});

test('absolute zero: -273.15 °C -> -459.67 °F / 0 K / 0 °R; 0 °R -> 0 K', () => {
  assert.equal(format(fromCelsius('f', -273.15), 2), '\u2212459.67');
  assert.equal(format(fromCelsius('k', -273.15), 2), '0');
  assert.equal(format(fromCelsius('r', -273.15), 2), '0');
  assert.equal(format(toCelsius('r', 0) + 273.15, 2), '0');
});

test('epsilon snap kills float dust', () => {
  assert.equal(snap(67.99999999999999), 68);
  assert.equal(format(67.99999999999999, 2), '68');
});

test('round-trip fuzz stays within 1e-9', () => {
  for (let i = 0; i < 1000; i++) {
    const v = -273.15 + Math.random() * 2273.15;
    for (const u of UNITS) {
      const back = toCelsius(u, fromCelsius(u, v));
      assert.ok(Math.abs(back - v) < 1e-9, `round trip ${u} failed at ${v}`);
    }
  }
});

test('parse: forgiving inputs', () => {
  assert.deepEqual(parseInput(' 20 ', 'c'), { ok: true, value: 20 });
  assert.deepEqual(parseInput('20°C', 'c'), { ok: true, value: 20 });
  assert.deepEqual(parseInput('\u2212273,15', 'c'), { ok: true, value: -273.15 });
  assert.deepEqual(parseInput('.5', 'c'), { ok: true, value: 0.5 });
  assert.deepEqual(parseInput('5.', 'c'), { ok: true, value: 5 });
  assert.deepEqual(parseInput('1e3', 'c'), { ok: true, value: 1000 });
  assert.deepEqual(parseInput('12\n34', 'c'), { ok: true, value: 12 });
  assert.deepEqual(parseInput('1,5', 'c'), { ok: true, value: 1.5 });
  assert.deepEqual(parseInput('1,234', 'c'), { ok: true, value: 1234 });
  assert.deepEqual(parseInput('', 'f'), { ok: true, value: null });
});

test('parse: rejections', () => {
  assert.deepEqual(parseInput('1.5.5', 'c'), { ok: false, code: 'not-a-number' });
  assert.deepEqual(parseInput('٣٧', 'c'), { ok: false, code: 'not-a-number' });
  assert.deepEqual(parseInput('abc', 'c'), { ok: false, code: 'not-a-number' });
  assert.deepEqual(parseInput('1e999', 'c'), { ok: false, code: 'too-large' });
});

test('parse: below absolute zero per unit', () => {
  assert.deepEqual(parseInput('-274', 'c'), { ok: false, code: 'below-absolute-zero' });
  assert.deepEqual(parseInput('-460', 'f'), { ok: false, code: 'below-absolute-zero' });
  assert.deepEqual(parseInput('-1', 'k'), { ok: false, code: 'below-absolute-zero' });
  assert.deepEqual(parseInput('-1', 'r'), { ok: false, code: 'below-absolute-zero' });
  assert.equal(parseInput('-273.15', 'c').ok, true);
  assert.equal(parseInput('0', 'k').ok, true);
});

test('format edges: -0 -> "0", grouping, precision 0', () => {
  assert.equal(format(-0.001, 2), '0');
  assert.equal(format(-0, 2), '0');
  assert.equal(format(999.999, 2), '1,000');
  assert.equal(format(67.5, 0), '68');
  assert.equal(format(293.15, 6), '293.15');
  assert.equal(format(1.5e9, 2), '1.5E9');
});

test('format: U+2212 minus, never ASCII hyphen', () => {
  const s = format(-12.3, 2);
  assert.equal(s, '\u221212.3');
  assert.ok(!s.includes('-'));
});

test('unitString + convert', () => {
  assert.equal(unitString('k', '293.15'), '293.15\u00A0K');
  assert.equal(convert('f', 212, 'c'), 100);
});

test('error hardness: syntax is soft, range is hard', () => {
  assert.equal(isHardError('not-a-number'), false);
  assert.equal(isHardError('below-absolute-zero'), true);
  assert.equal(isHardError('too-large'), true);
});

test('unit navigation', () => {
  assert.equal(nextUnit('c', visibleUnits(false)), 'f');
  assert.equal(nextUnit('k', visibleUnits(false)), 'c');
  assert.equal(nextUnit('k', visibleUnits(true)), 'r');
  assert.equal(nextUnit('r', visibleUnits(true)), 'c');
});

test('segNavigate', () => {
  assert.equal(segNavigate(2, 'ArrowRight', 5), 3);
  assert.equal(segNavigate(2, 'ArrowLeft', 5), 1);
  assert.equal(segNavigate(4, 'ArrowRight', 5), 0);
  assert.equal(segNavigate(0, 'ArrowLeft', 5), 4);
  assert.equal(segNavigate(3, 'Home', 5), 0);
  assert.equal(segNavigate(3, 'End', 5), 4);
  assert.equal(segNavigate(3, 'x', 5), 3);
});

test('buildCopyText: lines per unit, em dash for invalid', () => {
  const text = buildCopyText([
    { unit: 'c', text: '20' },
    { unit: 'f', text: '68' },
    { unit: 'k', text: null }
  ]);
  assert.equal(text, 'Celsius: 20\u00A0°C\nFahrenheit: 68\u00A0°F\nKelvin: —');
});

test('precision ladder fixed', () => {
  assert.deepEqual(PRECISIONS, [0, 1, 2, 3, 6]);
});
