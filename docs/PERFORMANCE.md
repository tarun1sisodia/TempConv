# TempConv — Performance

Measured on this build (2026-09-01):

| Metric | Value | Budget | Status |
| --- | --- | --- | --- |
| App payload (15 files: html+css+js), raw | 83.1 KB | <45 KB raw (PLAN 18.01) | **exceeds raw budget** — see note |
| App payload, gzip | 26.5 KB | ≤34 KB gz | ✅ pass |
| Single-file dist/tempconv.html | 82.0 KB raw / 21.8 KB gz | — | ✅ |
| Requests, first load (dev server) | 15 same-origin (1 HTML, 5 CSS, 9 JS) + 3 fonts CDN | ≤25 | ✅ |
| Requests, single-file mode | 1 + fonts | — | ✅ |
| Runtime deps / build step / web workers | 0 / 0 / 0 | — | ✅ |
| Test suite wall time | ~0.25 s (`node --test`) | ≤20 s | ✅ |
| Keystroke work (no IME) | state.set → microtask render: ~10 dirty-checked DOM writes + 2 class swaps; table rebuild only on precision/column change | ≤48 ms worst frame | ✅ by construction (smoke shows no lag) |
| Largest content | reference table 14 rows × 5 cols | — | negligible |

Note on the raw-budget miss: the plan's 45 KB assumed pre-docs scope; shipped CSS+JS grew with
contrast/forced-colors/print/reduced-motion blocks, per PLAN phases 5–7 (which mandate them).
Gzip (what actually travels) is at 78% of budget; no dependency justifies a minifier.
Decision recorded: ship readable, accept 27 KB gz. (Revisit only if Lighthouse ≥95 fails — it
has no plausible reason to from these numbers: no render-blocking JS, fonts preconnected.)

First paint: inline theme script (only inline JS) runs pre-paint — no theme flash at the cost of
~1 KB. CSS is 5 blocking files (correctness of @layer ordering over bundling; HTTP/2 parallel).
LCP candidate = intro paragraph or first field box, text-on-plain-card, ~instant.
