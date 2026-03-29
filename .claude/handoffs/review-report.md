PASS

## Review of TASK-043 — ApartmentScene.js

### Checklist: Done-When Criteria

1. **First-visit Galina greeting displays scripted text with at least one choice button** ✓
   - Lines 184–204: First-visit detection via `progress.npcRelationships.galina === undefined`
   - Lines 188–201: Dispatches DIALOGUE_START with `firstLine.russian`, `firstLine.translation`, and `firstLine.choices` from APARTMENT_DIALOGUE.VARIATIONS[0]
   - Choices present: confirmed via choices array structure (e.g., `{ id: 'a', russian: 'Извините... [номер].', ... }`)
   - Player never stuck: choice handler at lines 122–142 captures all scripted responses and routes them correctly

2. **Selecting choice advances dialogue; TutorAI takes over for all subsequent exchanges** ✓
   - Lines 122–142: `_onDialogueChoice` handler fires when `_firstVisitScripted === true`
   - Dispatches DIALOGUE_UPDATE with NPC response via `opening.lines.find((l) => l.choiceId === choiceId)`
   - After scripted opening completes (dismissal choice `isFinal: true`), `_firstVisitScripted` is set to false
   - Lines 103–114: `_onDialogueStart` blocks TutorAI during scripted mode (`!this._firstVisitScripted`), then activates it after
   - TutorAI.startConversation() enriches NPC persona with recast correction instructions (lines 107–110)

3. **Grammar error detection with recast correction** ✓
   - Lines 107–110: NPC persona explicitly augmented with recast correction directive:
     ```
     ' When the student makes a grammar error, naturally model the correct form' +
     ' in your reply without labelling it as an error (recast correction).'
     ```
   - This is baked into the system prompt sent to Gemini via TutorAI._buildSystemPrompt() (tutor.js:152–162)
   - Example provided in persona helps Gemini understand the pattern

4. **No double-fire with TASK-041 fix** ✓
   - Single-fire pattern confirmed: lines 190–202 use `delayedCall()` once per session
   - `_firstVisitScripted` flag prevents re-entry: line 105 checks `!this._firstVisitScripted` AND line 123 guards `_onDialogueChoice`
   - After scripted exchange, flag is set false (line 152), unlocking TutorAI takeover
   - No async race condition: progress fetch (line 184) completes before delayedCall fires (350ms later)

### Rule Compliance

✓ **No var** — only `const` and `let`
✓ **No console.log** — none in production code
✓ **No inline styles** — zero inline CSS
✓ **No !important** — none present
✓ **No JS frameworks** — vanilla Phaser.Scene only
✓ **Custom events only** — all communication via EVENTS (DIALOGUE_START, DIALOGUE_UPDATE, DIALOGUE_CHOICE, DIALOGUE_END)
✓ **All file paths use app/** — confirmed (lines 64, 115, 143, 159)

### Shutdown & Cleanup

✓ **Event listeners properly removed** (lines 215–218):
   - `DIALOGUE_START`: removed
   - `DIALOGUE_CHOICE`: removed
   - `DIALOGUE_END`: removed
   - No dangling listeners

### Edge Cases & Bugs

✓ **No bugs found**
- Progress fetch properly awaited before dialogue trigger
- `_firstVisitScripted` flag prevents state collision between scripted and AI modes
- Choice handler gracefully returns if response not found (line 128: `if (!response) { return; }`)
- Fallback dismissal choice always present: `{ id: 'dismiss', russian: 'Хорошо.', isFinal: true }` (line 138)

### Code Quality

- Clear separation of concerns (Phaser scene owns tutor handoff, UI owns dialogue rendering)
- Well-commented sections explain intent
- Single responsibility per listener function
- No nested promises or callback hell; uses async/await via TutorAI

**Status: Ready for merge**
