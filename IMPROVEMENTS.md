# IMPROVEMENTS.md

## Current task

(empty)

## Backlog

### TASK-016
**title:** Cafe location — full location, A1+ content, basic accusative introduced naturally
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-015, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/curriculum-map.md, .claude/music-spec.md]
**writes:** [app/game/scenes/CafeScene.js, app/game/content/cafe-dialogue.js, assets/maps/cafe.json]
**done_when:** Cafe fully playable, ordering introduces accusative without labelling it, park vocabulary reappears, warm cafe music distinct from park, linguist approved, ux-reviewer approved.

---

### TASK-017
**title:** Market location — quantities, colours, numbers 10-100, 3+ NPCs
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-016, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/curriculum-map.md, .claude/music-spec.md]
**writes:** [app/game/scenes/MarketScene.js, app/game/content/market-dialogue.js, assets/maps/market.json]
**done_when:** Market fully playable, 3+ distinct NPCs, cafe vocabulary reappears in new context, lively market music distinct from cafe, linguist approved, ux-reviewer approved.

---

### TASK-018
**title:** Train station — A2 content, time, directions, future tense
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-017, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/curriculum-map.md, .claude/music-spec.md]
**writes:** [app/game/scenes/StationScene.js, app/game/content/station-dialogue.js, assets/maps/station.json]
**done_when:** Station fully playable, future tense introduced through ticket buying naturally, market vocabulary reappears, transient travel-feel music, linguist approved, ux-reviewer approved.

---

### TASK-019
**title:** Police station — A2 content, formal register, past tense
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-018, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/curriculum-map.md, .claude/music-spec.md]
**writes:** [app/game/scenes/PoliceScene.js, app/game/content/police-dialogue.js, assets/maps/police.json]
**done_when:** Police station fully playable, formal register distinct from all previous locations, sparse tense music, linguist approved, ux-reviewer approved.

---

### TASK-020
**title:** Chapter test rooms — professor's apartment, one per chapter, 70%+ unlocks next
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-013]
**assigned_agents:** [architect, designer, coder, curriculum-designer, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-VISION.md, STORY.md, .claude/curriculum-map.md]
**writes:** [app/game/scenes/TestScene.js, app/ui/test.js]
**done_when:** Test room accessible after chapter, tests chapter vocabulary only, 70%+ unlocks next chapter, below 70% triggers targeted missions via MistakeLogger.

---

### TASK-021
**title:** Targeted missions — generated from MistakeLogger, delivered via existing NPCs
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-011, TASK-020, TASK-002]
**assigned_agents:** [architect, coder, content-writer, linguist, reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, app/game/systems/MistakeLogger.js, STORY.md]
**writes:** [app/game/systems/MissionGenerator.js]
**done_when:** After 3+ mistakes on a word or failed test, a targeted mission appears in journal from an existing NPC with a plausible story reason. Mission tests exactly the weak vocabulary.
**notes:** Grep STORY.md for the NPC relevant to the mission only.

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
