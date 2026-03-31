# CLAUDE-STACK.md — Technical stack reference

Read this file when you make any technical or architectural decision.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Game engine | Phaser.js 3 via CDN | World, movement, maps, sprites |
| UI layer | HTML + CSS + Vanilla JS | Dialogue, journal, HUD, menus |
| AI | Gemini 2.5 Flash | NPC dialogue, feedback. Fallback: Flash-Lite on 429 |
| Backend | Vercel serverless Node.js | api/tutor.js — AI proxy only |
| Storage | Vercel KV | Save state, journal, progress, mistakes |
| Audio | Tone.js via CDN | Synthesis only, no audio files |
| Hosting | Vercel | Auto-deploy from GitHub on push |
| Repo | GitHub private | Auto-deploy on push to main |

## Phaser CDN

```html
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
```

`Phaser.Scale.FIT` with `autoCenter` — canvas fills viewport on all screen sizes.

## Gemini API

- Primary: `gemini-2.5-flash`
- Fallback: `gemini-2.5-flash-lite` on 429
- Never use Pro on the free tier
- API key in `.env` as `GEMINI_API_KEY`, accessed only in `api/tutor.js`

### Proxy route — `api/tutor.js`

- Receives: `{ messages: [], systemPrompt: "", model: "" }`
- Injects API key server-side
- Returns: Gemini response text
- 429 -> `{ error: "rate_limit" }`
- Other errors -> `{ error: "api_error", message: "" }`

### Rate limit handling (frontend `tutor.js`)

1. On `rate_limit`: NPC pauses ("Wait...")
2. Wait 3 seconds
3. Retry once with Flash-Lite
4. If still fails: scripted error fallback from NPC
5. Never break the game because the AI API is down

## Directory structure

```
app/
  index.html         <- entry point
  style.css          <- all UI styles, mobile-first
  tokens.css         <- design tokens only
  config.js          <- all constants, model names, game config
  tutor.js           <- Gemini API calls from frontend
  storage.js         <- all Vercel KV reads and writes
  game/
    main.js          <- Phaser game config and scene registry
    scenes/          <- Boot, WorldScene, Apartment, Park, Cafe, Market, Station, Police, Test
    entities/        <- Player.js, NPC.js
    systems/         <- AudioManager, MistakeLogger, MissionGenerator, StoryMissions, MapBuilder
    content/         <- *-dialogue.js — NPC data, vocab, scripted dialogue per location
  ui/
    dialogue.js, journal.js, hud.js, menu.js, settings.js, test.js, onboarding.js, graduation.js, VirtualJoystick.js
api/
  tutor.js           <- Vercel serverless function, Gemini proxy
assets/
  tilesets/, fonts/, ui/
data/
  progress.json      <- default seed only; runtime data lives in Vercel KV / localStorage
prompts/
  npc-core.txt, npc-confused.txt, npc-tutor.txt, test-feedback.txt, etc.
```

**Note on data/*.json:** The original architecture planned for NPC, mission, and vocabulary data to live in JSON files loaded at runtime. In practice, all NPC data, dialogue, and vocabulary are embedded directly in `app/game/content/*-dialogue.js`. Story missions are defined in `app/game/systems/StoryMissions.js`. Practice missions are generated dynamically by `MissionGenerator.js`. The JSON files in `data/` (npcs.json, missions.json, vocabulary.json, mistakes.json, errors.json) are empty stubs from the original design and are **not loaded by any code**. Do not build loaders for them — use the embedded JS data.

**Note on dead files:** `Town.js` is deprecated (superseded by WorldScene). `DialogueSystem.js` and `MissionSystem.js` are 1-line stubs pointing to actual implementations. None are loaded at runtime.

## Data schemas (runtime, via storage.js)

### Progress (Vercel KV key: 'progress')

Fields: `chapter`, `unlockedLocations[]`, `completedMissions[]`, `activeMission`, `testScores{}`, `npcRelationships{}`, `lastSession`, `hasSeenIntro`, `hasSeenGraduation`, `playerPosition{}`

### Vocabulary (Vercel KV key: 'vocabulary')

Fields: `words[]` each with `cyrillic`, `transliteration`, `meaning`, `gender`, `lessonId` (location ID), `seenAt`, `exampleCyrillic`, `exampleMeaning`

### Mistakes (Vercel KV key: 'mistakes')

Fields: `entries[]` each with `word`, `context`, `correctAnswer`, `npcId`, `location`, `count`, `lastSeen`

## Keyboard shortcuts

| Key | Action |
|---|---|
| WASD / Arrow keys | Player movement |
| E | Interact with NPC |
| J | Open/close journal |
| Escape | Close active overlay / pause |
| Enter | Advance dialogue / submit response |
