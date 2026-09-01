# TempConv — QA Report (v1.0 build)

Harness: automated, this build (2026-09-01). Real-browser interactive passes are a human follow-up (see QA-SCRIPT.md §Live matrix — honest status per item).

## Automated gates — all green at commit time
| Gate | Command | Result |
| --- | --- | --- |
| Design contract | `npx @google/design.md lint DESIGN.md` | 0 errors (27 orphan-token warnings: component-group children + derived values — expected, not defects) |
| Token drift | `node scripts/tokens-check.mjs` | 0 drift, 0 literal violations (23 colors checked), 0 undefined var() refs |
| Unit tests | `node --test` (converter + history) | 25 pass / 0 fail (~0.25s) |
| HTML validity | `npx html-validate index.html 404.html docs/styleguide.html` | 0 errors (two documented rule exceptions below) |
| JS syntax | `node --check` every file + extracted bundle script | pass |
| Single-file bundle | `node scripts/bundle.mjs` | dist/tempconv.html, JS extracted & re-checked |
| App smoke (jsdom, full bundle) | `/tmp/smoke/smoke.mjs` (harness; not shipped) | 30/30 — two-way conversion both directions incl. −40 crossover, U+2212 rendering, stale-sibling rule, soft-vs-hard validation, presets, Rankine toggle+session, precision change rebuilds table, rotate, reset, theme flip, title+URL sync, table 14 rows + current marker, history add/delete/clear, clipboard button states |
| Boot smoke (jsdom) | `/tmp/smoke/smoke2.mjs` | 12/12 — deep link `?c=37&p=1` (values, precision, caption, title), malformed params ignored, Enter commits, Esc clears, unit-localized Kelvin floor text + bare `K` suffix |

## html-validate exceptions (recorded deliberately)
1. `wcag/h32` off — it demands `role="main"` on `<main>`; redundant per ARIA in HTML spec (implicit landmark role). 
2. `prefer-native-element` off — it flagged (a) the segmented radiogroup: native radio inputs with custom paint score *worse* in our smoke tests (focus/roving-tabindex control), and (b) `<form role="search">`: TempConv's form has **no submit flow** (all buttons `type=button`, Enter handled in JS) so the landmark is a navigational label with no backend to confuse.
Both live in `.htmlvalidate.json` with the same rationale.

## Bugs found & fixed during QA (each became a regression check)
| Finding | Root cause | Fix + test |
| --- | --- | --- |
| Typing in °F/°K/°R left siblings wrong | render treated per-unit parsed value as Celsius | Celsius-canonical path in ui.js render + copy pairs (smoke #1/#2) |
| Focused field kept stale text after preset/rotate/reset/restore | caret-guard skipped writes to any focused input | `edited` flag scopes the guard to real typing only (ADR-014; smoke #7/#9) |
| History delete appeared to do nothing | delete's focus-restore fired a blur-commit that re-pushed the deleted value | `lastPushC` dedupe in history.push (ADR-014; smoke #9 delete) |
| Deep-linked value never reached the title | syncDoc only ran on state changes | boot calls syncDoc(state) (smoke2 A) |
| Bundle JS in `<head>` did nothing | classic script before DOM parse | bundle appends before `</body>` (module-defer semantics) |
| `[hidden]` ignored inside `@layer` | layer order beats specificity | utilities-layer `[hidden]{display:none}` rule |
| Stale `--t-label-size/weight` vars | rename drift | components.css updated + tokens-check now gates *undefined* vars too |
| Bundle SyntaxError | duplicate top-level `const NBSP` across concatenated modules | inline escapes; bundle is single-scope — documented in scripts header |

## Pre-launch hardening round (adversarial pass, same build)
Fuzzed the shipped bundle + pure modules (20k random values × 16 unit pairs vs independent reference formulas; format→parse idempotency at all 5 precisions; junk-parse wall incl. bidi/Arabic-Indic/grouping inputs; 12 corrupted-storage boots; 300-event stress burst; hostile deep links incl. injection payloads). Findings — all fixed, all regression-tested:
| Sev | Finding | Fix |
| --- | --- | --- |
| HIGH | non-array JSON under `tempconv.v1.history` (e.g. `{}`) → `filter is not a function` thrown at boot → app permanently bricked until storage cleared | `Array.isArray` guard on load (history.js) |
| MED | history load uncapped: valid-shaped 500-entry payload rendered 500 rows (cap was push-only) | `capEntries()` applied on load |
| MED | `snapshotEntry` NaN leak: guard was `=== null/undefined`, a NaN `parsed` produced an empty junk entry | `Number.isFinite` guard + unit test (26th) |
Harness lessons (also why two findings were initially missed): seed localStorage in `beforeParse` (post-construction seeding misses boot-time reads); fix the fuzzer's reference model before believing its bugs (one "9.8e+2 precision error" was a wrong reference formula — K→°R ×1.8 is exact). Final state: adversarial suite 0 findings.

## Accessibility static audit (index.html)
One `<h1>`; every landmark one of each; `<html lang>`; landmarks labelled; all 38 interactive controls have accessible names (aria-label or text); both live regions present (`#toasts` polite, error paragraphs); 23 inputs all have `type` + `id` + `<label>`; table has `<caption>` + `<th scope>`; contrast: palette derived from same tokens Google Material ships, AA-checked at authoring (DESIGN.md Accessibility section lists pairs ≥4.5:1 / ≥3:1 UI). Lighthouse/axe runs are the human step: QA-SCRIPT.md §Live matrix.

## Visual/responsive
No browser here — layout matrix (1920/1440/1280/1024/768/390, 400% zoom, print preview, dark/contrast/forced-colors emulation) is listed **unverified-passed** in QA-SCRIPT.md §9 with exact pass criteria, to be executed by a human on `npm run serve`.
