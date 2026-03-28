# IMPROVEMENTS.md

## Current task

(empty)

## Backlog

---

### TASK-032
**title:** MissionSystem — accept, track, complete missions with HUD integration
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-031]
**assigned_agents:** [architect, coder, reviewer, tester, git]
**reads:** [app/game/systems/MissionSystem.js, app/game/systems/MissionGenerator.js, app/ui/hud.js, app/ui/journal.js, app/storage.js, app/config.js, data/missions.json]
**writes:** [app/game/systems/MissionSystem.js, app/ui/hud.js, app/ui/journal.js, app/config.js]
**done_when:** (1) MissionSystem accepts missions from NPCs via dialogue events. (2) Active mission displayed in HUD with objective text. (3) Mission completion conditions checked: vocabulary used, conversation had, item delivered. (4) On completion: reward applied, HUD updated, next mission unlockable. (5) Mission state persisted to KV. (6) Journal missions tab shows active + completed missions. (7) MissionGenerator targeted missions integrate with this system.
**notes:** MissionGenerator already creates missions from mistakes — this task makes them playable. Missions drive location unlocks per CLAUDE-VISION.

---

### TASK-033
**title:** Progress dashboard — learning summary in journal
**track:** BUILD
**status:** BACKLOG
**depends_on:** []
**assigned_agents:** [designer, coder, reviewer, git]
**reads:** [app/ui/journal.js, app/storage.js, app/style.css, app/tokens.css, app/config.js]
**writes:** [app/ui/journal.js, app/style.css]
**done_when:** (1) New "Progress" tab in journal alongside Vocabulary and Missions. (2) Shows: words learned count, locations unlocked, missions completed, chapter progress. (3) Per-location breakdown: vocab learned vs total for that location. (4) Visual indicators — simple bars or counts, no gamification. (5) Data pulled from storage.js. (6) Feels like a student checking their own notebook, not a leaderboard.
**notes:** Per CLAUDE-VISION: "Progress feels like a life being built, not a score being chased." No points, no streaks. Just honest tracking.

---

### TASK-034
**title:** Sound effects — UI and interaction sounds via Tone.js synthesis
**track:** BUILD
**status:** BACKLOG
**depends_on:** []
**assigned_agents:** [composer, coder, reviewer, git]
**reads:** [app/game/systems/AudioManager.js, app/ui/dialogue.js, app/ui/journal.js, app/ui/hud.js, app/config.js, .claude/music-spec.md]
**writes:** [app/game/systems/AudioManager.js, app/config.js]
**done_when:** (1) Dialogue text reveal has typewriter tick sound. (2) Choice selection has soft click. (3) Journal open/close has page-turn sound. (4) Mission complete has gentle chime. (5) Location unlock has discovery sound. (6) All sounds are Tone.js synthesized — no audio files. (7) Sounds respect mute toggle and volume setting.
**notes:** Keep sounds subtle and warm. Not arcade bleeps. Think Stardew Valley gentle audio feedback. Composer writes spec, coder implements.

---

### TASK-035
**title:** NPC relationship memory — dialogue reflects past interactions
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-031]
**assigned_agents:** [architect, content-writer, coder, reviewer, git]
**reads:** [app/game/systems/DialogueSystem.js, app/game/content/apartment-dialogue.js, app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, app/storage.js, app/config.js, app/tutor.js]
**writes:** [app/game/systems/DialogueSystem.js, app/game/content/apartment-dialogue.js, app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, app/config.js]
**done_when:** (1) NPC relationship level tracked in KV (strangers → acquaintance → friend). (2) Dialogue selection uses relationship level — NPCs greet returning players differently. (3) Visit count per NPC tracked. (4) AI dialogue context includes relationship history summary. (5) At least 3 relationship tiers per NPC with distinct greeting/tone shifts.
**notes:** Per CLAUDE-VISION: "NPCs remember the player — dialogue reflects relationship history." This makes the world feel alive. Content-writer adds relationship-aware dialogue variations.

---

### TASK-IMPROVE-001
**title:** Agent skill improvement — create evals for existing skills, create skills from pipeline patterns
**track:** IMPROVE
**status:** RECURRING
**depends_on:** []
**assigned_agents:** [orchestrator]
**reads:** [.claude/skills/, .claude/agents/, .claude/handoffs/]
**writes:** [.claude/skills/]
**done_when:** Run /improve after every 3 completed BUILD tasks. Each run: (1) review last 3 task outputs for repeated patterns, (2) create or update at least 1 skill, (3) all skill evals pass at 100%.
**notes:** This is a recurring meta-task, not a one-time backlog item. The orchestrator should trigger /improve automatically after TASK-006, TASK-009, TASK-012, TASK-015, TASK-018, TASK-021. Any agent can also request /improve mid-task if they identify an improvement opportunity.

## Blocked

(empty)

## Done

- TASK-001 | DONE | 2026-03-28 | Project scaffold — Phaser boots, tokens.css loads, Vercel deploys | 39badb6
- TASK-002 | DONE | 2026-03-28 | STORY.md, WORLD.md, curriculum-map — full story bible and world spec | 27f3716
- TASK-003 | DONE | 2026-03-28 | Town map — WorldScene, 6 buildings, collision, locked locations | 261f7d0
- TASK-004 | DONE | 2026-03-28 | Player sprite — 4-direction walk, camera follow, collision, zone-enter | d5ed718
- TASK-005 | DONE | 2026-03-28 | Mobile input — virtual joystick on touch, hidden on desktop | d6c3ac2
- TASK-006 | DONE | 2026-03-28 | NPC system — NPC class, apartment scene, E key dialogue-start | 29573ea
- TASK-007 | DONE | 2026-03-28 | Dialogue UI — visual novel box, portrait, Russian + translation, choices | b6e2d8a
- TASK-008 | DONE | 2026-03-28 | AI dialogue — TutorAI, Gemini, Flash-Lite fallback | 34bfe2a
- TASK-009 | DONE | 2026-03-28 | HUD — location name, mission indicator, journal hint | 5657146
- TASK-012 | DONE | 2026-03-28 | Audio — Tone.js, 6 location soundscapes, mute toggle | 9b1176c
- TASK-014 | DONE | 2026-03-28 | NPC dialogue — Galina Ivanovna, 10 variations, A1 Russian | bf2cea1
- TASK-010 | DONE | 2026-03-28 | Journal UI — vocabulary tab, mission tab, J/X/Escape close | a440047
- TASK-011 | DONE | 2026-03-28 | Mistake logging — silent KV capture, retrievable list | a440047
- TASK-013 | DONE | 2026-03-28 | First location complete — apartment end-to-end with audio | 885a426
- TASK-015 | DONE | 2026-03-28 | Park — ParkScene, Artyom + Tamara, unlock from apartment | a0ddf24
- TASK-016 | DONE | 2026-03-28 | Cafe — CafeScene, Lena + Boris, ordering vocab, A1+ | 484d69a
- TASK-017 | DONE | 2026-03-28 | Market — MarketScene, Fatima + Misha + Styopan, 3 NPCs | 33d9987
- TASK-018 | DONE | 2026-03-28 | Train Station — StationScene, Konstantin + Nadya, A2 time/future | 05ea5c7
- TASK-019 | DONE | 2026-03-28 | Police Station — PoliceScene, Alina + Sergei, past tense/formal | 05ea5c7
- TASK-020 | DONE | 2026-03-28 | Chapter test rooms — professor's apartment quiz, 70%+ unlock | c539348
- TASK-021 | DONE | 2026-03-28 | Targeted missions — MistakeLogger-driven, NPC story hooks | 107ea83
- TASK-030 | DONE | 2026-03-29 | Main Menu — title screen with New Game / Continue | 4ea55c1
- TASK-031 | DONE | 2026-03-29 | DialogueSystem — branching dialogue, choice handling, NPC state | 43e3dfb

## Session log

- 2026-03-28 · Agent files — 17 agents created/overwritten for RPG system · faafffe
- 2026-03-28 · Infrastructure setup — scoped CLAUDE files, backlog schema, token rules · 2797d6d
- 2026-03-28 · Project scaffold · 39badb6
- 2026-03-28 · TASK-002 STORY.md + WORLD.md + curriculum-map via narrative-director + curriculum-designer · 27f3716
- 2026-03-28 · TASK-003 WorldScene — 6 buildings, collision, locked locations via architect + designer + coder · 261f7d0
- 2026-03-28 · TASK-004 Player class — 4-direction textures, zone-enter event via architect + designer + coder · d5ed718
- 2026-03-28 · TASK-005 Virtual joystick — touch overlay, custom events, Player.js integration via designer + coder · d6c3ac2
- 2026-03-28 · TASK-006 NPC system — NPC class, ApartmentScene, E key interaction via architect + coder · 29573ea
- 2026-03-28 · TASK-007 Dialogue UI — visual novel box, slide-in animation, translation toggle via architect + designer + coder · b6e2d8a
- 2026-03-28 · TASK-008 AI dialogue — TutorAI client, NPC persona, Gemini Flash + Flash-Lite fallback · 34bfe2a
- 2026-03-28 · TASK-009 HUD — location name, mission indicator, J key journal hint · 5657146
- 2026-03-28 · TASK-012 Audio — Tone.js AudioManager, 6 location soundscapes, mute toggle, dialogue ducking · 9b1176c
- 2026-03-28 · TASK-014 NPC dialogue — Galina Ivanovna apartment content, 10 variations, A1 curriculum vocab · bf2cea1
- 2026-03-28 · TASK-010 Journal UI — vocabulary + mission tabs, storage.js reads, notebook CSS · a440047
- 2026-03-28 · TASK-011 MistakeLogger — silent mistake:log event capture to KV · a440047
- 2026-03-28 · TASK-013 First location sign-off — Galina NPC wired, TutorAI init, integration fix · 885a426
- 2026-03-28 · TASK-015 Park — ParkScene with Artyom + Tamara NPCs, directions/colors vocab, unlock after apartment · a0ddf24
- 2026-03-28 · TASK-016 Cafe — CafeScene with Lena + Boris NPCs, ordering/prices vocab, unlock chain · 484d69a
- 2026-03-28 · TASK-017 Market — MarketScene with 3 vendor NPCs, quantities/haggling vocab · 33d9987
- 2026-03-28 · TASK-018+019 Station + Police — all 6 locations complete, full unlock chain · 05ea5c7
- 2026-03-28 · TASK-020 Chapter test rooms — TestScene + TestUI, 4 chapters, vocab quiz, unlock logic · c539348
- 2026-03-28 · TASK-021 Targeted missions — MissionGenerator.js, mistake→NPC mapping, story reasons · 107ea83
- 2026-03-29 · TASK-030 Main Menu — title screen overlay, New Game / Continue, Boot.js event bridge · 4ea55c1
- 2026-03-29 · TASK-031 DialogueSystem — variation selection, choice branching, KV persistence, AI NPC support · 43e3dfb
