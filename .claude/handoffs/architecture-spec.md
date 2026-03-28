PASS

## Architecture spec: Mistake Logger (TASK-011)

### Files to create/modify

1. **`app/game/systems/MistakeLogger.js`** — new file, singleton module
2. **`app/storage.js`** — add `getMistakes()` and `logMistake()` functions
3. **`app/config.js`** — add `MISTAKE_LOG` event to EVENTS

### New event

Add to `EVENTS` in config.js:
```
MISTAKE_LOG: 'mistake:log'
```

Any system that detects a mistake dispatches this event with detail:
```
{ word, context, correctAnswer, npcId, location }
```

### Data structure (KV, key: STORAGE_KEYS.MISTAKES)

```json
{
  "entries": [
    {
      "word": "привет",
      "context": "greeting at apartment",
      "correctAnswer": "Привет! (Hello!)",
      "npcId": "galina",
      "location": "apartment",
      "count": 2,
      "lastSeen": "2026-03-28T12:00:00Z"
    }
  ]
}
```

### storage.js additions

- `getMistakes()` — returns `{ entries: [] }` from KV key `STORAGE_KEYS.MISTAKES`
- `logMistake(word, context, correctAnswer, npcId, location)` — upserts entry: if word+context exists, increment count and update lastSeen. Otherwise push new entry with count: 1.
- `getMistakeList()` — returns entries sorted by count descending (most-missed first)

### MistakeLogger.js design

Singleton IIFE module (same pattern as TutorAI):

```
const MistakeLogger = (() => {
  function init() — registers listener on EVENTS.MISTAKE_LOG
  function _onMistakeEvent(e) — extracts detail, calls logMistake() from storage.js
  function destroy() — removes listener
  return { init, destroy }
})();
```

- Listens for `EVENTS.MISTAKE_LOG` on window
- Calls `logMistake()` from storage.js — fire and forget (no await blocking)
- No DOM manipulation — this is a pure data system
- No player feedback at mistake time — completely silent

### How mistakes are detected

The TutorAI module (or future dialogue system) dispatches `mistake:log` when:
1. AI response indicates the player made an error (future: parse AI response for correction markers)
2. For now: the event is available for any system to dispatch. The logger just records whatever it receives.

### What Phaser owns vs HTML layer

- MistakeLogger is a **game system** (under `game/systems/`) but does NO DOM work
- It only listens to window events and writes to storage.js
- HTML layer (journal) will read mistakes via `getMistakes()` for display

### Ruled out

- **AI-powered mistake detection**: Too complex for this task. Detection is the caller's responsibility.
- **Real-time feedback**: Spec says "no player feedback at mistake time"
- **localStorage fallback**: All storage via KV only per CLAUDE-STACK.md
- **Modifying existing getErrors/logError**: Those use a different schema (grammarPoint-based). Mistake logging uses word+context-based schema. Keep both.
