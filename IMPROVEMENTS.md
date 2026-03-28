# IMPROVEMENTS.md

## Current task

(empty)

## Backlog

### TASK-002
**title:** STORY.md and WORLD.md — full story bible and world spec
**track:** CONTENT
**status:** BACKLOG
**depends_on:** []
**assigned_agents:** [researcher, narrative-director, curriculum-designer, git]
**reads:** [CLAUDE-VISION.md, CLAUDE-AGENTS.md, VISION.md]
**writes:** [STORY.md, WORLD.md, .claude/handoffs/curriculum-map.md]
**done_when:** STORY.md defines every NPC with enough personality for 20+ interactions, WORLD.md defines 8+ visit reasons per location, curriculum-map.md maps vocabulary from location 1 through 6 with reinforcement links.
**notes:** Gates TASK-008, TASK-013 through TASK-021.

---

### TASK-003
**title:** Town map — Tiled overworld, 6 buildings, collision, locked locations visually distinct
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-001]
**assigned_agents:** [architect, designer, coder, reviewer, tester, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md]
**writes:** [src/scenes/WorldScene.js, assets/maps/town.json, assets/tilesets/]
**done_when:** Full town map visible in browser, 6 building outlines present, locked locations render differently from unlocked, collision prevents walking through walls.
**notes:** Phaser owns all of this. No HTML layer involved. Locations 2-6 start locked.

---

### TASK-004
**title:** Player sprite — 4-direction walk, camera follow, collision, scene entry zones
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-003]
**assigned_agents:** [architect, designer, coder, reviewer, tester, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, src/scenes/WorldScene.js]
**writes:** [src/entities/Player.js, src/scenes/WorldScene.js]
**done_when:** Player moves in 4 directions with animation, camera follows, collision works, entry zone fires a zone-enter custom event.
**notes:** Zone-enter is a custom event only — no direct scene coupling.

---

### TASK-005
**title:** Mobile input — virtual joystick on touch, hidden on desktop
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-004]
**assigned_agents:** [designer, coder, reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, src/entities/Player.js]
**writes:** [src/ui/VirtualJoystick.js, src/entities/Player.js]
**done_when:** Touch devices show virtual joystick controlling player movement. Desktop shows nothing. Joystick is HTML overlay, not Phaser element.

---

### TASK-006
**title:** NPC system — NPC class, one NPC in apartment, E key triggers dialogue-start event
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-003]
**assigned_agents:** [architect, coder, reviewer, tester, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, src/scenes/WorldScene.js]
**writes:** [src/entities/NPC.js, src/scenes/ApartmentScene.js]
**done_when:** One NPC in apartment, E key nearby fires dialogue-start custom event, Phaser pauses. No dialogue content — system only.

---

### TASK-007
**title:** Dialogue UI — visual novel box, portrait, Russian + translation, response options
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-006]
**assigned_agents:** [architect, designer, coder, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-VISION.md, tokens.css, src/entities/NPC.js]
**writes:** [src/ui/DialogueBox.js, src/ui/DialogueBox.css]
**done_when:** Dialogue box renders over paused Phaser with portrait, Russian line, translation, 2-3 response options. Closes on final response, resumes Phaser. Translation is togglable.
**notes:** HTML layer owns this entirely. Must work on mobile.

---

### TASK-008
**title:** AI dialogue — Gemini via api/tutor.js, NPC persona, Flash-Lite fallback on 429
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-007, TASK-002]
**assigned_agents:** [architect, coder, reviewer, tester, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, api/tutor.js, STORY.md, src/ui/DialogueBox.js]
**writes:** [api/tutor.js, src/services/AIDialogue.js]
**done_when:** DialogueBox requests AI response via api/tutor.js with NPC persona in system prompt. Flash-Lite fires on 429. Response renders correctly.
**notes:** API key in api/tutor.js only. NPC persona injected server-side. Grep STORY.md for the specific NPC — do not load full file.

---

### TASK-009
**title:** HUD — location name, active mission indicator, J key opens journal
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-004]
**assigned_agents:** [designer, coder, reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-VISION.md, tokens.css]
**writes:** [src/ui/HUD.js, src/ui/HUD.css]
**done_when:** HUD shows location name top-left, active mission top-right, J opens journal. All values via tokens.css. Location name updates via custom event.

---

### TASK-010
**title:** Journal UI — notebook style, vocabulary tab, mission log tab, closes cleanly
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-009]
**assigned_agents:** [designer, coder, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-VISION.md, tokens.css, src/ui/HUD.js]
**writes:** [src/ui/Journal.js, src/ui/Journal.css]
**done_when:** Journal opens on J, shows two tabs, vocabulary lists Russian + translations, closes with J or X, no layout shift.
**notes:** Journal reads from KV via storage.js only.

---

### TASK-011
**title:** Mistake logging — silent capture, stored to KV, retrievable for missions
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-008]
**assigned_agents:** [architect, coder, reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, src/services/AIDialogue.js, src/services/storage.js]
**writes:** [src/services/MistakeLogger.js, src/services/storage.js]
**done_when:** Wrong response stores (word, context, correct answer) silently to KV. Retrievable as list. No player feedback at mistake time.

---

### TASK-012
**title:** Audio system — Tone.js, AudioManager, per-location music, mute toggle
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-003, TASK-002]
**assigned_agents:** [composer, coder, reviewer, tester, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, src/scenes/WorldScene.js]
**writes:** [src/services/AudioManager.js, .claude/music-spec.md]
**done_when:** Tone.js loads with no errors, AudioManager starts ambient music on scene load, crossfades between locations, pauses on dialogue open, resumes on dialogue close, mute toggle works. No audio files — synthesis only.
**notes:** composer writes .claude/music-spec.md first. coder implements from spec only. Grep STORY.md for location mood notes only.

---

### TASK-013
**title:** First location complete — apartment fully playable end to end with audio
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-008, TASK-010, TASK-011, TASK-012]
**assigned_agents:** [ux-reviewer, tester]
**reads:** [CLAUDE-VISION.md, STORY.md, src/scenes/ApartmentScene.js, src/ui/DialogueBox.js, src/services/AudioManager.js]
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
**reads:** [CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/handoffs/curriculum-map.md]
**writes:** [src/content/apartment-dialogue.js, .claude/handoffs/content-spec.md]
**done_when:** Apartment NPC has scripted opening beats, 8+ distinct visit variations, curriculum vocabulary appears naturally, linguist approved, ux-reviewer confirms it feels like a real conversation.
**notes:** Grep STORY.md and WORLD.md for apartment section only.

---

### TASK-015
**title:** Park location — map, NPC, dialogue, music, unlock from apartment
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-013, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/handoffs/curriculum-map.md, .claude/music-spec.md]
**writes:** [src/scenes/ParkScene.js, src/content/park-dialogue.js, assets/maps/park.json]
**done_when:** Park unlocks after apartment story beat, NPC has full dialogue with reused apartment vocabulary in new context, park music distinct from apartment, linguist approved, ux-reviewer approved.
**notes:** Unlock must have a story reason from STORY.md — never a grammar reason.

---

### TASK-016
**title:** Cafe location — full location, A1+ content, basic accusative introduced naturally
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-015, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/handoffs/curriculum-map.md, .claude/music-spec.md]
**writes:** [src/scenes/CafeScene.js, src/content/cafe-dialogue.js, assets/maps/cafe.json]
**done_when:** Cafe fully playable, ordering introduces accusative without labelling it, park vocabulary reappears, warm cafe music distinct from park, linguist approved, ux-reviewer approved.

---

### TASK-017
**title:** Market location — quantities, colours, numbers 10-100, 3+ NPCs
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-016, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/handoffs/curriculum-map.md, .claude/music-spec.md]
**writes:** [src/scenes/MarketScene.js, src/content/market-dialogue.js, assets/maps/market.json]
**done_when:** Market fully playable, 3+ distinct NPCs, cafe vocabulary reappears in new context, lively market music distinct from cafe, linguist approved, ux-reviewer approved.

---

### TASK-018
**title:** Train station — A2 content, time, directions, future tense
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-017, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/handoffs/curriculum-map.md, .claude/music-spec.md]
**writes:** [src/scenes/StationScene.js, src/content/station-dialogue.js, assets/maps/station.json]
**done_when:** Station fully playable, future tense introduced through ticket buying naturally, market vocabulary reappears, transient travel-feel music, linguist approved, ux-reviewer approved.

---

### TASK-019
**title:** Police station — A2 content, formal register, past tense
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-018, TASK-002, TASK-012]
**assigned_agents:** [architect, designer, composer, coder, curriculum-designer, content-writer, dialogue-writer, linguist, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, CLAUDE-VISION.md, STORY.md, WORLD.md, .claude/handoffs/curriculum-map.md, .claude/music-spec.md]
**writes:** [src/scenes/PoliceScene.js, src/content/police-dialogue.js, assets/maps/police.json]
**done_when:** Police station fully playable, formal register distinct from all previous locations, sparse tense music, linguist approved, ux-reviewer approved.

---

### TASK-020
**title:** Chapter test rooms — professor's apartment, one per chapter, 70%+ unlocks next
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-013]
**assigned_agents:** [architect, designer, coder, curriculum-designer, reviewer, ux-reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-VISION.md, STORY.md, .claude/handoffs/curriculum-map.md]
**writes:** [src/scenes/TestScene.js, src/ui/TestUI.js]
**done_when:** Test room accessible after chapter, tests chapter vocabulary only, 70%+ unlocks next chapter, below 70% triggers targeted missions via MistakeLogger.

---

### TASK-021
**title:** Targeted missions — generated from MistakeLogger, delivered via existing NPCs
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-011, TASK-020, TASK-002]
**assigned_agents:** [architect, coder, content-writer, linguist, reviewer, git]
**reads:** [CLAUDE-RULES.md, CLAUDE-STACK.md, src/services/MistakeLogger.js, STORY.md]
**writes:** [src/services/MissionGenerator.js]
**done_when:** After 3+ mistakes on a word or failed test, a targeted mission appears in journal from an existing NPC with a plausible story reason. Mission tests exactly the weak vocabulary.
**notes:** Grep STORY.md for the NPC relevant to the mission only.

## Blocked

(empty)

## Done

- TASK-001 | DONE | 2026-03-28 | Project scaffold — Phaser boots, tokens.css loads, Vercel deploys | 39badb6

## Session log

- 2026-03-28 · Infrastructure setup — scoped CLAUDE files, backlog schema, token rules · 2797d6d
- 2026-03-28 · Project scaffold · 39badb6
