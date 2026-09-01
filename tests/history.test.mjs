import test from 'node:test';
import assert from 'node:assert/strict';

import { capEntries, pushEntry, timeLabel, snapshotEntry, MAX_ENTRIES } from '../js/modules/history.js';
import { createStore } from '../js/modules/store.js';

function fakeStorage(bag = new Map(), fail = false) {
  return {
    getItem(k) { if (fail) throw new Error('SecurityError'); return bag.has(k) ? bag.get(k) : null; },
    setItem(k, v) { if (fail) throw new Error('QuotaExceeded'); bag.set(k, String(v)); },
    removeItem(k) { bag.delete(k); },
    bag
  };
}

const entry = (c, ts = 0) => ({ id: `${c}-${ts}`, units: { c, f: '', k: '', r: '' }, p: 2, ts });

test('store: roundtrip + versioned keys', () => {
  const bag = new Map();
  const store = createStore(fakeStorage(bag));
  assert.equal(store.ok, true);
  store.write('tempconv.v1.history', [entry('20')]);
  const out = store.read('tempconv.v1.history');
  assert.equal(out.length, 1);
  assert.equal(out[0].units.c, '20');
});

test('store: corrupted JSON is wiped, app survives', () => {
  const fake = fakeStorage();
  fake.setItem('k', '{not json');
  const store = createStore(fake);
  assert.equal(store.read('k'), null);
  assert.equal(store.ok, true);
  assert.equal(fake.getItem('k'), null); // wiped
});

test('store: inaccessible storage degrades ok=false', () => {
  const store = createStore(fakeStorage(new Map(), true));
  assert.equal(store.read('tempconv.v1.history'), null);
  assert.equal(store.ok, false);
  assert.equal(store.write('a', 1), false);
});

test('capEntries keeps last 20', () => {
  const many = Array.from({ length: 21 }, (_, i) => entry(String(i)));
  const capped = capEntries(many);
  assert.equal(capped.length, MAX_ENTRIES);
  assert.equal(capped[0].units.c, '1');
  assert.equal(capped[MAX_ENTRIES - 1].units.c, '20');
});

test('pushEntry dedupes consecutive identical c strings', () => {
  let list = [];
  list = pushEntry(list, entry('20'));
  list = pushEntry(list, entry('20'));
  assert.equal(list.length, 1);
  list = pushEntry(list, entry('21'));
  list = pushEntry(list, entry('20'));
  assert.equal(list.length, 3);
});

test('timeLabel: today clock, yesterday, older date, future guard', () => {
  const sameDay = new Date(2026, 8, 1, 9, 0).getTime();
  const laterToday = new Date(2026, 8, 1, 12, 4).getTime();
  assert.equal(timeLabel(sameDay, laterToday), '9:00 AM');
  assert.equal(timeLabel(sameDay, sameDay + 34 * 3600 * 1000), 'yesterday');
  const noon = new Date(2026, 8, 1, 12, 4).getTime();
  const old = new Date(2026, 7, 20, 9, 0).getTime();
  assert.match(timeLabel(old, noon), /Aug 20/);
  const future = noon + 3600 * 1000;
  assert.match(timeLabel(future, noon), /\d/); // shows a clock, never "in Xm"
});

test('snapshotEntry: formats all units from active, null on error', () => {
  const state = { values: { c: '37' }, parsed: { c: 37 }, errors: { c: null }, active: 'c', precision: 2, showRankine: true };
  const snap = snapshotEntry(state);
  assert.equal(snap.units.c, '37');
  assert.equal(snap.units.f, '98.6');
  assert.equal(snap.units.r, '558.27');
  assert.ok(snap.id);
  const bad = snapshotEntry({ ...state, errors: { c: 'not-a-number' } });
  assert.equal(bad, null);
});
