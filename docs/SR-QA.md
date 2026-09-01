# TempConv — Screen-reader QA checklists

Run each with the app at http://127.0.0.1:8000/. Status: checklists authored; execution
deferred to human QA (same note as QA.md).

## NVDA + Firefox (Windows)
- [ ] Landmarks dialog: banner / main / contentinfo, region names "Convert" "Reference" "History"
- [ ] Tab into °C field: "Celsius, edit" → typing: values silent (correct) → Tab away with error: "Enter a number, like 20." spoken once
- [ ] Tab to Copy: "Copy all values, button, dimmed" when empty; enabled after valid input
- [ ] Seg: "Rounded precision, radio group" → "2 decimals, radio button, checked, 3 of 4"
- [ ] Table browse mode: header cells repeat per row; current row cell announces via aria-current (Firefox: "current")
- [ ] Toast: "Copied" interrupts politely, not aggressively
- [ ] History: "Restore 68 °F to °C, button" reads full label; delete announce "Delete … from history, button"

## VoiceOver (macOS + Safari)
- [ ] Same flows; verify quick-nav V for table announces caption with decimal count
- [ ] rotor: form controls list shows 4 fields with unit names, no stray "group" entries
- [ ] Pressing Escape in field: value cleared, no double announcements

## JAWS (Chrome)
- [ ] Alt shortcuts don't collide (Alt keys released → browser menus intact)
- [ ] Invalid entry: field gets "invalid entry" state; error text read in virtual cursor

## TalkBack (Android)
- [ ] Touch exploration order top-to-bottom; 44px targets announce as buttons; "Show °R, unchecked checkbox-like chip" reads as toggle button with "selected" state
- [ ] Horizontal swipe through table: row-by-row; footnote read last

## Keyboard-only (no SR)
- [ ] Tab-only pass reaches every control incl. delete buttons via focus (no hover) and table/history scroll regions; Enter/Space activate; visible focus never lost
