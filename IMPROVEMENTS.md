# IMPROVEMENTS.md

## Current task

BUG-003 — NPC interaction indicator stays visible (next ready task)

---

## Knowledge Base
- [4e0810e] REFERENCE-GAMEDESIGN.md, REFERENCE-PIXELART.md, REFERENCE-DIALOGUE.md added

---

## Backlog

---

### P0 — Playability gate
*Nothing in P1 or P2 ships until TASK-040 passes. The game must be verified playable end-to-end. Any BUG tasks filed by TASK-040 become P0 blockers.*

---

### BUG-001
**title:** City tileset frame indices wrong — ground tiles and park building invisible
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/scenes/WorldScene.js]
**writes:** [app/game/scenes/WorldScene.js]
**done_when:** No "Texture has no frame" warnings for city frames 888/889/925/962. World scene ground tiles render as visible grass. Park building walls and door render correctly. Valid frame indices confirmed against roguelike-city.png (34 cols × 26 rows, max index 883).
**notes:** Found by playtester. The CITY_TILES constants use frame indices based on a 37-column formula (N = row × 37 + col) but roguelike-city.png is 34 columns wide (592px / 17px per cell). grass_a=888, grass_b=962, park.wall=925, park.door=889 all exceed the 883 maximum valid index. The intended grass tile at row 24 col 0 in a 34-col sheet is frame 816 (24 × 34). The park wall/door frames also need recalculating. See play-report.md for full analysis.

---

### BUG-002
**title:** Duplicate #hud-mute elements — HUD mute button empty and unresponsive
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/systems/AudioManager.js, app/ui/hud.js]
**writes:** [app/ui/hud.js]
**done_when:** Exactly one #hud-mute element exists in the DOM. The mute button inside the HUD bar has SVG icons and correctly toggles audio mute on click.
**notes:** Found by playtester. AudioManager.js loads before ui/hud.js in index.html. AudioManager._buildMuteBtn() runs on DOMContentLoaded, finds no existing #hud-mute, and creates one appended to #ui-overlay. Then hud.js _buildDOM() creates a second empty #hud-mute inside #hud. The HUD-visible button is the empty one; AudioManager wires the other one. Fix: remove the _muteBtn element from hud.js _buildDOM() — AudioManager already handles creation and wiring. See play-report.md.

---

### BUG-003
**title:** NPC interaction indicator stays visible when dialogue is open
**track:** BUG
**status:** READY
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/game/entities/NPC.js]
**writes:** [app/game/entities/NPC.js]
**done_when:** The `[E]` hint above an NPC disappears as soon as dialogue opens (E key pressed while in range). Verified in Cafe, Apartment, and Park scenes. Hint still appears when approaching NPC and disappears when moving out of range.
**notes:** Found by playtester testing TASK-051. Root cause: `checkInteraction()` line 93 calls `setVisible(inRange)` every frame. Physics pause stops movement but not `update()`, so the player stays in range and the indicator stays visible. Fix: change to `setVisible(inRange && !this._interacting)`. See play-report.md for full reproduction steps.

---

### TASK-040
**title:** Full playtest — end-to-end game loop verification
**track:** PLAYTEST
**status:** DONE
**priority:** P0
**depends_on:** [TASK-054]
**assigned_agents:** [playtester]
**reads:** [app/index.html, all scene and UI files]
**writes:** [.claude/handoffs/play-report.md, IMPROVEMENTS.md]
**done_when:** Playtester completes a full new-player run: onboarding → apartment → park → café → market → station → police → chapter tests → graduation. play-report.md filed with: (1) any broken interactions, (2) any empty or missing UI, (3) any Russian text errors visible in-game, (4) audio issues, (5) lock/unlock chain verified correct. PASS if no critical blockers found.
**notes:** Test on both desktop keyboard and simulated mobile (375px viewport). Verify dialogue box, journal, HUD, settings all display correctly with Kenney fonts and pixel skin. Any critical BUG tasks found here are P0 blockers — fix them before proceeding to P1.

---

### P1 — Core gameplay
*Makes the game feel like a game: interact, talk, get missions. Implement in order after P0 playtest PASS.*

---

### TASK-051
**title:** NPC interaction indicator — proximity E-key / tap-zone visual
**track:** FAST
**status:** DONE
**priority:** P1
**depends_on:** [TASK-045]
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/game/entities/NPC.js, app/game/entities/Player.js, app/style.css, app/tokens.css]
**writes:** [app/game/entities/NPC.js, app/style.css]
**done_when:**
- When player enters NPC interaction range, a small pixel-art prompt appears above the NPC sprite ("E" on desktop, tap icon on mobile)
- Prompt disappears when player moves out of range or dialogue opens
- Indicator uses pixel font (`--font-hud`) and stone/dark palette matching the game aesthetic
- Works correctly for all NPCs across all scenes
**notes:** Per REFERENCE-GAMEDESIGN.md: the player must know what they can interact with. The indicator should be subtle — not a floating exclamation mark, but a small keyboard hint. Use a Phaser Text object positioned above the NPC sprite, visible only in the interaction zone.

---

### TASK-052
**title:** Mobile dialogue UX — tap to advance, viewport fit, 48px touch targets
**track:** FAST
**status:** BACKLOG
**priority:** P1
**depends_on:** [TASK-042]
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/ui/dialogue.js, app/style.css, app/tokens.css]
**writes:** [app/ui/dialogue.js, app/style.css]
**done_when:**
- Tapping anywhere on the dialogue text area advances to the next beat (no dedicated "next" button needed)
- Choice buttons are minimum 48px height and full-width on mobile (375px)
- Dialogue panel does not overflow or require horizontal scroll on 375px viewport
- Tap-to-advance does not accidentally trigger NPC interaction again (event propagation handled correctly)
**notes:** Tap-to-advance must be guarded: only fire when dialogue is OPEN state (from TASK-041 state machine). Use a single `click` listener on the dialogue text container, not on the whole window.

---

### TASK-048
**title:** Wire MissionGenerator — trigger from dialogue, update HUD + Journal
**track:** FAST
**status:** BACKLOG
**priority:** P1
**depends_on:** [TASK-041, TASK-045]
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/game/systems/MissionGenerator.js, app/game/systems/MistakeLogger.js, app/ui/hud.js, app/ui/journal.js, app/storage.js]
**writes:** [app/game/systems/MissionGenerator.js, app/ui/hud.js, app/ui/journal.js]
**done_when:**
- `MissionGenerator.checkAndGenerate()` is called after every `DIALOGUE_END` event
- If a new mission is generated, `#hud-mission` text updates immediately with the mission title
- Journal missions tab re-renders active + completed missions when opened (reads from storage)
- Completed missions display with a visual completion indicator (strikethrough or checkmark)
- Empty state: missions tab shows "Нет заданий" when no missions exist
**notes:** MissionGenerator reads from MistakeLogger — ensure MistakeLogger has at least one logged mistake before testing, otherwise no mission will generate.

---

### P1-ART — Visual correctness (critical)
*Tile frame assignments that are confirmed wrong or unverified. These affect every player session. Ordered by visual impact.*

---

### P1-ART-B — Visual coherence (high)
*Present but visually incoherent. Fix after critical frame issues are resolved.*

---

### TASK-060
**title:** Verify and fix overworld building tile frames in WorldScene CITY_TILES
**track:** BUILD-ART
**status:** BACKLOG
**priority:** P1-ART-B
**depends_on:** []
**assigned_agents:** [pixel-artist, coder, reviewer, playtester, git]
**reads:** [app/game/scenes/WorldScene.js, app/assets/tilesets/roguelike-city.png, .claude/pixel-art-mapping.md, REFERENCE-PIXELART.md]
**writes:** [app/game/scenes/WorldScene.js]
**done_when:**
- Every frame index in `CITY_TILES.buildings` (wall, roof, door for all 6 buildings) has been visually verified against the actual roguelike-city.png sheet
- Any incorrect frame assignments are remapped to frames that actually depict wall surfaces, roof surfaces, and door openings
- Grass frames (888, 962) and path frames (606, 644) verified — replaced if they do not depict what the comments claim
- Dead code removed: `roofColor`, `wallColor`, `doorColor` fields in `BUILDING_ZONES` that are never read by `_drawBuilding()`
- All 6 buildings render with visually distinct, appropriate tiles in-game
- The locked building overlay uses a tile-based or outlined visual instead of the current flat purple programmatic rectangle (finding #13)
**notes:** Addresses pixel-art-mapping.md findings #10 (building frame indices are unverified guesses), #13 (locked overlay is programmatic purple rectangle), and the dead code note from section 6 (roofColor/wallColor/doorColor). The pixel-artist must inspect the roguelike-city spritesheet and document which frames contain building wall, roof, and door tiles.

---

### TASK-061
**title:** Consolidate interior wall tiles and replace programmatic furniture with tiled assets
**track:** BUILD-ART
**status:** BACKLOG
**priority:** P1-ART-B
**depends_on:** [TASK-057, TASK-059]
**assigned_agents:** [pixel-artist, coder, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js, app/assets/tilesets/roguelike-indoors.png, .claude/pixel-art-mapping.md, REFERENCE-PIXELART.md]
**writes:** [app/game/scenes/ApartmentScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js]
**done_when:**
- All 5 interior scenes (excluding ParkScene which is handled by TASK-058) use a consistent, documented set of wall tiles — either one shared wall frame or a small set with documented rationale per scene type
- Programmatic furniture in all scenes (counters, tables, benches, filing cabinets, stall awnings, ticket windows, chairs) is replaced with roguelike-indoors spritesheet frames wherever a suitable tile exists
- Where no suitable roguelike-indoors frame exists for a furniture piece, the programmatic graphic is updated with a 1px dark outline (#2a2a2a) to match the pixel-art register
- Corner furniture frame assignments (131, 125, 341, etc.) are verified against the actual sheet and documented
- No scene uses a wall tile frame as a furniture piece or vice versa (fixes frame 266 used as both market wall and police furniture)
**notes:** Addresses pixel-art-mapping.md findings #6 (inconsistent wall tiles across scenes) and #7 (all furniture is programmatic geometry). This is a large task touching 5 scene files — the pixel-artist must first produce a tile mapping document from the roguelike-indoors sheet, then the coder applies it. Depends on TASK-057 (cafe floor fix) and TASK-059 (TestScene tiling) so those simpler fixes land first.

---

### P2 — Content depth
*Progression systems that enrich the experience. Implement after P1 is stable and tested.*

---

### TASK-047
**title:** NPC relationship tiers — stranger / acquaintance / friend dialogue switching
**track:** FAST
**status:** BACKLOG
**priority:** P2
**depends_on:** [TASK-041, TASK-045]
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/game/entities/NPC.js, app/game/content/apartment-dialogue.js, app/storage.js, app/config.js]
**writes:** [app/game/entities/NPC.js, app/game/content/apartment-dialogue.js]
**done_when:**
- `NPC.js` reads `npcRelationships[npcId]` from storage to determine tier: 0 = stranger, 1 = acquaintance, 2 = friend
- Relationship score increments by 1 after each completed dialogue (DIALOGUE_END fires)
- Score thresholds: 0 = stranger, 1–2 = acquaintance, 3+ = friend
- `TutorAI.startConversation()` receives the current tier as context so the system prompt adjusts formality (вы vs ты) per REFERENCE-DIALOGUE.md §1
- Galina's `apartment-dialogue.js` scripted fallbacks have at least two tier-tagged variants per NPC interaction to demonstrate the system working
**notes:** Per REFERENCE-DIALOGUE.md: strangers use вы and formal address; acquaintances switch to ты and use the player's name; friends ask questions about the player's life. The tier must be passed to TutorAI so AI-generated responses also respect it.

---

### TASK-050
**title:** Daily NPC conversation limit — one rich exchange per day, then short farewell
**track:** FAST
**status:** BACKLOG
**priority:** P2
**depends_on:** [TASK-047]
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/game/entities/NPC.js, app/game/systems/TutorAI.js, app/storage.js, app/config.js]
**writes:** [app/game/entities/NPC.js, app/game/systems/TutorAI.js]
**done_when:**
- Storage tracks `lastTalkedDate[npcId]` — the in-game or real-world date of the last completed conversation
- If player interacts with an NPC they already spoke to today, NPC gives a short contextual farewell line ("До свидания!" / "See you tomorrow!") and dialogue closes after one beat — no full AI conversation
- System prompt sent to TutorAI includes an `alreadySpokenToday: true` flag when applicable, allowing AI to give a brief response naturally
- Per REFERENCE-GAMEDESIGN.md §1: after one rich conversation, NPC gives "see you tomorrow" — scarcity makes choices feel meaningful
**notes:** "Today" can be defined as the same UTC calendar day, or as a session-based flag if simpler. Start with session-based (reset on page load) then upgrade to date-based.

---

### P2-ART — Visual polish (medium)
*Works but misses the intended aesthetic. Lower priority than correctness fixes.*

---

### TASK-062
**title:** Wire ui-pack.png for HUD, dialogue, and journal — replace pure-CSS boxes with 9-slice borders
**track:** BUILD-ART
**status:** BACKLOG
**priority:** P2-ART
**depends_on:** [TASK-061]
**assigned_agents:** [pixel-artist, designer, coder, reviewer, playtester, git]
**reads:** [app/assets/ui/ui-pack.png, app/game/Boot.js, app/ui/dialogue.js, app/ui/hud.js, app/ui/journal.js, app/style.css, app/tokens.css, .claude/pixel-art-mapping.md, REFERENCE-PIXELART.md]
**writes:** [app/game/Boot.js, app/style.css, app/tokens.css, app/ui/dialogue.js, app/ui/hud.js, app/ui/journal.js]
**done_when:**
- `ui-pack.png` is loaded in Boot.js as a spritesheet with correct frame dimensions
- Dialogue box border uses a 9-slice panel sprite from ui-pack instead of the current flat CSS border
- HUD location badge and mission indicator use ui-pack panel/button frames
- Journal panel uses ui-pack panel frame for its background
- The mute button uses a ui-pack icon sprite (speaker icon) instead of pure text
- All UI elements remain functional on mobile (375px viewport) after the visual update
- `KenneyMini.ttf` is either wired into CSS for a specific use case (e.g. smaller labels) or removed from disk if truly unneeded
**notes:** Addresses pixel-art-mapping.md finding #11 (dialogue/HUD/journal are generic dark-box CSS, ui-pack.png is orphaned) and finding #15 (KenneyMini.ttf never referenced). The designer must spec which ui-pack frames to use for each UI element. The pixel-artist identifies the frame coordinates. This depends on TASK-061 so that interior visual coherence is established before UI polish.

---

### TASK-063
**title:** Player sprite visual identity — designate a distinct protagonist frame from roguelike-characters
**track:** BUILD-ART
**status:** BACKLOG
**priority:** P2-ART
**depends_on:** [TASK-056]
**assigned_agents:** [pixel-artist, coder, reviewer, playtester, git]
**reads:** [app/game/entities/Player.js, app/game/Boot.js, app/assets/tilesets/roguelike-characters.png, app/assets/tilesets/tilemap_packed.png, .claude/pixel-art-mapping.md, REFERENCE-PIXELART.md]
**writes:** [app/game/entities/Player.js, app/game/Boot.js]
**done_when:**
- Player sprite uses a designated frame from roguelike-characters.png (same sheet as NPCs) instead of the generic RPG Urban Pack character (tilemap_packed frame 23)
- The chosen player frame is visually distinct from all 13 NPC frame assignments (different body/clothing/accessory combination)
- Walk animations (down, up, side) are wired to appropriate frames from the roguelike-characters sheet, or if the sheet lacks directional variants, a single static frame is used with a subtle bob animation
- Player and NPC sprites are from the same tileset, eliminating the visual style mismatch (finding #9)
- Boot.js animation creation updated to reference the new frame source
**notes:** Addresses pixel-art-mapping.md findings #8 (player is a generic tileset character) and #9 (two separate tileset packs with different visual registers). Depends on TASK-056 (NPC frame verification) so that the player frame is chosen with full knowledge of which frames are already claimed by NPCs. NOTE: if roguelike-characters.png does not have enough directional walk frames for a player character, flag to user rather than fabricating animations.

---

### RECURRING

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
- TASK-045 | DONE | 2026-03-30 | Event listener audit — Player.destroy(), scene shutdown cleanup | e64848b
- TASK-046 | DONE | 2026-03-30 | Scene transition guard — reset _transitioning in shutdown | f7e76aa
- TASK-044 | DONE | 2026-03-30 | AudioManager LOCATION_ENTER fix + #hud-mute wiring | 3f94d36
- TASK-049 | DONE | 2026-03-30 | Vocabulary logging — dialogue choices feed Journal vocab tab | 7922795
- TASK-055 | DONE | 2026-03-30 | Loading states + API error toast — boot bar + hud-toast | 73944ce
- TASK-053 | DONE | 2026-03-30 | Dialogue API fallback chain — scripted fallback + offline badge | dc49a2b
- TASK-054 | DONE | 2026-03-30 | TestScene lifecycle fix — verification only, TASK-045 already applied pattern | no-commit
- TASK-040 | DONE | 2026-03-30 | Full playtest — 2 bugs filed (BUG-001 tileset frames, BUG-002 hud-mute duplicate) | sign-off
- TASK-056 | DONE | 2026-03-30 | NPC character frame assignments verified + fixed for 54-col sheet | b22d704+6802e05
- TASK-051 | DONE | 2026-03-30 | NPC interaction indicator — [E]/tap proximity hint above NPCs | 80f6af3
- BUG-001 | DONE | 2026-03-30 | City tileset frame indices — CITY_TILES recalculated row×34 | 25a12d7
- TASK-057 | DONE | 2026-03-30 | CafeScene floor_b tile 23→243 | b1669e2
- TASK-058 | DONE | 2026-03-30 | ParkScene outdoor conversion — city grass+path tiles | 1c46c4e
- TASK-059 | DONE | 2026-03-30 | TestScene tiled floor+walls via roguelike-indoors | 25d5f45
- BUG-002 | DONE | 2026-03-30 | Duplicate #hud-mute fix — reuse existing AudioManager button | pending-commit

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
- 2026-03-30 · TASK-044 AudioManager LOCATION_ENTER name-id map, #hud-mute wired · 3f94d36
- 2026-03-30 · TASK-045 Player.destroy(), ZONE_ENTER cleanup, all interior scenes shutdown · e64848b
- 2026-03-30 · TASK-046 WorldScene shutdown resets _transitioning flag · f7e76aa
- TASK-044 | DONE | 2026-03-30 | AudioManager LOCATION_ENTER fix + #hud-mute wiring | 3f94d36
- 2026-03-30 � TASK-044 AudioManager LOCATION_ENTER name?id map, #hud-mute wired to toggleMute � 3f94d36
- 2026-03-30 · TASK-049 Vocabulary logging — dialogue vocab collection + Journal render with dedup/frequency · 7922795
- 2026-03-30 · TASK-055 Loading states + API error toast — tutor-status toast in HUD, stone palette CSS · 73944ce
- 2026-03-30 · TASK-053 Dialogue API fallback chain — NPC-specific scripted fallback + offline badge · dc49a2b
- 2026-03-30 · TASK-053 Git — reset _offline flag in _handleDialogueEnd · fbe2d38 · backup/pre-build-20260330-183040
- 2026-03-30 · TASK-054 TestScene lifecycle — verification only, TASK-045 already applied the pattern · no-commit · backup/pre-build-20260330-191527
- 2026-03-30 · Assessment: pixel-art-mapping.md audit converted to TASK-056 through TASK-063 (8 BUILD-ART tasks), duplicates cleaned from backlog
- 2026-03-30 · TASK-040 Full playtest — FAIL, BUG-001 (city tileset frame indices) + BUG-002 (hud-mute duplicate) filed as P0 blockers · sign-off
- 2026-03-30 · TASK-051 NPC proximity interaction hint — [E]/tap badge above NPCs, CSS tokens, state-flag discipline · 80f6af3
