PASS

## Design spec: TASK-020 — Test UI Overlay

### Layout structure

The test overlay (`#test-overlay`) sits inside `#ui-overlay` and spans the full viewport. It is hidden by default and revealed by adding `is-active`.

- Outer container: full-width, full-height flex column, centered horizontally, aligned to start vertically on mobile (scrollable if content overflows)
- Inner card: centered column, max-width 480px, fills width on mobile with horizontal padding --space-5 (20px)
- Card has top padding --space-8 (32px), bottom padding --space-6 (24px)
- Card background: --bg-surface, radius --radius-md, shadow --shadow-md
- On mobile: card is flush to viewport sides (no gap left/right), radius applies only on desktop (min-width 768px)
- On desktop (min-width 768px): card floats centered with horizontal auto margins, vertical margin --space-8 from top

---

**Question phase layout (top to bottom):**

1. Progress row — single line, right-aligned
2. Russian word block — centered, prominent
3. Answer buttons column — 4 buttons stacked, full width, gap --space-3 (12px) between each

**Result phase layout (top to bottom):**

1. Score block — centered, large
2. Outcome text — centered, one line
3. Continue button — full width

---

### Token assignments

**Overlay backdrop**
- Background: --bg-base at 90% opacity (semi-transparent so world peeks through — student notebook feel, not a hard block)
- No blur. Flat, calm layer.

**Inner card**
- Background: --bg-surface
- Border: 1px solid --border
- Radius: --radius-md
- Shadow: --shadow-md

**Progress indicator (e.g. "3 / 10")**
- Font size: --text-sm (13px)
- Font weight: --font-weight-regular
- Color: --text-tertiary
- Alignment: right within the card header row
- Margin bottom: --space-4 (16px)

**Russian word (question prompt)**
- Font family: --font-family-prose (notebook feel for Cyrillic)
- Font size: --text-xl (20px)
- Font weight: --font-weight-medium
- Color: --text-primary
- Text align: center
- Padding vertical: --space-6 (24px) top and bottom
- Background: none (inherits card surface)

**Answer buttons (4 stacked)**
- Width: 100% of card
- Min height: 48px (satisfies 44px touch target rule with 2px headroom, matches dialogue-choice rule)
- Padding: --space-3 (12px) vertical, --space-4 (16px) horizontal
- Font family: --font-family-ui
- Font size: --text-base (15px)
- Font weight: --font-weight-regular
- Color: --text-primary
- Background: --bg-subtle
- Border: 1px solid --border
- Radius: --radius-sm
- Text align: left (natural reading for English meanings)
- Gap between buttons: --space-3 (12px)

**Answer button — correct state (after selection)**
- Background: --success-light
- Border color: --success
- Color: --text-primary (keep legible)

**Answer button — incorrect state (after wrong selection)**
- Background: --error-light
- Border color: --error
- Color: --text-primary

**Answer button — disabled (after any selection, non-chosen options)**
- Color: --text-disabled
- Background: --bg-subtle
- Border color: --border
- Cursor: not-allowed (via disabled attribute, no extra token needed)

**Score display ("7 / 10")**
- Font family: --font-family-prose
- Font size: --text-xl (20px)
- Font weight: --font-weight-medium
- Color: --text-primary
- Text align: center
- Margin bottom: --space-3 (12px)

**Outcome text (passed / not passed)**
- Font family: --font-family-ui
- Font size: --text-base (15px)
- Font weight: --font-weight-regular
- Color: --text-secondary
- Text align: center
- Margin bottom: --space-6 (24px)

**Continue button**
- Width: 100%
- Min height: 48px
- Padding: --space-3 (12px) vertical, --space-4 (16px) horizontal
- Font family: --font-family-ui
- Font size: --text-base (15px)
- Font weight: --font-weight-medium
- Color: --accent-text
- Background: --accent
- Border: none (accent fill is the affordance)
- Radius: --radius-sm
- Text align: center

---

### States

**Answer button**
- Default: --bg-subtle fill, --border border, --text-primary text
- Hover (pointer device only): --bg-hover fill, --border-strong border
- Focus: --border-focus border (2px outline offset 2px — visible keyboard focus ring)
- Active (tap/click): --bg-active fill
- Correct (post-answer): --success-light fill, --success border
- Incorrect (post-answer): --error-light fill, --error border
- Disabled (post-answer, non-selected): --bg-subtle fill, --border border, --text-disabled text, pointer events none

**Continue button**
- Default: --accent fill, --accent-text text
- Hover: --accent-hover fill
- Focus: --border-focus outline ring (2px, offset 2px)
- Active: --accent-hover fill (same as hover — touch devices share this)
- Disabled: not applicable (button only shown when result is ready)

**Overlay container**
- Default (not active): display none or visibility hidden (controlled by `is-active` class toggle)
- Active: displayed, fade in via opacity transition

---

### Transitions and animation

- Overlay appear: opacity 0 to 1, duration --transition-phase (200ms), easing ease-out
  Apply on `.is-active` class addition via CSS transition on the overlay element.

- Answer button hover/active fill change: background-color transition, duration --transition-fast (150ms), easing ease-out

- Answer button correct/incorrect reveal: background-color and border-color transition, duration --transition-phase (200ms), easing ease-out
  Both fire simultaneously when the result class is toggled on the button.

- Continue button hover: background-color transition, duration --transition-fast (150ms), easing ease-out

- Phase switch (question -> result): no slide or wipe animation. Swap display states instantly (or with a single --transition-phase opacity cross-fade if the coder wraps each phase in its own container). Keeping it flat honors the notebook feel — no game-show theatrics.

---

### Notes for the coder

- The overlay uses `is-active` class on `#test-overlay` — no inline style toggling.
- All button result states (correct/incorrect/disabled) are applied via class names on the button elements, not inline styles.
- The progress indicator ("3 / 10") and score ("7 / 10") use the same slash-separated fraction format — no stars, bars, or icons.
- Outcome text is plain prose: e.g. "Passed" or "Not passed" — one line, no decoration.
- No icons anywhere in this component.
- Font weight --font-weight-semibold (600) is listed in available tokens but CLAUDE-RULES.md restricts typography to weights 400 and 500 only — do not use 600.
