PASS

## Design spec: Journal UI (TASK-010)

### Layout structure

**Mobile (default):** Full-screen overlay, fixed position inset 0. Flexbox column.
- Header: flex row, space-between, border-bottom
- Tab bar: flex row, gap --space-1, border-bottom
- Content area: flex 1, overflow-y auto, padding --space-4

**Desktop (min-width: 768px):** Centered modal with inset --space-8, border-radius --radius-lg, shadow --shadow-lg.

### Components

**Journal container** (`.journal`):
- Background: var(--bg-base)
- z-index: 20
- Hidden by default, shown via `.is-open` class
- No layout shift: position fixed, not in document flow

**Header** (`.journal-header`):
- Title "Дневник" (Diary) — font-size: --text-lg, weight: --font-weight-medium, color: --text-primary
- Close button (X): 44x44px min tap target, --radius-md, icon only

**Tab bar** (`.journal-tabs`):
- Two tabs: "Словарь" (Vocabulary) and "Задания" (Missions)
- Tab: padding --space-2 --space-3, font-size --text-sm, color --text-secondary
- Active tab: background --accent-light, color --accent-text
- Hover: background --bg-hover

**Vocabulary tab content**:
- List of vocabulary cards, each card:
  - Russian word: font-size --text-md, color --text-primary, font-weight --font-weight-medium
  - Transliteration: font-size --text-sm, color --text-tertiary, italic
  - Meaning: font-size --text-base, color --text-secondary
  - Card spacing: margin-bottom --space-3
  - Divider: 0.5px solid var(--border) between cards
- Empty state: "No words yet. Talk to NPCs to learn Russian!" — centered, color --text-tertiary

**Mission tab content**:
- Active mission card: background --accent-light, border 1px --border, radius --radius-md, padding --space-3
- Completed missions: text-secondary, with checkmark prefix
- Empty state: "No missions yet." — centered, color --text-tertiary

### Token assignments

| Property | Token |
|---|---|
| Journal bg | --bg-base |
| Header border | --border |
| Tab text default | --text-secondary |
| Tab text active | --accent-text |
| Tab bg active | --accent-light |
| Tab hover | --bg-hover |
| Close button hover bg | --bg-hover |
| Close button focus | box-shadow 0 0 0 3px var(--accent-light) |
| Card word | --text-primary |
| Card meaning | --text-secondary |
| Card transliteration | --text-tertiary |
| Divider | --border |
| Empty state text | --text-tertiary |
| Desktop shadow | --shadow-lg |
| Desktop radius | --radius-lg |

### States

- **Journal closed**: display none (or hidden class)
- **Journal open**: `.is-open` class added, display flex
- **Tab default**: transparent bg, secondary text
- **Tab hover**: --bg-hover
- **Tab active/selected**: --accent-light bg, --accent-text color
- **Close button hover**: --bg-hover, --text-primary
- **Close button focus**: accent-light ring

### Transitions and animation

- Journal open: opacity 0→1, transform translateY(8px)→translateY(0), duration 200ms ease
- Journal close: opacity 1→0, transform translateY(0)→translateY(8px), duration 150ms ease
- Tab switch: no animation, instant content swap
- Close button: background transition --transition-fast

### Keyboard

- J key: toggle open/close (HUD already dispatches EVENTS.JOURNAL_OPEN)
- Escape: close journal
- Tab/Shift+Tab: navigate interactive elements within journal

### Events

- Listen: EVENTS.JOURNAL_OPEN — open journal
- Dispatch: EVENTS.JOURNAL_CLOSE — when journal closes (so game can resume)
