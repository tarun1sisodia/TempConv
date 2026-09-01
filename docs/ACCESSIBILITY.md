# TempConv — Accessibility

Target: WCAG 2.2 AA, both themes. Approach: native semantics first, ARIA only where HTML can't
express it (segmented radiogroup, live regions). All below implemented in this build.

## Structure & reading order
- `<html lang="en">`, one `<h1>`, landmarks (`header/main/footer`, labelled sections), skip link.
- DOM order = visual order at every breakpoint (single source layout, PLAN 8.04 discipline).
- Conversion result changes are intentionally **not** aria-live (spam); errors announce via the
  per-field `role=status` message + `aria-describedby` on blur-commit, table caption announces
  precision, toasts are `role=status` polite.

## Keyboard
- Every action reachable; roving tabindex in the seg; Arrow/Home/End semantics; Enter commits,
  Escape clears focused field; table and history lists are `tabindex=0` labelled scroll regions
  (WCAG 2.1.1 for scrollable content); focus is programatically preserved (table scrollTop,
  history item, copy→check button) as specified.
- Visible focus: 3px tint ring + 2px accent outline everywhere, plus `:focus-visible` variants;
  no focus trap anywhere; document-level shortcuts ignore modifier combos (11.11).

## Screen reader support (audit below)
Labelled fields via `for/id`; hidden label `aria-label` on icon buttons with static + dynamic
parts split ("Copy all values" button, "Copy 68 °F" per-field); table `scope`/`caption`/
`aria-current`; `aria-pressed` chips; `aria-checked` radios; `aria-invalid` + `aria-describedby`
wired to the error id even when empty (message appears in place, no layout shift — 20px min line).

## Color & motion
- Palette pairs verified ≥4.5:1 (text) / ≥3:1 (UI) at token-creation time (DESIGN.md
  Accessibility section lists every pair). Color is never the only carrier: error = border +
  icon + text; active = tick + tint + bold suffix.
- `prefers-reduced-motion: reduce` collapses all transitions/animations (base.css global block);
  table auto-scroll is instant by design.

## Platform accommodations
`prefers-contrast: more` token overrides (hairlines 2px via variables), `prefers-color-scheme:
dark` + `[data-theme]`, Windows High Contrast: borders via system colors, `forced-color-adjust:
none` only on elements that keep meaning (tinted backgrounds removed, ticks become system-color
borders — components.css forced-colors block). Text sizing 14px base with `rem` on typography
tokens; 400% zoom reflows (media queries, no fixed heights anywhere except touch-target mins).

SR-QA.md holds the per-screen-reader checklists.
