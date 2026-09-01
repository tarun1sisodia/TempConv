# TempConv — Conventions

## File ownership (CSS layers, load = cascade order)
| Layer | File | May contain |
| --- | --- | --- |
| tokens | css/tokens.css | `:root` var declarations only — every raw value in the system lives here |
| base | css/base.css | reset, element defaults, type utilities, reduced-motion block, focus recipe |
| layout | css/layout.css | shell, grid, responsiveness, print |
| components | css/components.css | components (.card, .field, .btn, .chip, .seg, .table, .toast, …) |
| utilities | css/utilities.css | atoms only (.u-sr, .u-hidden, .u-num, .u-empty, `[hidden]`) — never overrides component state logic |

`@layer tokens, base, layout, components, utilities;` is declared once at the top of tokens.css.

## Hard rules (enforced by `node scripts/tokens-check.mjs`)
- DESIGN.md is the source of truth: edit it first, then tokens.css, then everything else.
- No raw hex colors outside tokens.css. No raw px outside tokens.css except: `1px`, `0px`, media queries, or lines carrying a `/* raw-allow: reason */` comment.
- Every `var(--x)` referenced anywhere must be defined in tokens.css.
- DESIGN.md ↔ tokens.css drift = build failure.

## JS
- Native ES modules, strict by default, `const`-first, no globals; `js/main.js` is the only file that wires the world.
- `js/converter.js`, `js/modules/state.js`, `js/modules/store.js`, `js/modules/history.js` (exported fns), `js/modules/table.js` (buildRows) are DOM-free and node-testable. DOM writes happen only in `js/modules/ui.js` (+ table/history views).
- State is truth; DOM strings never feed back except through input/blur events (`commit()` parses state, not the DOM).
- No inline `onclick`; all clicks flow through the `[data-action]` delegation map in main.js.
- The inline `<script>` in index.html `<head>` (zero-FOUC theme boot) is the ONLY inline script exception.

## Hex literals outside CSS
Allowed only in: manifest.webmanifest and theme.js meta sync — both are files CSS variables can't reach. Documented exception.

## Naming
- Kebab-case files; flat BEM-ish classes (`.field__box`, `.btn--primary`, `.is-error`).
- Component state = attribute or class flipped by JS only: `hidden`, `aria-pressed`, `aria-checked`, `aria-invalid`, `is-active`, `is-error`, `is-stale`, `is-done`. CSS never *decides* state, only *styles* it.

## Commits
Conventional Commits subset; one commit per plan phase; QA fixes ride as `fix(qa): <row-id>`.
