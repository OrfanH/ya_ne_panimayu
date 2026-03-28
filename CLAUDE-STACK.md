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
    scenes/          <- Boot, Town, Apartment, Park, Cafe, Market, Station, Police
    entities/        <- Player.js, NPC.js
    systems/         <- DialogueSystem, MissionSystem, ProgressSystem
  ui/
    dialogue.js, journal.js, hud.js, menu.js, testroom.js
api/
  tutor.js           <- Vercel serverless function, Gemini proxy
assets/
  maps/, sprites/, portraits/, ui/
data/
  npcs.json, missions.json, vocabulary.json, progress.json, mistakes.json
prompts/
  npc-core.txt, npc-confused.txt, npc-tutor.txt, test-feedback.txt
```

## Data schemas

### NPC definition (data/npcs.json)

Fields: `id`, `name`, `nameEn`, `location`, `portrait`, `sprite`, `position`, `persona`, `tutorVocabulary`, `dialogue[]` (each with `id`, `type` scripted|ai, `trigger`, `nodes[]` or `context`)

### Mission definition (data/missions.json)

Fields: `id`, `title`, `titleEn`, `location`, `givenBy`, `unlockCondition`, `type` (conversation|fetch|delivery|translation), `objectiveEn`, `requiredVocabulary[]`, `requiredGrammar`, `successCondition`, `onSuccess{}`, `onFail{}`

### Progress (data/progress.json)

Fields: `chapter`, `unlockedLocations[]`, `completedMissions[]`, `activeMission`, `testScores{}`, `npcRelationships{}`, `lastSession`, `playerPosition{}`

### Mistakes (data/mistakes.json)

Fields: `patterns[]` each with `grammarPoint`, `count`, `threshold`, `lastSeen`, `triggeredMission`, `examples[]`

## Keyboard shortcuts

| Key | Action |
|---|---|
| WASD / Arrow keys | Player movement |
| E | Interact with NPC |
| J | Open/close journal |
| Escape | Close active overlay / pause |
| Enter | Advance dialogue / submit response |
