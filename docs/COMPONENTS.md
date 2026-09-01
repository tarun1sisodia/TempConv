# TempConv — Component states & contracts

CSS styles state; only JS flips it. Every state below is attribute- or class-driven.

## Field (`.field`)
| State | Trigger | Visual |
| --- | --- | --- |
| default | — | hairline-ish input border, mono 32px value, muted suffix |
| hover | `@media (hover: hover)` | border → ink-muted |
| focus-within | — | border → accent + 3px tint ring (never border-width change → no layout shift) |
| is-active | JS on focus | row tint + 3px inset accent tick |
| is-error | JS on `errors[u]` | error border, error tint, inline icon+message (`role=status`, `aria-invalid`) |
| is-stale | JS when active field has an error | siblings keep last computed numbers at 45% opacity |
| disabled inputs | n/a (no disabled fields in v1) | — |

## Buttons
`.btn--primary` (one per screen — Copy; `:disabled` when no valid value), `.btn--ghost` (Reset/Rotate/Share/Clear), `.btn--icon` (theme, per-field copy, delete). `.is-done` swaps copy→check for 1200ms. All: 40px, radius sm, colors-only 120ms transitions.

## Chip (`.chip`)
Pill quick-pick. `[aria-pressed="true"]` = selected (tint + accent border + darkened ink) — used by the Rankine toggle only; presets are momentary buttons with no pressed state (deliberate, PLAN 13.02).

## Segmented (`.seg`)
`role=radiogroup` + `role=radio[aria-checked]`, roving tabindex, arrow/Home/End; checked = tint + weight 600. 32px strip, sunken track.

## Table
Sticky header inside `.table-scroll` (420px, `tabindex=0` keyboard-scrollable region). Numeric cells mono right-aligned; `.is-current` = tint + left tick + `aria-current="true"`. `°R` column toggles with `hidden`. Read-only rows (ADR in PLAN 14.17). Rebuild on precision/columns; keystroke path = class swaps only; scrollTop preserved; auto-scroll computed inside wrapper (never `scrollIntoView`).

## History
Rows: restore button (stretched hit-area) · relative time · delete on hover/focus-within (always visible on touch). Two-step clear with 3s revert. Empty state, storage-unavailable degrade, cross-tab sync, cap 20, dedupe vs last committed value (`lastPushC`).

## Toast
One at a time (replacement, not stacking), 2.4s, `role=status` container persistent in `#toasts`, the system's only shadow consumer, entrance keyframe only motion.

## Banner / kbd / icons / skip-link
Per DESIGN.md Components. Icons: inline `<symbol>` sprite, 20px, stroke 1.8, `currentColor`, `aria-hidden`, paired with text or `aria-label`.
