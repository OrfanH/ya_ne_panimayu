# IMPROVEMENTS.md

## Current task

(empty)

## Backlog

### TASK-008
**title:** AI dialogue — Gemini via api/tutor.js, NPC persona, Flash-Lite fallback on 429
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-007, TASK-002]
**assigned_agents:** [architect, coder, reviewer, tester, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, api/tutor.js, STORY.md, app/ui/dialogue.js]
**writes:** [api/tutor.js, app/tutor.js]
**done_when:** DialogueBox requests AI response via api/tutor.js with NPC persona in system prompt. Flash-Lite fires on 429. Response renders correctly.
**notes:** api/tutor.js is already implemented — read it first, only modify if architect spec identifies a specific gap. NPC persona is constructed client-side in app/tutor.js (by design — see CLAUDE-STACK.md). Grep STORY.md for the specific NPC — do not load full file.

---

### TASK-009
**title:** HUD — location name, active mission indicator, J key opens journal
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-004]
**assigned_agents:** [designer, coder, reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-VISION.md, app/tokens.css]
**writes:** [app/ui/hud.js, app/style.css]
**done_when:** HUD shows location name top-left, active mission top-right, J opens journal. All values via tokens.css. Location name updates via custom event.

---

### TASK-010
**title:** Journal UI — notebook style, vocabulary tab, mission log tab, closes cleanly
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-009]
**assigned_agents:** [designer, coder, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-VISION.md, app/tokens.css, app/ui/hud.js]
**writes:** [app/ui/journal.js, app/style.css]
**done_when:** Journal opens on J, shows two tabs, vocabulary lists Russian + translations, closes with J or X, no layout shift.
**notes:** Journal reads from KV via storage.js only.

---

### TASK-011
**title:** Mistake logging — silent capture, stored to KV, retrievable for missions
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-008]
**assigned_agents:** [architect, coder, reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, app/tutor.js, app/storage.js]
**writes:** [app/game/systems/MistakeLogger.js, app/storage.js]
**done_when:** Wrong response stores (word, context, correct answer) silently to KV. Retrievable as list. No player feedback at mistake time.

---

### TASK-012
**title:** Audio system — Tone.js, AudioManager, per-location music, mute toggle
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-003, TASK-002]
**assigned_agents:** [composer, coder, reviewer, tester, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, app/game/scenes/WorldScene.js]
**writes:** [app/game/systems/AudioManager.js, .claude/music-spec.md]
**done_when:** Tone.js loads with no errors, AudioManager starts ambient music on scene load, crossfades between locations, pauses on dialogue open, resumes on dialogue close, mute toggle works. No audio files — synthesis only.
**notes:** composer writes .claude/music-spec.md first. coder implements from spec only. Grep STORY.md for location mood notes only.

---

### TASK-013
**title:** First location complete — apartment fully playable end to end with audio
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-008, TASK-010, TASK-011, TASK-012]
**assigned_agents:** [ux-reviewer, tester]
**reads:** [CLAUDE-VISION.md, STORY.md, app/game/scenes/ApartmentScene.js, app/ui/dialogue.js, app/game/systems/AudioManager.js]
**writes:** [.claude/handoffs/ux-report.md]
**done_when:** New player enters apartment, meets NPC, completes full AI conversation in Russian, vocabulary logs to journal, ambient music plays throughout, no dead ends. ux-reviewer approves.
**notes:** Sign-off task only. No new code written here.

---

### TASK-014
**title:** NPC dialogue — apartment, full content from STORY.md
**track:** CONTENT
**status:** BACKLOG
**depends_on:** [TASK-002, TASK-007]
**assigned_agents:** [curriculum-designer, content-writer, dialogue-writer, linguist, ux-reviewer, git]
**reads:** [CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/curriculum-map.md]
**writes:** [app/game/content/apartment-dialogue.js, .claude/handoffs/content-spec.md]
**done_when:** Apartment NPC has scripted opening beats, 8+ distinct visit variations, curriculum vocabulary appears naturally, linguist approved, ux-reviewer confirms it feels like a real conversation.
**notes:** Grep STORY.md and WORLD.md for apartment section only.

---

### TASK-015
**title:** Park location — map, NPC, dialogue, music, unlock from apartment
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-013, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/curriculum-map.md, .claude/music-spec.md]
**writes:** [app/game/scenes/ParkScene.js, app/game/content/park-dialogue.js, assets/maps/park.json]
**done_when:** Park unlocks after apartment story beat, NPC has full dialogue with reused apartment vocabulary in new context, park music distinct from apartment, linguist approved, ux-reviewer approved.
**notes:** Unlock must have a story reason from STORY.md — never a grammar reason.

---

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
