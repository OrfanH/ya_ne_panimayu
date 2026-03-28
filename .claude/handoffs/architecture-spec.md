PASS

# TASK-021 Architecture Spec: MissionGenerator.js

## File location
`app/game/systems/MissionGenerator.js`

Pattern: IIFE module, identical structure to MistakeLogger.js. Boots after DOMContentLoaded. No DOM manipulation. No Phaser imports. Communicates only via window custom events and storage.js.

---

## 1. When does mission generation trigger?

Three trigger points, all via window event listeners:

| Event | Reason |
|---|---|
| `EVENTS.LOCATION_ENTER` | Scene transition — natural moment to check for pending missions. Player is not mid-dialogue. |
| `EVENTS.TEST_END` | `detail.passed === false` means a failed test — guaranteed to have fresh mistake data. |
| `EVENTS.DIALOGUE_END` | After any NPC conversation ends — mistakes may have just been logged by MistakeLogger. |

On each trigger: call `_checkAndGenerate()`. This is async and fire-and-forget. Never blocks the game.

Guard: skip generation if `progress.activeMission` is already set (one active mission at a time).

---

## 2. How is a mistake mapped to an NPC?

**Primary rule: use the `npcId` stored on the mistake entry.**

Every mistake entry from `getMistakeList()` already carries `{ word, npcId, location, count }`. MistakeLogger records `npcId` and `location` at the moment of the mistake. This is the canonical source.

**Fallback rule (npcId is empty string):** map by `location` using a static lookup table embedded in MissionGenerator:

```js
const LOCATION_NPC_MAP = {
  apartment: 'galina',
  park:      'artyom',
  cafe:      'lena',
  market:    'fatima',
  station:   'konstantin',
  police:    'alina',
};
```

One NPC per location is chosen as the "mission giver" for generated missions. These are the most narratively prominent NPCs per location (Galina as building anchor, Artyom as park guide, Lena as cafe host, Fatima as market lead, Konstantin as station authority, Alina as police contact). Secondary NPCs in the same location (boris, tamara, misha, styopan, nadya, sergei) can appear as mission targets but never as the giver of a generated mission.

**Selection logic in `_checkAndGenerate()`:**
1. Call `getMistakeList()` — already sorted by count descending.
2. Filter entries where `count >= 3`.
3. Filter out entries where a mission has already been generated for that word (checked via `progress.completedMissions` prefix `gen:` — see mission ID scheme below).
4. Take the first qualifying entry (highest count, not yet addressed).
5. Resolve NPC: `entry.npcId || LOCATION_NPC_MAP[entry.location] || 'galina'`.

---

## 3. What does a generated mission object look like?

Generated missions conform to the existing `data/missions.json` schema so journal.js and hud.js work without changes.

```js
{
  id:                 'gen:WORD:TIMESTAMP',   // e.g. 'gen:купить:1711620000'
  generated:          true,                   // flag to distinguish from static missions
  title:              String,                 // Russian short title, e.g. "Купить молоко"
  titleEn:            String,                 // English, e.g. "Buy milk"
  location:           String,                 // location id from mistake entry
  givenBy:            String,                 // npcId of mission giver
  type:               'conversation',         // always 'conversation' for generated missions
  objectiveEn:        String,                 // e.g. "Help Galina with her shopping list"
  storyReason:        String,                 // narrative hook line shown in journal
  requiredVocabulary: [String],               // [entry.word] — the weak word under test
  requiredGrammar:    String,                 // entry.context (grammar context from mistake)
  successCondition:   'dialogue_complete',    // detected via DIALOGUE_END from givenBy NPC
  targetNpcId:        String,                 // NPC the player must speak to (same as givenBy)
  createdAt:          String,                 // ISO timestamp
}
```

The `storyReason` field is built from a small static template table keyed by NPC. These are in-character requests, never "you got this wrong" language. See Section 5 for templates.

The mission object is stored directly into `progress.activeMission` (replacing the current string placeholder). `journal.js` already reads `progress.activeMission` — it will need a minor update to render the object's `titleEn` instead of treating the value as a plain string. That update is the implementer's concern, not this spec's scope.

---

## 4. How does it integrate with the existing dialogue system?

**No new Phaser scenes. No changes to DialogueSystem or NPC.js.**

The integration point is: when a generated mission is active (`progress.activeMission.generated === true`) and the player triggers `DIALOGUE_START` for `targetNpcId`, the dialogue system should present the vocabulary word in context.

MissionGenerator does NOT drive the dialogue content. It only:
- Sets `progress.activeMission` (the object above) via `saveProgress()`.
- Fires `EVENTS.MISSION_START` with `{ title: mission.titleEn }` so the HUD shows the mission immediately.

The implementer of the dialogue system reads `activeMission` from progress and injects `requiredVocabulary` and `requiredGrammar` into the NPC's AI system prompt context. The generated mission acts as a soft constraint on the next conversation with that NPC — the NPC will naturally use or request the weak word.

This keeps MissionGenerator single-responsibility: it reads mistakes, produces a mission object, stores it, fires one event.

---

## 5. Story reason templates (embedded in MissionGenerator)

These give the appearance that the NPC has a real reason to involve the player. Indexed by NPC id, parameterised by `word`:

```js
const STORY_REASONS = {
  galina:    (w) => `Galina has a shopping list and keeps forgetting "${w}". She wants you to practise saying it before going out.`,
  artyom:    (w) => `Artyom is helping a friend and needs to explain "${w}" — he wants to make sure he has it right.`,
  lena:      (w) => `Lena is writing a new menu item. She needs to know the right word for "${w}" before the sign goes up.`,
  fatima:    (w) => `Fatima is training a new stall assistant. She wants you to help explain what "${w}" means to a customer.`,
  konstantin:(w) => `Konstantin is filling in a form and the word "${w}" keeps coming up. He asks if you can double-check it with him.`,
  alina:     (w) => `Alina is updating the public notice board. She wants to confirm "${w}" is written correctly.`,
};
const DEFAULT_REASON = (w) => `Someone in town needs help with the word "${w}".`;
```

---

## 6. How is mission completion detected?

**Trigger: `EVENTS.DIALOGUE_END`**

When MissionGenerator receives `DIALOGUE_END`, it checks:
- Is `progress.activeMission` set and `progress.activeMission.generated === true`?
- Was the most recent dialogue with `targetNpcId`? (Track last `DIALOGUE_START` detail in module-private state: `_lastDialogueNpcId`.)

If both are true: call `_completeMission(mission)`.

`_completeMission` does:
1. `progress.completedMissions.push(mission.id)` — records completion.
2. `progress.activeMission = null` — clears active slot.
3. `saveProgress(progress)`.
4. `window.dispatchEvent(new CustomEvent(EVENTS.MISSION_COMPLETE, { detail: { id: mission.id, titleEn: mission.titleEn } }))`.

No score, no points, no streak. The mission simply closes. The HUD already listens for `MISSION_COMPLETE` via the existing event (currently wired in hud.js as an implicit no-op — the implementer adds a brief dismiss animation).

**Edge: player never goes to targetNpcId.** Mission stays active indefinitely. No expiry. No penalty. CLAUDE-VISION.md: "never intrusive."

**Edge: two qualifying mistakes exist.** Only one mission generated per trigger (highest-count word). The second will be picked up on the next trigger cycle after the first is completed.

---

## 7. New EVENTS required

None. All necessary events already exist in config.js:

- `EVENTS.LOCATION_ENTER` — trigger
- `EVENTS.TEST_END` — trigger
- `EVENTS.DIALOGUE_END` — trigger + completion detection
- `EVENTS.DIALOGUE_START` — track last NPC for completion guard
- `EVENTS.MISSION_START` — fire when mission is generated (HUD picks this up)
- `EVENTS.MISSION_COMPLETE` — fire on completion

No additions to `EVENTS` in config.js needed.

---

## 8. Module skeleton (for implementer)

```js
const MissionGenerator = (() => {
  const MISTAKE_THRESHOLD = 3;
  const LOCATION_NPC_MAP = { /* ... */ };
  const STORY_REASONS    = { /* ... */ };

  let _lastDialogueNpcId = null;

  async function _checkAndGenerate() { /* ... */ }
  async function _buildMission(entry, npcId) { /* ... */ }
  async function _completeMission(mission) { /* ... */ }

  function _onLocationEnter()  { _checkAndGenerate(); }
  function _onTestEnd(e)       { if (!e.detail?.passed) { _checkAndGenerate(); } }
  function _onDialogueStart(e) { _lastDialogueNpcId = e.detail?.npcId || null; }
  async function _onDialogueEnd() {
    await _completeMission(/* check guard */);
    // then check for new mission after a short gap:
    await _checkAndGenerate();
  }

  function init() {
    window.addEventListener(EVENTS.LOCATION_ENTER,  _onLocationEnter);
    window.addEventListener(EVENTS.TEST_END,         _onTestEnd);
    window.addEventListener(EVENTS.DIALOGUE_START,   _onDialogueStart);
    window.addEventListener(EVENTS.DIALOGUE_END,     _onDialogueEnd);
  }

  function destroy() {
    window.removeEventListener(EVENTS.LOCATION_ENTER,  _onLocationEnter);
    window.removeEventListener(EVENTS.TEST_END,         _onTestEnd);
    window.removeEventListener(EVENTS.DIALOGUE_START,   _onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_END,     _onDialogueEnd);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, destroy };
})();
```

---

## 9. Constraints confirmed

- Single new file only: `app/game/systems/MissionGenerator.js`. Placement matches existing systems.
- No DOM manipulation (CLAUDE-RULES.md: no DOM in `game/`).
- No Phaser imports or scene access.
- All storage via `storage.js` functions only (`getMistakeList`, `getProgress`, `saveProgress`).
- All cross-layer communication via window custom events only.
- `const`/`let` only, no `var`. Async/await with try/catch for all storage calls.
- One active mission at a time — never stack generated missions.
- No gamification language in story reasons or mission titles.
