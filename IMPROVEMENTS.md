# IMPROVEMENTS.md

## Current task

(empty)

## Backlog

---

### TASK-026
**title:** Critical bug fixes — vocab.join, dead code, config defaults
**track:** BUG
**status:** IN_PROGRESS
**depends_on:** []
**assigned_agents:** [fixer, reviewer, git]
**reads:** [app/tutor.js, app/config.js, app/storage.js, app/index.html, app/game/scenes/Town.js, app/game/systems/DialogueSystem.js, app/game/systems/MissionSystem.js]
**writes:** [app/tutor.js, app/config.js, app/storage.js, app/index.html]
**done_when:** (1) tutor.js _buildSystemPrompt uses vocab.map(v => v.russian).join(', ') instead of vocab.join(', '); (2) storage.js dead functions removed: markLessonComplete, getErrors, logError, getNotes, addBookmark, removeBookmark; (3) config.js DEFAULT_PROGRESS.playerPosition.scene changed from 'Town' to 'World'; (4) Town.js script tag removed from index.html; (5) DialogueSystem.js and MissionSystem.js script tags removed from index.html; (6) menu.js checkGame polling loop and unused HUD.init(game)/DialogueUI.init(game) calls removed.
**notes:** All confirmed bugs from codebase assessment. Town.js file itself can remain (git tracks it) but must not load. Dead stub files (DialogueSystem.js, MissionSystem.js) same treatment.

---

### TASK-027
**title:** Pin CDN versions and add missing fonts
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-026]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/index.html, app/tokens.css]
**writes:** [app/index.html, app/tokens.css]
**done_when:** (1) Phaser CDN pinned to specific version (e.g. phaser@3.87.0); (2) Tone.js CDN pinned to specific version (e.g. tone@14.7.77); (3) Plus Jakarta Sans and Crimson Pro loaded via Google Fonts link in index.html; (4) tokens.css font stacks reference the loaded fonts correctly.
**notes:** Check latest stable versions of Phaser 3 and Tone.js 14 before pinning. Use jsdelivr with exact version.

---

### TASK-028
**title:** Scripted fallback dialogues for Park and Cafe NPCs
**track:** CONTENT
**status:** BACKLOG
**depends_on:** [TASK-026]
**assigned_agents:** [content-writer, dialogue-writer, linguist, git]
**reads:** [app/game/content/apartment-dialogue.js, app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, .claude/curriculum-map.md, STORY.md]
**writes:** [app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js]
**done_when:** (1) park-dialogue.js has 5+ scripted variation trees for Artyom and 5+ for Tamara matching apartment-dialogue.js richness pattern; (2) cafe-dialogue.js has 5+ for Lena and 5+ for Boris; (3) All Russian is A1/A1+ appropriate; (4) Vocabulary from curriculum-map.md is woven into dialogues; (5) linguist PASS on Russian accuracy.
**notes:** Follow the exact pattern in apartment-dialogue.js — variation objects with nodes, choices, stage_direction. These serve as offline fallbacks when Gemini is unavailable and as first-visit scripted encounters.

---

### TASK-029
**title:** Scripted fallback dialogues for Market, Station, Police NPCs
**track:** CONTENT
**status:** BACKLOG
**depends_on:** [TASK-028]
**assigned_agents:** [content-writer, dialogue-writer, linguist, git]
**reads:** [app/game/content/apartment-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, .claude/curriculum-map.md, STORY.md]
**writes:** [app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js]
**done_when:** (1) market-dialogue.js has 4+ scripted variations per NPC (Fatima, Misha, Styopan); (2) station-dialogue.js has 5+ per NPC (Konstantin, Nadya); (3) police-dialogue.js has 5+ per NPC (Alina, Sergei); (4) All Russian is level-appropriate (A1+ for market, A2 for station/police); (5) linguist PASS.
**notes:** Same pattern as TASK-028. Market has 3 NPCs so slightly fewer variations per NPC is acceptable.

---

### TASK-030
**title:** Playtest — full game flow end-to-end QA
**track:** PLAYTEST
**status:** BACKLOG
**depends_on:** [TASK-026, TASK-027]
**assigned_agents:** [playtester]
**reads:** [app/index.html, app/game/scenes/WorldScene.js, app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js, app/game/scenes/TestScene.js, app/ui/dialogue.js, app/ui/hud.js, app/ui/journal.js, app/ui/onboarding.js, app/ui/settings.js, app/ui/test.js, app/ui/graduation.js, app/ui/menu.js]
**writes:** [.claude/handoffs/play-report.md]
**done_when:** Playtester produces play-report.md covering: (1) onboarding flow; (2) all 6 location entries; (3) NPC interaction in each; (4) journal open/close; (5) settings panel; (6) chapter test flow; (7) graduation trigger. Report lists all bugs found with severity.
**notes:** Code-level playtest — read source code and trace all event flows, check for missing handlers, unreachable code paths, event listener leaks. No browser needed.

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
- TASK-024 | DONE | 2026-03-29 | Scene transitions & cleanup — fade effects, fix legacy refs | 2bddef3
- TASK-022 | DONE | 2026-03-29 | Onboarding intro sequence — 4 panels, auto-walk, Galina auto-trigger | 885e8ac
- TASK-023 | DONE | 2026-03-29 | Settings menu UI — script mode, theme, volume | a180670
- TASK-025 | DONE | 2026-03-29 | Endgame graduation sequence — NPC farewells, vocab summary | 96c0552

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
- 2026-03-29 · TASK-024 Scene transitions & cleanup — fadeOut/fadeIn, fix legacy refs, remove placeholders · 2bddef3
- 2026-03-29 · TASK-022 Onboarding — 4-panel intro, auto-walk to apartment, Galina auto-dialogue · 885e8ac
- 2026-03-29 · TASK-023 Settings — script mode select, theme pills, volume slider, AudioManager.setVolume · a180670
- 2026-03-29 · TASK-025 Endgame — graduation overlay, 10 NPC farewells, vocab count, badge · 96c0552
