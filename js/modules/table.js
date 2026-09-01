// Reference table: pure row builder (node-tested) + incremental DOM view.

import { fromCelsius, format, toCelsius } from '../converter.js';

/**
 * @param {{precision?: number, min?: number, max?: number, step?: number, catchment?: number, activeC?: number|null, showRankine?: boolean}} opts
 * @returns {{c: number, cells: {c: string, f: string, k: string, r: string}, isCurrent: boolean}[]}
 */
export function buildRows(opts = {}) {
  const { precision = 2, min = -60, max = 200, step = 20, catchment = 10, activeC = null } = opts;
  const rows = [];
  for (let c = min; c <= max; c += step) {
    rows.push({
      c,
      cells: {
        c: format(c, precision),
        f: format(fromCelsius('f', c), precision),
        k: format(fromCelsius('k', c), precision),
        r: format(fromCelsius('r', c), precision)
      },
      isCurrent: activeC !== null && Number.isFinite(activeC) && Math.abs(c - activeC) <= catchment
    });
  }
  return rows;
}

/** Derived source value for the table: the active field's parsed value in Celsius space. */
export function activeCelsius(state) {
  const v = state.parsed[state.active];
  if (v === null || v === undefined || state.errors[state.active]) return null;
  const c = toCelsius(state.active, v);
  return Number.isFinite(c) ? c : null;
}

/**
 * @param {{tbody: HTMLElement, wrapper: HTMLElement, captionEl: HTMLElement, thREl: HTMLElement, precision: () => number}} deps
 */
export function createTableView({ tbody, wrapper, captionEl }) {
  let dataSig = '';
  let lastCurrent = null;

  function rebuild(state) {
    const rows = buildRows({ precision: state.precision });
    const scrollTop = wrapper.scrollTop;
    const frag = document.createDocumentFragment();
    for (const row of rows) {
      const tr = document.createElement('tr');
      tr.dataset.c = String(row.c);
      for (const key of ['c', 'f', 'k', 'r']) {
        const td = document.createElement('td');
        if (key === 'r') { td.classList.add('col-r'); td.hidden = !state.showRankine; }
        td.textContent = row.cells[key];
        tr.appendChild(td);
      }
      frag.appendChild(tr);
    }
    tbody.textContent = '';
    tbody.appendChild(frag);
    wrapper.scrollTop = scrollTop; // rebuild must not yank the viewport (PLAN 14.08)
  }

  function markCurrent(state) {
    const activeC = activeCelsius(state);
    let current = null;
    if (activeC !== null) {
      for (const tr of tbody.children) {
        if (Math.abs(Number(tr.dataset.c) - activeC) <= 10) { current = tr; break; }
      }
    }
    if (current === lastCurrent) return;
    if (lastCurrent) { lastCurrent.classList.remove('is-current'); lastCurrent.removeAttribute('aria-current'); }
    if (current) {
      current.classList.add('is-current');
      current.setAttribute('aria-current', 'true');
      // deterministic scroll inside the wrapper only — scrollIntoView can drag the page
      const wb = wrapper.getBoundingClientRect();
      const rb = current.getBoundingClientRect();
      if (rb.top < wb.top || rb.bottom > wb.bottom) {
        wrapper.scrollTop += (rb.top - wb.top) - wrapper.clientHeight / 2 + rb.height / 2;
      }
    }
    lastCurrent = current;
  }

  return {
    update(state) {
      const sig = `${state.precision}|${state.showRankine}`;
      if (sig !== dataSig) { dataSig = sig; rebuild(state); }
      markCurrent(state);
      captionEl.textContent = `Values rounded to up to ${state.precision} decimal${state.precision === 1 ? '' : 's'}\u00A0 · \u00A0step 20\u00A0°C`;
    }
  };
}
