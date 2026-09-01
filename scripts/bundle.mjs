#!/usr/bin/env node
// Single-file build: inlines css/*.css into <style> and concatenates the ES modules (module
// syntax stripped — every export is a top-level const/function, so this stays correct) into one
// classic script. Output: dist/tempconv.html — a standalone artifact, no build tooling involved.
// Dev-only; the committed source stays unbundled.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');

let html = read('index.html');

// Inline local stylesheets in load order.
html = html.replace(/[ \t]*<link rel="stylesheet" href="css\/[^"]+">\n?/g, (m) => {
  const href = m.match(/href="(css\/[^"]+)"/)[1];
  return `<style>\n${read(href)}\n</style>\n`;
});

const order = [
  'js/converter.js',
  'js/modules/state.js',
  'js/modules/clipboard.js',
  'js/modules/store.js',
  'js/modules/theme.js',
  'js/modules/ui.js',
  'js/modules/table.js',
  'js/modules/history.js',
  'js/main.js'
];

const parts = order.map((f) => read(f)
  .split('\n')
  .filter((l) => !/^\s*import\b.*from\b/.test(l))
  .map((l) => l.replace(/^export\s+(const|function|async|class)\b/, '$1'))
  .join('\n'));

const script = `<script>\n(() => {\n"use strict";\n${parts.join('\n/* ---- module ---- */\n')}\n})();\n</script>`;
// Module semantics: strip the deferred script from <head> and append as the last element of <body>.
html = html.replace(/\s*<script type="module" src="js\/main\.js"><\/script>\n/, '\n');
html = html.replace('</body>', '  ' + script + '\n</body>');

mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', 'tempconv.html');
writeFileSync(out, html);
console.log(`bundle: wrote dist/tempconv.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB raw)`);
