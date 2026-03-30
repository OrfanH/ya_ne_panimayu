# IMPROVEMENTS.md

## Current task

(empty)

---

## Knowledge Base
- [4e0810e] REFERENCE-GAMEDESIGN.md, REFERENCE-PIXELART.md, REFERENCE-DIALOGUE.md added

---

## Backlog

---

---


### TASK-045
**title:** Event listener audit ? scene shutdown cleanup + Player.destroy()
**track:** FAST
**status:** IN_PROGRESS
**depends_on:** [TASK-038]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/entities/Player.js, app/game/entities/NPC.js, app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js, app/game/scenes/TestScene.js, app/game/scenes/WorldScene.js]
**writes:** [app/game/entities/Player.js, app/game/scenes/TestScene.js, app/game/scenes/WorldScene.js]
**done_when:**
- `Player.js` has a `destroy()` method that calls `window.removeEventListener` for `joystick:move` and `joystick:stop` using stored bound references
- All interior scenes call `this.player.destroy()` in their `shutdown()` method
- `TestScene.shutdown()` removes `TEST_END` and `TEST_DISMISS` event listeners
- `WorldScene` ZONE_ENTER listener is removed on scene shutdown
- After 5 round-trip World ? ApartmentScene transitions, no duplicate event handlers exist
**notes:** Bind listener functions once in create() as `this._onJoystickMove = (...) => {...}` and reuse the same reference in removeEventListener. Anonymous arrow functions cannot be removed.

---

### TASK-046
**title:** Scene transition guard ? prevent double-enter race condition
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-045]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/scenes/WorldScene.js]
**writes:** [app/game/scenes/WorldScene.js]
**done_when:**
- `WorldScene._transitionTo()` sets a boolean lock (`_transitioning = true`) on first call
- Subsequent `_transitionTo()` calls while `_transitioning` is true are silently ignored
- Lock is reset in `WorldScene.shutdown()` (guards against edge cases)
- Multiple overlapping zone collisions do not queue multiple scene transitions
**notes:** Single-file change. Zone overlap is the most common trigger ? player standing at a building entrance while walking can fire 2-3 ZONE_ENTER events in one frame.

---

### TASK-047
**title:** NPC relationship tiers ? stranger / acquaintance / friend dialogue switching
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-041, TASK-045]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/entities/NPC.js, app/game/content/apartment-dialogue.js, app/storage.js, app/config.js]
**writes:** [app/game/entities/NPC.js, app/game/content/apartment-dialogue.js]
**done_when:**
- `NPC.js` reads `npcRelationships[npcId]` from storage to determine tier: 0 = stranger, 1 = acquaintance, 2 = friend
- Relationship score increments by 1 after each completed dialogue (DIALOGUE_END fires)
- Score thresholds: 0 = stranger, 1?2 = acquaintance, 3+ = friend
- `TutorAI.startConversation()` receives the current tier as context so the system prompt adjusts formality (?? vs ??) per REFERENCE-DIALOGUE.md ?1
- Galina's `apartment-dialogue.js` scripted fallbacks have at least two tier-tagged variants per NPC interaction to demonstrate the system working
**notes:** Per REFERENCE-DIALOGUE.md: strangers use ?? and formal address; acquaintances switch to ?? and use the player's name; friends ask questions about the player's life. The tier must be passed to TutorAI so AI-generated responses also respect it.

---

### TASK-048
**title:** Wire MissionGenerator ? trigger from dialogue, update HUD + Journal
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-041, TASK-045]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/systems/MissionGenerator.js, app/game/systems/MistakeLogger.js, app/ui/hud.js, app/ui/journal.js, app/storage.js]
**writes:** [app/game/systems/MissionGenerator.js, app/ui/hud.js, app/ui/journal.js]
**done_when:**
- `MissionGenerator.checkAndGenerate()` is called after every `DIALOGUE_END` event
- If a new mission is generated, `#hud-mission` text updates immediately with the mission title
- Journal missions tab re-renders active + completed missions when opened (reads from storage)
- Completed missions display with a visual completion indicator (strikethrough or checkmark)
- Empty state: missions tab shows "??? ???????" when no missions exist
**notes:** MissionGenerator reads from MistakeLogger ? ensure MistakeLogger has at least one logged mistake before testing, otherwise no mission will generate.

---

---

### TASK-050
**title:** Daily NPC conversation limit ? one rich exchange per day, then short farewell
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-047]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/entities/NPC.js, app/game/systems/TutorAI.js, app/storage.js, app/config.js]
**writes:** [app/game/entities/NPC.js, app/game/systems/TutorAI.js]
**done_when:**
- Storage tracks `lastTalkedDate[npcId]` ? the in-game or real-world date of the last completed conversation
- If player interacts with an NPC they already spoke to today, NPC gives a short contextual farewell line ("?? ??????!" / "See you tomorrow!") and dialogue closes after one beat ? no full AI conversation
- System prompt sent to TutorAI includes a `alreadySpokenToday: true` flag when applicable, allowing AI to give a brief response naturally
- Per REFERENCE-GAMEDESIGN.md ?1: after one rich conversation, NPC gives "see you tomorrow" ? scarcity makes choices feel meaningful
**notes:** "Today" can be defined as the same UTC calendar day, or as a session-based flag if simpler. Start with session-based (reset on page load) then upgrade to date-based.

---

### TASK-051
**title:** NPC interaction indicator ? proximity E-key / tap-zone visual
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-045]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/entities/NPC.js, app/game/entities/Player.js, app/style.css, app/tokens.css]
**writes:** [app/game/entities/NPC.js, app/style.css]
**done_when:**
- When player enters NPC interaction range, a small pixel-art prompt appears above the NPC sprite ("E" on desktop, tap icon on mobile)
- Prompt disappears when player moves out of range or dialogue opens
- Indicator uses pixel font (`--font-hud`) and stone/dark palette matching the game aesthetic
- Works correctly for all NPCs across all scenes
**notes:** Per REFERENCE-GAMEDESIGN.md: the player must know what they can interact with. The indicator should be subtle ? not a floating exclamation mark, but a small keyboard hint. Use a Phaser Text object positioned above the NPC sprite, visible only in the interaction zone.

---

### TASK-052
**title:** Mobile dialogue UX ? tap to advance, viewport fit, 48px touch targets
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-042]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/ui/dialogue.js, app/style.css, app/tokens.css]
**writes:** [app/ui/dialogue.js, app/style.css]
**done_when:**
- Tapping anywhere on the dialogue text area advances to the next beat (no dedicated "next" button needed)
- Choice buttons are minimum 48px height and full-width on mobile (375px)
- Dialogue panel does not overflow or require horizontal scroll on 375px viewport
- Tap-to-advance does not accidentally trigger NPC interaction again (event propagation handled correctly)
**notes:** Tap-to-advance must be guarded: only fire when dialogue is OPEN state (from TASK-041 state machine). Use a single `click` listener on the dialogue text container, not on the whole window.

---

### TASK-053
**title:** Dialogue API fallback chain ? scripted ? AI ? graceful error message
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-041]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/systems/TutorAI.js, app/ui/dialogue.js, app/config.js, app/game/content/apartment-dialogue.js]
**writes:** [app/game/systems/TutorAI.js, app/ui/dialogue.js]
**done_when:**
- If Gemini primary + fallback both fail, TutorAI returns a scripted line from the NPC's location dialogue file (not a generic error string)
- Player can continue the conversation using scripted fallback ? no freeze, no empty box
- A subtle in-dialogue indicator shows when AI is unavailable (e.g., a small "(offline)" label near NPC name) ? not a disruptive toast
- On API recovery (next interaction), AI mode resumes automatically
**notes:** Current behaviour: silently returns "????????, ? ?????? ?????" with no recovery path. Fix: on API failure, flag TutorAI._offline = true, route subsequent calls through the scripted dialogue arrays, clear flag on next successful API call.

---

### TASK-054
**title:** TestScene lifecycle fix ? shutdown cleanup and clean retry flow
**track:** FAST
**status:** BACKLOG
**depends_on:** [TASK-045]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/scenes/TestScene.js]
**writes:** [app/game/scenes/TestScene.js]
**done_when:**
- `TestScene.shutdown()` removes all `window.addEventListener` calls registered during `create()` (TEST_END, TEST_DISMISS, and any others)
- Player can exit a test and re-enter it without duplicate event handlers accumulating
- Test retry (after failing) works correctly ? score resets, questions reload, no stale state
- If test is passed, return to WorldScene with correct unlock state
**notes:** Mirrors TASK-045 pattern. Store bound listener references in this._onTestEnd etc. during create(), remove them in shutdown().

---

### TASK-055
**title:** Loading states + API error toast — boot progress bar, non-blocking error feedback
**track:** FAST
**status:** IN_PROGRESS
**depends_on:** [TASK-038]
**assigned_agents:** [coder, reviewer, git]
**reads:** [app/game/scenes/Boot.js, app/ui/hud.js, app/game/systems/TutorAI.js, app/index.html, app/style.css]
**writes:** [app/game/scenes/Boot.js, app/ui/hud.js, app/style.css]
**done_when:**
- Boot scene displays a pixel-art progress bar while assets load (Phaser `on('progress')` callback)
- When TutorAI API fails (after both retries), a non-blocking toast notification appears for 3 seconds then auto-dismisses
- Toast uses `--font-hud`, stone palette, matches game aesthetic ? does not block game interaction
- No raw JS errors visible in browser console during a normal play session
**notes:** Boot progress bar: use Phaser's built-in progress event (`this.load.on('progress', ...)`) to draw a bar in Boot scene graphics. Toast: a single `<div id="hud-toast">` injected into index.html, shown/hidden via CSS class, auto-hidden after 3s via setTimeout.

---

### TASK-040
**title:** Full playtest ? end-to-end game loop verification
**track:** BUILD
**status:** BACKLOG
**depends_on:** [TASK-041, TASK-042, TASK-043, TASK-044, TASK-045, TASK-052, TASK-051, TASK-055]
**assigned_agents:** [playtester]
**reads:** [app/index.html, all scene and UI files]
**writes:** [.claude/handoffs/play-report.md]
**done_when:** Playtester completes a full new-player run: onboarding ? apartment ? park ? cafe ? market ? station ? police ? chapter tests ? graduation. play-report.md filed with: (1) any broken interactions, (2) any empty or missing UI, (3) any Russian text errors visible in-game, (4) audio issues, (5) lock/unlock chain verified correct. PASS if no critical blockers found.
**notes:** Test on both desktop keyboard and simulated mobile (375px viewport). Verify dialogue box, journal, HUD, settings all display correctly with the new Kenney fonts and pixel skin.

---

### TASK-IMPROVE-001
**title:** Agent skill improvement ? create evals for existing skills, create skills from pipeline patterns
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

- TASK-001 | DONE | 2026-03-28 | Project scaffold ? Phaser boots, tokens.css loads, Vercel deploys | 39badb6
- TASK-002 | DONE | 2026-03-28 | STORY.md, WORLD.md, curriculum-map ? full story bible and world spec | 27f3716
- TASK-003 | DONE | 2026-03-28 | Town map ? WorldScene, 6 buildings, collision, locked locations | 261f7d0
- TASK-004 | DONE | 2026-03-28 | Player sprite ? 4-direction walk, camera follow, collision, zone-enter | d5ed718
- TASK-005 | DONE | 2026-03-28 | Mobile input ? virtual joystick on touch, hidden on desktop | d6c3ac2
- TASK-006 | DONE | 2026-03-28 | NPC system ? NPC class, apartment scene, E key dialogue-start | 29573ea
- TASK-007 | DONE | 2026-03-28 | Dialogue UI ? visual novel box, portrait, Russian + translation, choices | b6e2d8a
- TASK-008 | DONE | 2026-03-28 | AI dialogue ? TutorAI, Gemini, Flash-Lite fallback | 34bfe2a
- TASK-009 | DONE | 2026-03-28 | HUD ? location name, mission indicator, journal hint | 5657146
- TASK-012 | DONE | 2026-03-28 | Audio ? Tone.js, 6 location soundscapes, mute toggle | 9b1176c
- TASK-014 | DONE | 2026-03-28 | NPC dialogue ? Galina Ivanovna, 10 variations, A1 Russian | bf2cea1
- TASK-010 | DONE | 2026-03-28 | Journal UI ? vocabulary tab, mission tab, J/X/Escape close | a440047
- TASK-011 | DONE | 2026-03-28 | Mistake logging ? silent KV capture, retrievable list | a440047
- TASK-013 | DONE | 2026-03-28 | First location complete ? apartment end-to-end with audio | 885a426
- TASK-015 | DONE | 2026-03-28 | Park ? ParkScene, Artyom + Tamara, unlock from apartment | a0ddf24
- TASK-016 | DONE | 2026-03-28 | Cafe ? CafeScene, Lena + Boris, ordering vocab, A1+ | 484d69a
- TASK-017 | DONE | 2026-03-28 | Market ? MarketScene, Fatima + Misha + Styopan, 3 NPCs | 33d9987
- TASK-018 | DONE | 2026-03-28 | Train Station ? StationScene, Konstantin + Nadya, A2 time/future | 05ea5c7
- TASK-019 | DONE | 2026-03-28 | Police Station ? PoliceScene, Alina + Sergei, past tense/formal | 05ea5c7
- TASK-020 | DONE | 2026-03-28 | Chapter test rooms ? professor's apartment quiz, 70%+ unlock | c539348
- TASK-021 | DONE | 2026-03-28 | Targeted missions ? MistakeLogger-driven, NPC story hooks | 107ea83
- TASK-024 | DONE | 2026-03-29 | Scene transitions & cleanup ? fade effects, fix legacy refs | 2bddef3
- TASK-022 | DONE | 2026-03-29 | Onboarding intro sequence ? 4 panels, auto-walk, Galina auto-trigger | 885e8ac
- TASK-023 | DONE | 2026-03-29 | Settings menu UI ? script mode, theme, volume | a180670
- TASK-025 | DONE | 2026-03-29 | Endgame graduation sequence ? NPC farewells, vocab summary | 96c0552
- TASK-026 | DONE | 2026-03-29 | Bug fixes ? vocab.join, dead code, config defaults | 0fb4151
- TASK-027 | DONE | 2026-03-29 | CDN versions pinned (Phaser 3.87.0, Tone.js 14.7.77) + fonts | 5bfe24b
- TASK-028 | DONE | 2026-03-29 | Park + Cafe scripted fallback dialogues ? 12 variations each | c235ac7
- TASK-029 | DONE | 2026-03-29 | Market + Station + Police scripted fallback dialogues ? 35 variations | 5c908ef
- TASK-030 | DONE | 2026-03-29 | Settings visibility, dialogue reset loop, WorldScene event bus fixes | 9f9c155
- TASK-031 | DONE | 2026-03-29 | Test bail UX, localStorage fallback, DOM cleanup | 4c3c624
- TASK-032 | DONE | 2026-03-29 | Session close ? NPC.js portrait path + dialogue.js onerror stash | 4c3c624
- TASK-033 | DONE | 2026-03-29 | Kenney asset extraction ? tilesets, fonts, UI pack into project | 07f1126
- TASK-039 | DONE | 2026-03-29 | NPC overworld sprites ? roguelike-characters composable layers | 2798039
- TASK-034 | DONE | 2026-03-29 | Overworld map ? roguelike-city tiles for ground, paths, buildings | e3a1a2d
- TASK-036 | DONE | 2026-03-29 | Kenney Pixel + Mini fonts ? replace all monospace/Google Fonts | e9977eb
- TASK-035 | DONE | 2026-03-29 | Interior rooms ? roguelike-indoors tiles for all 6 scenes | 4fd7582
- TASK-037 | DONE | 2026-03-29 | Dialogue UI pixel stone skin ? dark panel, pixel borders, Kenney fonts | 1de63f2
- TASK-038 | DONE | 2026-03-29 | HUD + Journal + Settings pixel stone skin ? consistent aesthetic | 0893c1a
- TASK-041 | DONE | 2026-03-30 | Dialogue system fix ? state machine, single-fire, no race condition | b781759
- TASK-043 | DONE | 2026-03-30 | First-visit flow ? scripted greeting ? AI handoff with recast correction | e889552
- TASK-042 | DONE | 2026-03-30 | Dialogue CSS fix ? CSS tokens, portrait .has-portrait, min-height | 658740a
- TASK-044 | DONE | 2026-03-30 | AudioManager LOCATION_ENTER fix + #hud-mute wiring | 3f94d36
- TASK-049 | DONE | 2026-03-30 | Vocabulary logging — dialogue choices feed Journal vocab tab | 7922795

## Session log

- 2026-03-28 ? Agent files ? 17 agents created/overwritten for RPG system ? faafffe
- 2026-03-28 ? Infrastructure setup ? scoped CLAUDE files, backlog schema, token rules ? 2797d6d
- 2026-03-28 ? Project scaffold ? 39badb6
- 2026-03-28 ? TASK-002 STORY.md + WORLD.md + curriculum-map via narrative-director + curriculum-designer ? 27f3716
- 2026-03-28 ? TASK-003 WorldScene ? 6 buildings, collision, locked locations via architect + designer + coder ? 261f7d0
- 2026-03-28 ? TASK-004 Player class ? 4-direction textures, zone-enter event via architect + designer + coder ? d5ed718
- 2026-03-28 ? TASK-005 Virtual joystick ? touch overlay, custom events, Player.js integration via designer + coder ? d6c3ac2
- 2026-03-28 ? TASK-006 NPC system ? NPC class, ApartmentScene, E key interaction via architect + coder ? 29573ea
- 2026-03-28 ? TASK-007 Dialogue UI ? visual novel box, slide-in animation, translation toggle via architect + designer + coder ? b6e2d8a
- 2026-03-28 ? TASK-008 AI dialogue ? TutorAI client, NPC persona, Gemini Flash + Flash-Lite fallback ? 34bfe2a
- 2026-03-28 ? TASK-009 HUD ? location name, mission indicator, J key journal hint ? 5657146
- 2026-03-28 ? TASK-012 Audio ? Tone.js AudioManager, 6 location soundscapes, mute toggle, dialogue ducking ? 9b1176c
- 2026-03-28 ? TASK-014 NPC dialogue ? Galina Ivanovna apartment content, 10 variations, A1 curriculum vocab ? bf2cea1
- 2026-03-28 ? TASK-010 Journal UI ? vocabulary + mission tabs, storage.js reads, notebook CSS ? a440047
- 2026-03-28 ? TASK-011 MistakeLogger ? silent mistake:log event capture to KV ? a440047
- 2026-03-28 ? TASK-013 First location sign-off ? Galina NPC wired, TutorAI init, integration fix ? 885a426
- 2026-03-28 ? TASK-015 Park ? ParkScene with Artyom + Tamara NPCs, directions/colors vocab, unlock after apartment ? a0ddf24
- 2026-03-28 ? TASK-016 Cafe ? CafeScene with Lena + Boris NPCs, ordering/prices vocab, unlock chain ? 484d69a
- 2026-03-28 ? TASK-017 Market ? MarketScene with 3 vendor NPCs, quantities/haggling vocab ? 33d9987
- 2026-03-28 ? TASK-018+019 Station + Police ? all 6 locations complete, full unlock chain ? 05ea5c7
- 2026-03-28 ? TASK-020 Chapter test rooms ? TestScene + TestUI, 4 chapters, vocab quiz, unlock logic ? c539348
- 2026-03-28 ? TASK-021 Targeted missions ? MissionGenerator.js, mistake?NPC mapping, story reasons ? 107ea83
- 2026-03-29 ? TASK-024 Scene transitions & cleanup ? fadeOut/fadeIn, fix legacy refs, remove placeholders ? 2bddef3
- 2026-03-29 ? TASK-022 Onboarding ? 4-panel intro, auto-walk to apartment, Galina auto-dialogue ? 885e8ac
- 2026-03-29 ? TASK-023 Settings ? script mode select, theme pills, volume slider, AudioManager.setVolume ? a180670
- 2026-03-29 ? TASK-025 Endgame ? graduation overlay, 10 NPC farewells, vocab count, badge ? 96c0552
- 2026-03-29 ? TASK-026?032 bug fixes, CDN, all dialogues, playtest fixes ? 4c3c624
- 2026-03-29 ? Art stack finalised ? 6 Kenney CC0 packs, visual tasks TASK-033 through TASK-040 generated
- 2026-03-29 ? TASK-033 Kenney asset extraction ? 6 assets extracted from zips, Boot.js preloads, @font-face added ? 07f1126
- 2026-03-29 ? TASK-039 NPC sprites ? composable layers from roguelike-characters sheet, all 13 NPCs distinct ? 2798039
- 2026-03-29 ? TASK-034 Overworld tiles ? CITY_TILES constant, city spritesheet for ground/paths/6 buildings ? e3a1a2d
- 2026-03-29 ? TASK-036 Kenney fonts ? Pixel/Mini tokens, image-rendering:pixelated, all system fonts removed ? e9977eb
- 2026-03-29 ? TASK-038 HUD + Journal + Settings pixel stone skin ? consistent stone aesthetic via coder ? 0893c1a
- 2026-03-30 ? TASK-041 Dialogue system fix ? state machine (CLOSED/OPENING/OPEN/CLOSING), single-fire NPC events, DIALOGUE_UPDATE replaces double DIALOGUE_START ? b781759
- 2026-03-30 ? TASK-043 First-visit scripted greeting with choices + TutorAI handoff + recast correction ? e889552
- 2026-03-30 ? TASK-042 Dialogue CSS ? --dialogue-height + --choice-min-height tokens, portrait .has-portrait visibility ? 658740a
- TASK-044 | DONE | 2026-03-30 | AudioManager LOCATION_ENTER fix + #hud-mute wiring | 3f94d36
- 2026-03-30 · TASK-044 AudioManager LOCATION_ENTER name?id map, #hud-mute wired to toggleMute · 3f94d36
- 2026-03-30 · TASK-049 Vocabulary logging — dialogue vocab collection + Journal render with dedup/frequency · 7922795
