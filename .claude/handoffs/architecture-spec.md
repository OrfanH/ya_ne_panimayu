PASS

# TASK-020 Architecture Spec — Chapter Test Rooms

## Files to create or modify

| File | Action |
|---|---|
| `app/game/scenes/TestScene.js` | CREATE — Phaser scene, professor's apartment room |
| `app/ui/test.js` | CREATE — HTML overlay, question rendering and scoring |
| `app/config.js` | MODIFY — add 4 new EVENTS entries |

---

## New EVENTS to add to config.js

```js
TEST_START:    'test:start',
TEST_END:      'test:end',
TEST_RESULT:   'test:result',
TEST_DISMISS:  'test:dismiss',
```

- `TEST_START` — Phaser fires when player interacts with professor NPC; detail: `{ chapter: Number }`
- `TEST_END` — HTML fires when the player submits the final answer; detail: `{ chapter, score, total, passed }`
- `TEST_RESULT` — HTML fires after score is saved; detail: `{ chapter, passed, unlockedChapter? }`
- `TEST_DISMISS` — HTML fires when player closes the result summary; no detail

---

## TestScene.js — Phaser scene

**Scene key:** `'Test'`

**Room layout:** identical visual approach to ApartmentScene — graphics-drawn floor/walls using `GAME_CONFIG.TILE_SIZE`. Dimensions: 12 cols × 9 rows. Professor NPC placed at tile (8, 4). Player spawns at tile (2, 4).

**Scene data (passed via `this.scene.start('Test', data)`):**
```js
{
  chapter: Number   // 1–4, determines which vocabulary set to test
}
```

**`create()` setup phases** (numbered comment blocks):
1. Draw floor and wall border (graphics, same palette as ApartmentScene)
2. Player — `new Player(this, spawnX, spawnY, T)` with `setCollideWorldBounds(true)`
3. Professor NPC — `new NPC(this, npcX, npcY, { id: 'professor', name: 'Профессор', tileSize: T })`
4. World bounds — `this.physics.world.setBounds(0, 0, roomW, roomH)`
5. Camera — `setBounds`, `startFollow` with `GAME_CONFIG.CAMERA_LERP`, `fadeIn(300)`
6. Input — `this._eKey`, `this._cursors`, `this._wasd` (exact ApartmentScene names)
7. Event listeners — store as `this._onTestEnd` and `this._onTestDismiss`
8. Location enter event — dispatch `EVENTS.LOCATION_ENTER` with `{ name: "Professor's Apartment" }`

**`update()`:**
- `this._player.update(this._cursors, this._wasd)`
- `this._npc.checkInteraction(px, py, Phaser.Input.Keyboard.JustDown(this._eKey))`
- On interaction: `this.physics.pause()` then dispatch `EVENTS.TEST_START` with `{ chapter: this._chapter }`
- Guard: do not re-fire if `this._testActive === true`

**`shutdown()`:**
- `window.removeEventListener(EVENTS.TEST_END, this._onTestEnd)`
- `window.removeEventListener(EVENTS.TEST_DISMISS, this._onTestDismiss)`

**Private state:** `this._chapter`, `this._testActive` (boolean guard)

**`_onTestEnd` handler** (listening to `EVENTS.TEST_END`):
- Reads `e.detail.passed` — does NOT apply unlock logic here; that lives in `test.js`
- Sets `this._testActive = false`

**`_onTestDismiss` handler** (listening to `EVENTS.TEST_DISMISS`):
- Calls `this.physics.resume()`
- Calls `this.scene.start('Town')` to return player to world

---

## test.js — HTML overlay

**Pattern:** IIFE module, same structure as `dialogue.js` and `hud.js`.

**DOM:** Single `#test-overlay` div appended to `#ui-overlay`. Hidden by default via CSS class. Shown by adding class `is-active`. No inline styles.

**Internal state:**
```js
const _state = {
  active: false,
  chapter: 0,
  questions: [],       // WordQuestion[]
  currentIndex: 0,
  correctCount: 0,
  phase: 'question',   // 'question' | 'result'
};
```

**WordQuestion shape:**
```js
{
  cyrillic: String,     // the word being tested
  meaning: String,      // correct English answer
  distractors: String[] // 3 wrong meanings from same chapter vocab
}
```

**Question generation — `_buildQuestions(chapter)`:**
- Calls `getVocabulary()` (from `storage.js`)
- Filters words by `lessonId` matching chapter (see chapter-to-location mapping below)
- Selects up to 10 words; if fewer than 4 words available, uses all
- For each selected word: picks 3 distractors randomly from remaining chapter words (or cross-chapter if chapter pool is small)
- Shuffles the 4-option array (correct + 3 distractors)
- Returns `WordQuestion[]`

**Chapter-to-location mapping (internal constant, not exported):**
```js
const CHAPTER_LOCATIONS = {
  1: ['apartment'],
  2: ['park'],
  3: ['cafe', 'market'],
  4: ['station', 'police'],
};
```

`lessonId` on vocabulary words follows the pattern `locationId` (e.g. `'apartment'`, `'park'`). Filter words where `CHAPTER_LOCATIONS[chapter].includes(word.lessonId)`.

**`_renderQuestion()`:** Renders `_state.questions[_state.currentIndex]`. Shows the Cyrillic word; renders 4 buttons with English meanings. Each button: min 44×44px touch target per CLAUDE-RULES.md. No correct/incorrect reveal animation — just advance immediately on tap.

**Answer handling — `_onAnswer(selectedMeaning)`:**
- Compares to `_state.questions[_state.currentIndex].meaning`
- If correct: `_state.correctCount++`
- If wrong: calls `logMistake(cyrillic, 'test', correctMeaning, 'professor', 'test')` (from `storage.js`)
- Advance `_state.currentIndex`; if last question, call `_showResult()`; else `_renderQuestion()`

**`_showResult()`:**
- Calculates `score = _state.correctCount / _state.questions.length`
- `passed = score >= 0.7`
- Calls `_saveScore(chapter, score, passed)` (async, wrapped in try/catch)
- Sets `_state.phase = 'result'`
- Renders result panel: shows fraction (e.g. "7 / 10") and one-line outcome text
- No points display, no streaks, no stars — vision rule
- Shows single "Continue" button
- Dispatches `EVENTS.TEST_END` with `{ chapter, score, total: questions.length, passed }`

**`_saveScore(chapter, score, passed)` (async):**
- `const progress = await getProgress()`
- `progress.testScores[chapter] = { score, passed, date: new Date().toISOString() }`
- If `passed` and next chapter exists: add next chapter's locations to `progress.unlockedLocations`
- Next chapter unlock map: `{ 1: ['park'], 2: ['cafe','market'], 3: ['station','police'], 4: [] }`
- `await saveProgress(progress)`
- Dispatches `EVENTS.TEST_RESULT` with `{ chapter, passed, unlockedChapter: nextChapter || null }`

**"Continue" button handler:**
- Calls `_close()`
- Dispatches `EVENTS.TEST_DISMISS`

**`_close()`:** Removes `is-active` class from `#test-overlay`, resets `_state`.

**`_onTestStart(e)` listener:** Reads `e.detail.chapter`, builds questions, resets state, renders first question, adds `is-active`.

**Init:** Registers `window.addEventListener(EVENTS.TEST_START, _onTestStart)` once on DOMContentLoaded. No teardown needed (module lives for page lifetime).

---

## What Phaser owns vs HTML layer owns

| Concern | Owner |
|---|---|
| Room rendering (floor, walls, NPC, player) | Phaser — TestScene.js |
| Player movement and interaction detection | Phaser — TestScene.js |
| Physics pause/resume | Phaser — TestScene.js |
| Scene transition back to Town | Phaser — TestScene.js |
| Question set construction | HTML — test.js |
| Answer buttons and scoring | HTML — test.js |
| Progress save and chapter unlock | HTML — test.js (via storage.js) |
| MistakeLogger calls | HTML — test.js (via storage.js `logMistake`) |
| Result display | HTML — test.js |

---

## What is explicitly ruled out

- **No score display with points or stars** — CLAUDE-VISION.md forbids gamification elements
- **No blocking modal** — overlay is non-blocking (player physics is paused by scene, not by a modal lock); result is shown inline in the overlay
- **No correct/wrong flash animations on answers** — keeps the UI neutral and avoids gamification feel; advance silently
- **No retry button on the result screen** — failed players return to Town where targeted missions spawn via MistakeLogger; retry loop is a gamification pattern
- **No separate ProfessorNPC entity class** — reuses existing `NPC` class with `id: 'professor'`; a bespoke class would duplicate code with no architectural benefit
- **No chapter gating inside TestScene** — the scene accepts any chapter number via scene data; gating (whether the scene is accessible) is the Town scene's responsibility, not TestScene's
- **No vocabulary fetch inside TestScene** — all storage access stays in the HTML layer (`test.js`); Phaser scenes must not call storage directly per separation-of-concerns rule
