# TempConv — Architecture

```
DESIGN.md (Google design.md spec — tokens + prose)
    │  hand-mirrored, drift-gated by scripts/tokens-check.mjs
    ▼
css/tokens.css ──► base ──► layout ──► components ──► utilities   (@layer order)

index.html ──► js/main.js  (boot + [data-action] delegation + keymap)
                 ├─ js/converter.js        pure math: toCelsius/fromCelsius/parse/format  ◄── tests/
                 ├─ js/modules/state.js    observable store, edited flags, seg/keymap      ◄── tests/
                 ├─ js/modules/ui.js       render(state) → fields, seg, chip, copy-enable;
                 │                         toasts, flashDone, title+URL sync (rAF)
                 ├─ js/modules/table.js    buildRows (pure ◄ tests) + incremental view (current-row class swap)
                 ├─ js/modules/history.js  createHistory (DI store) + pure push/cap/timeLabel ◄ tests/
                 ├─ js/modules/store.js    namespaced localStorage wrapper, degrades to ok=false
                 ├─ js/modules/theme.js    system/light/dark, pre-paint + cross-tab sync
                 └─ js/modules/clipboard.js  async → execCommand → manual-select chain
```

Boot sequence (order matters): theme (inline, pre-paint) → URL seed → state → first render →
table build → history render → doc sync → listeners.

Data flow: events mutate state (one `set`) → microtask flush → `render()` projects everything
idempotently (writes are dirty-checked; the field the user is typing in is the only one never
touched — the `edited` flag keeps that scoped to real typing).

Module graph for extensions: a new unit = 4 touch points — converter table entries, a `.field`
row in index.html, its `data-unit`, nothing else (table/history/state are unit-agnostic).
