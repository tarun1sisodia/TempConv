#!/usr/bin/env node
// Drift gate between DESIGN.md (source of truth) and css/tokens.css, plus a literal scan of
// the other stylesheets. No dependencies. Exit code: 0 clean, 1 drift/violations found.
// Usage: node scripts/tokens-check.mjs [--dump]

import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');

const design = read('DESIGN.md');
const fmMatch = design.match(/^---\n([\s\S]*?)\n---/);
if (!fmMatch) { console.error('DESIGN.md: no YAML front matter block found'); process.exit(1); }

/** Naive 2-level YAML reader sufficient for the design.md token schema. */
function parseFrontMatter(src) {
  const groups = {};
  let group = null, token = null;
  for (const raw of src.split('\n')) {
    if (!raw.trim() || raw.trimStart().startsWith('#')) continue;
    const top = raw.match(/^([A-Za-z][\w-]*):\s*$/);
    if (top) { group = top[1]; groups[group] = {}; token = null; continue; }
    const two = raw.match(/^  ([\w-]+):\s*(.*)$/);
    if (two) {
      token = two[1];
      groups[group] ??= {};
      if (two[2] === '') groups[group][token] = {};
      else groups[group][token] = two[2].trim().replace(/^["']|["']$/g, '');
      continue;
    }
    const four = raw.match(/^    ([\w-]+):\s*(.*)$/);
    if (four && group && token) {
      if (typeof groups[group][token] !== 'object') groups[group][token] = {};
      groups[group][token][four[1]] = four[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return groups;
}

const tokens = parseFrontMatter(fmMatch[1]);
const css = read('css/tokens.css');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const drift = [];

function expectVar(name, value, kind) {
  const re = new RegExp(`${esc(name)}:\\s*([^;]+);`);
  const m = css.match(re);
  if (!m) { drift.push(`missing ${kind} var ${name}`); return; }
  const got = m[1].trim().toLowerCase();
  const want = String(value).trim().toLowerCase();
  if (got !== want) drift.push(`${kind} drift ${name}: DESIGN.md="${want}" tokens.css="${got}"`);
}

for (const [name, value] of Object.entries(tokens.colors || {})) expectVar(`--color-${name}`, value, 'color');
for (const [name, value] of Object.entries(tokens.rounded || {})) expectVar(`--radius-${name}`, value, 'rounded');
for (const [name, value] of Object.entries(tokens.spacing || {})) expectVar(`--space-${name}`, value, 'spacing');
for (const [name, t] of Object.entries(tokens.typography || {})) {
  if (t && typeof t === 'object' && t.fontSize) expectVar(`--t-${name}-size`, t.fontSize, 'typography');
}

// Literal scan: no raw hex, no off-grid px outside documented exceptions.
const scanFiles = ['css/base.css', 'css/layout.css', 'css/components.css', 'css/utilities.css'];
const violations = [];
for (const f of scanFiles) {
  const source = read(f).replace(/\/\*[\s\S]*?\*\//g, (mm) => (mm.includes('raw-allow') ? '/*raw-allow*/' : ' ')); // keep exemption markers, drop the rest
  const lines = source.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('raw-allow')) return;
    if (/#([0-9a-fA-F]{3,8})\b/.test(line)) violations.push(`${f}:${i + 1} raw hex: ${line.trim().slice(0, 60)}`);
    const px = line.match(/(?<![\w.])\d+(?:\.\d+)?px/g) || [];
    for (const p of px) {
      if (p === '1px' || p === '0px') continue;
      if (/min-width|max-width/.test(line)) continue; // breakpoints: media queries can't read vars (documented)
      violations.push(`${f}:${i + 1} raw ${p} (no raw-allow comment): ${line.trim().slice(0, 60)}`);
    }
  });
}

// Undefined-var gate: every var(--x) used anywhere in css/ must be defined in tokens.css.
{
  const defined = new Set([...css.matchAll(/(--[\w-]+):/g)].map((m) => m[1]));
  for (const f of ['css/tokens.css', ...scanFiles]) {
    const src = read(f);
    for (const m of src.matchAll(/var\((--[\w-]+)/g)) {
      if (!defined.has(m[1])) violations.push(`${f} references undefined var ${m[1]}`);
    }
  }
}

if (process.argv.includes('--dump')) {
  const rows = ['| Token | Value |', '| --- | --- |'];
  for (const g of ['colors', 'rounded', 'spacing']) {
    for (const [n, v] of Object.entries(tokens[g] || {})) rows.push(`| \`${g}.${n}\` | ${v} |`);
  }
  for (const [n, t] of Object.entries(tokens.typography || {})) {
    if (t && typeof t === 'object') rows.push(`| \`typography.${n}\` | ${t.fontSize} / ${t.fontWeight} / ${t.lineHeight} |`);
  }
  console.log(rows.join('\n'));
  process.exit(0);
}

const problems = [...drift, ...violations];
if (problems.length) {
  console.error(`tokens-check: ${problems.length} problem(s)`);
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
const n = Object.keys(tokens.colors || {}).length;
console.log(`tokens-check: 0 drift, 0 literal violations (${n} colors checked)`);
