# TempConv — Motion inventory

Policy (DESIGN.md): functional only, color/opacity/transform-exception-for-toast, ≤160ms ease-out, global reduced-motion collapse in base.css. No JS-driven animation.

| # | Surface | Property | Duration | Reduced mode |
| --- | --- | --- | --- | --- |
| 1 | field box hover/focus | border-color | 120ms | instant |
| 2 | field tint (active/stale/error) | background-color/opacity | 120ms | instant |
| 3 | buttons/chip/seg | background-color, color, border-color | 120ms | instant |
| 4 | toast entrance | opacity + translateY(6px) keyframe | 160ms | 0.01ms |
| 5 | copy→check icon swap | opacity | 120ms | instant |
| 6 | theme toggle crossfade (opt-in class) | background-color, color | 160ms | instant |
| 7 | skip-link/anchor scroll | scroll-behavior smooth (html) | browser default | `scroll-behavior:auto` |
| 8 | history confirm mode | background-color (button) | 120ms | instant |

Never animated: width/height/box-shadow/letter-spacing/layout at all. `transition: all` is banned (grep-verified). Table auto-scroll to current row uses programmatic `scrollTop` (instant by design — deterministic, never fights the wheel).

Transform usage: skip-link hide (positioning), toast entrance — the two documented overlay/chrome exceptions; nothing in content flow.
