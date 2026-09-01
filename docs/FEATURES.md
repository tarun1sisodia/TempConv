# TempConv — v1 Feature Map

| Feature | Where | Plan phases |
| --- | --- | --- |
| Live bidirectional conversion °C ⇄ °F ⇄ K (°R optional) | converter.js + ui.js render | 9–11 |
| Rankine hidden by default; "Show °R" chip toggles fields + table column (session-persisted) | main.js toggleRankine | 9, 11 |
| Precision 0/1/2/3/6 segmented control (radiogroup, arrows) | seg actions | 4, 9, 11 |
| Forgiving input: paste "72°F"/"−273,15"/"1e3", trailing dots, grouping commas | parseInput | 10, 12 |
| Validation: live range errors, blur-time syntax errors, per-unit absolute-zero floor | ADR-011 | 10, 12 |
| Presets: freezing/boiling/body/room/absolute zero | preset chips | 9, 13 |
| Copy-all + per-field copy, clipboard fallback chain, toast confirm | clipboard.js | 13 |
| Web Share (when available) + deep-linkable URL `?c=&p=` | main.js | 11, 13 |
| Rotate units (value walks C→F→K→R) | rotate | 11 |
| Live reference table (−60…200 step 20, current-row tick + auto-scroll, precision-aware) | table.js | 14 |
| Local history (cap 20, dedupe, restore, per-item delete, two-step clear, cross-tab sync) | history.js + store.js | 15 |
| Light / dark / follow-system theme, zero-FOUC, meta theme-color | theme.js + tokens | 3, 7 |
| Keyboard shortcuts (Alt+T/C/S/R/P/1–4, Enter commit, Esc clear) | keymap | 11, 13 |
| Accessibility: ARIA wiring, live regions, reduced-motion/contrast/forced-colors, skip link, scrollable regions | base/components/index.html | 4, 16 |
| Print stylesheet (converter + table, one page) | layout print | 5 |
| Single-file `dist/tempconv.html` release artifact | scripts/bundle.mjs | 18 |

## Explicitly not in v1
No accounts, no backend, no analytics, no i18n, no mobile-first redesign, no PWA/offline install, no Réaumur/Delisle, no CSV export, no OG image. → ROADMAP.
