# IMPROVEMENTS.md

## Current task

(none — see Backlog for next priorities)

## Session log
- 2026-04-03 /assess full: added BUG-028, TASK-083, TASK-084 — tier/TutorAI/VARIATIONS gaps identified
- 2026-04-03 BUG-028: vocab seeding implementation confirmed in HEAD (1206c5a); BUG-029 filed (controls hint race with unlock toasts)
- 2026-04-03 BUG-029 complete. Committed 5ae22a9. Playtester also filed BUG-030 (experience.spec placeholder never resolves) and BUG-031 (PoliceScene alina.met not saved).
- 2026-04-03 /assess full: added BUG-032, BUG-033, BUG-034, TASK-085, TASK-086, TASK-087 — regression in scripted choice close, placeholder timeout, mobile worker crash, NPC tier depth, production input wiring, return-visit variation content gaps.

---

## Done

- CONTENT-GALINA | DONE | 2026-04-01 | Life-detail variations — sister Lyudmila + plant story thread | 7a9e911
- CONTENT-NPC | DONE | 2026-04-01 | Cross-location gossip lines — Galina, Tamara, Boris reference other NPCs | e82207c
- BUG-010 | DONE | 2026-03-31 | Controls hint on WorldScene load | f40323e
- TASK-064 | DONE | 2026-04-01 | Recovery playtest — 84 passing, 0 failing, BUG-008–BUG-019 confirmed stable | sign-off
- BUG-020 | DONE | 2026-04-01 | First-visit scripted dialogue — narration scaffold + bilingual choice buttons | 8c9dec7
- BUG-020-R | DONE | 2026-04-01 | CHOICE_FALLBACK_TRANSLATIONS in dialogue.js — dismiss/greet/thanks/continue/end all get English | 69b5e4d
- BUG-021 | DONE | 2026-04-01 | TutorAI loading state — fallback exit choice + 2500ms timer + loading flag propagation | 69b5e4d
- BUG-022 | DONE | 2026-04-01 | TutorAI choice buttons bilingual via fallback map + explicit translation fields | 69b5e4d
- TASK-065 | DONE | 2026-04-01 | HUD mission indicator — English subtitle below Russian title | e355ed3
- TASK-066 | DONE | 2026-04-01 | Location unlock HUD toast fires on unlockedLocations push | e355ed3
- TASK-067 | DONE | 2026-04-01 | Professor zone in WorldScene launches TestScene | e355ed3
- TASK-068 | DONE | 2026-04-01 | MISSION_COMPLETE HUD toast + 500ms delayed slot clear | e355ed3
- TASK-073 | DONE | 2026-04-01 | TutorAI vocab reinforcement uses slice(-8) for most recent words | e355ed3
- TASK-069 | DONE | 2026-04-01 | Building completion overlay — amber glow on WorldScene buildings when all location missions done | ce47196
- BUG-023 | DONE | 2026-04-02 | Narration dead-end — advance hint injected, Enter key wired, body click fixed (flex-wrap CSS + isFinal auto-close) | ff16d2c
- TASK-077 | DONE | 2026-04-02 | Interactive flow tests — tests/flows.spec.js created (40/40 pass desktop+mobile) | ff16d2c
- TASK-078 | DONE | 2026-04-02 | ParkScene first-visit scripted dialogue — Artyom intro, bilingual choices, artyom.met saved | 121ca4c
- BUG-024 | DONE | 2026-04-02 | _onTapAdvance blocked by hint child — .dialogue-choices flex-wrap:wrap so .dialogue-body gets non-zero width | playtester-2026-04-02
- BUG-025 | DONE | 2026-04-02 | Enter key __advance__ test race fixed — added waitForTimeout(100) before keyboard.press | playtester-2026-04-02
- BUG-025b | DONE | 2026-04-02 | WorldScene controls-hint timer leak — this._controlsHintTimer + clearTimeout in shutdown() | 5798ba4
- TASK-079 | DONE | 2026-04-02 | CafeScene first-visit scripted dialogue — Lena intro, bilingual choices, lena.met saved | 5798ba4
- TASK-080 | DONE | 2026-04-02 | MarketScene first-visit scripted dialogue — Fatima intro, bilingual choices, fatima.met saved | 5798ba4
- TASK-081 | DONE | 2026-04-02 | StationScene first-visit scripted dialogue — Konstantin intro, bilingual choices, konstantin.met saved | 5798ba4
- TASK-082 | DONE | 2026-04-02 | PoliceScene first-visit scripted dialogue — Alina intro, bilingual choices, alina.met saved | 5798ba4
- BUG-026 | DONE | 2026-04-02 | Return-visit test timeout — test.setTimeout(90_000) added to 7-errors test | 80f01d5
- TASK-074 | DONE | 2026-04-02 | Galina relationship tiers — 6 VARIATION lines + updateGalinaTier() helper (wiring in TASK-074b) | 4d9ebd1
- BUG-027 | DONE | 2026-04-03 | Pre-commit hook timeouts — 90s timeout for all 5 beforeEach blocks in flows.spec.js | 70d2ebe
- TASK-074b | DONE | 2026-04-03 | Wire updateGalinaTier() into ApartmentScene._onDialogueEnd — hydration guard + 2 Playwright tier tests | 52f0866
- TASK-083 | DONE | 2026-04-03 | TutorAI persona tier injection — вы tier 0, ты tier 1, friend tier 2 appended to persona | 0a93b49
- TASK-084 | DONE | 2026-04-03 | Scripted variation selector — selectVariation() + all 6 scenes wired + Playwright test | 924292f
- BUG-028 | DONE | 2026-04-03 | First-visit vocab seeding — 5 words from tutorVocabulary seeded on DIALOGUE_END + Playwright test | 03b1443
- TASK-076 | DONE | 2026-04-03 | Temporal NPC variations — morning/evening/frequent_visitor triggers + { tier } selector fix | 1206c5a
- TASK-075 | DONE | 2026-04-03 | Production input — inputPrompt field renders text input, Enter dispatches __typed__ choice | 1206c5a
- BUG-031 | DONE | 2026-04-03 | Police first-visit dialogue closes and saves alina.met on desktop and mobile | 0054eca

---

## Knowledge Base
- [4e0810e] REFERENCE-GAMEDESIGN.md, REFERENCE-PIXELART.md, REFERENCE-DIALOGUE.md added

---

## Recovery

*Tasks here run before any Backlog task, regardless of priority. Recovery mode clears this queue first.*

### BUG-023
**title:** [RECOVERY] Narration phase dead-end — no visible advance affordance + Enter key unwired
**track:** BUG
**status:** DONE
**priority:** P0
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/ui/dialogue.js, app/config.js, app/game/scenes/ApartmentScene.js]
**writes:** [app/ui/dialogue.js]
**done_when:** (1) When `_populate()` renders with `effectiveChoices = []` and `!line.loading`, a visible "▼ tap / press Enter to continue" hint element is rendered inside `_choices` so the player has a clear affordance. (2) `dialogue.js` listens for `keydown` Enter (`KEYBOARD_SHORTCUTS.ADVANCE_DIALOGUE`) and calls `_onTapAdvance()` when dialogue is OPEN and choices are empty. Verified by Playwright: boot → enter ApartmentScene → assert advance hint OR button visible → click it → assert 3 choice buttons appear.
**notes:** [RECOVERY] [CONFIRMED BY HUMAN PLAYTEST] The first-visit onboarding flow is completely broken for a new player. ApartmentScene fires DIALOGUE_START with `choices: []` for the narration phase. `dialogue.js` opens the overlay and renders the narration text but zero buttons. A tap-to-advance mechanism exists (`_onTapAdvance` on body click fires `__advance__`) but there is no visual indicator that the dialogue is clickable. `config.js` defines `ADVANCE_DIALOGUE: 'Enter'` but `dialogue.js` has no keydown listener — Enter key does nothing. Player sees frozen dialogue, tries E/Enter/Escape (none work), concludes game is broken. The game IS broken from the player's perspective even though the underlying code path is correct.

---

### TASK-077
**title:** [PLAYABILITY] Interactive flow tests — Playwright spec covering full onboarding and NPC interaction paths
**track:** BUILD
**status:** DONE
**priority:** P1
**depends_on:** [BUG-023]
**assigned_agents:** [playtester, git]
**reads:** [tests/experience.spec.js, tests/gameplay.spec.js, app/game/scenes/ApartmentScene.js, app/ui/dialogue.js]
**writes:** [tests/flows.spec.js]
**done_when:** New `tests/flows.spec.js` contains at minimum: (1) onboarding flow test — boots, enters ApartmentScene, asserts dialogue opens, clicks advance, asserts 3 choice buttons appear, picks a choice, asserts dialogue closes; (2) NPC interaction test — enters Apartment, walks toward NPC zone, presses E, asserts dialogue opens, closes; (3) mission HUD test — asserts mission title visible in HUD after entering ApartmentScene. All 3 tests pass on both desktop and mobile viewports.
**notes:** [PLAYABILITY] Current test suite is structural only — it checks that DOM elements exist and that text is bilingual. It does NOT walk through any complete interactive flow. BUG-023 (narration dead-end) passed all 98 tests because no test executed the narration → advance → choices path end-to-end. This class of bug (correct logic, invisible UX) can only be caught by interactive flow tests. `flows.spec.js` should cover the paths a new player takes in the first 3 minutes, running them as a real user would.

---

## Backlog

---

- BUG-024 | DONE | 2026-04-02 | _onTapAdvance hint-child guard fixed — flows 40/40 desktop+mobile | ff16d2c
- BUG-025 | DONE | 2026-04-02 | Enter key mobile advance — resolved in ff16d2c, flows line 352 passes | ff16d2c

---

### P0 — Playability gate
*TASK-040 DONE (2026-03-30). TASK-064 recovery playtest DONE (2026-04-01, 84/0/4). P0 gate cleared — P1 and P2 work may proceed.*

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
**status:** DONE
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

### BUG-008
**title:** No exit from interior scenes — player permanently trapped after entering building
**track:** BUG
**status:** DONE
**priority:** P0
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js]
**writes:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js]
**done_when:** All 6 interior scenes have a working exit mechanism — player reaching the bottom-row tiles triggers `this.scene.start('World')`. Player can enter and exit every building. Verified in Playwright smoke test.
**notes:** Confirmed by human developer. All 6 interior scenes (ApartmentScene, ParkScene, CafeScene, MarketScene, StationScene, PoliceScene) have no mechanism to return to WorldScene. Only TestScene has `this.scene.start('World')`. Fix: detect when player reaches bottom-row tiles (y >= scene height - tileSize) and call `this.scene.start('World')`. Must clean up scene state (physics, event listeners) on exit per TASK-045 patterns.

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

---

### BUG-009
**title:** First-visit scripted dialogue race condition — TutorAI can fire before greeting completes
**track:** BUG
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/systems/TutorAI.js]
**writes:** [app/game/scenes/ApartmentScene.js]
**done_when:** First-visit scripted dialogue fires reliably every time. `_firstVisitScripted` flag is set synchronously (not inside async callback) so TutorAI cannot race in before the greeting completes. Players who have seen the intro but not met Galina still receive the scripted greeting.
**notes:** Confirmed by human developer. `_firstVisitScripted` flag is set to `false` at init then conditionally set to `true` inside an async `getProgress()` call. If `getProgress()` resolves slowly, TutorAI can race in before the scripted greeting via the 350ms `delayedCall`. Fix: set `_firstVisitScripted = true` synchronously before awaiting `getProgress()`, then downgrade to false only if progress confirms the greeting was already seen.

---

### BUG-010
**title:** No player affordance on WorldScene load — no controls guidance after onboarding
**track:** BUG
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/scenes/WorldScene.js, app/ui/hud.js]
**writes:** [app/game/scenes/WorldScene.js, app/ui/hud.js]
**done_when:** First-time players see a brief controls hint on WorldScene load — "WASD/arrows to move, E to talk" on desktop, tap joystick hint on mobile. Hint auto-dismisses after 5 seconds or on first player movement. Does not appear on subsequent visits (flag stored in session or storage).
**notes:** Confirmed by human developer. After onboarding sequence, player lands on WorldScene with no UI hint explaining how to move or interact. Fix: show a `hud-toast` or overlay hint for 5s on first WorldScene visit. Use the existing `hud-toast` system from TASK-055 if available, otherwise add a simple positioned div. Check `sessionStorage` or a flag to show only on first visit.

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
**status:** DONE
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

### P1 — Playability (assess 2026-04-01)
*Gaps found by /assess full run. Game technically works but these gaps cause confusion, loss of direction, or inaccessible content.*

---

### TASK-065
**title:** [PLAYABILITY] HUD mission indicator — show English subtitle alongside Russian title
**track:** FAST
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/ui/hud.js, app/game/systems/StoryMissions.js, app/game/systems/MissionGenerator.js]
**writes:** [app/ui/hud.js]
**done_when:** The HUD mission indicator displays the Russian mission title on one line and the English `titleEn` on a smaller line below it. A new player can read "Знакомство / Meet your neighbor Galina" without opening the Journal. Both StoryMissions and MissionGenerator pass `titleEn` in the MISSION_START event detail — the HUD must render it.
**notes:** [PLAYABILITY] Currently `hud.js _showMission()` only renders `e.detail.title` (Russian). The `titleEn` field is dispatched by both mission systems but silently ignored. A beginner Russian learner sees "Новые слова" in the HUD and has no idea what to do without opening the Journal. The English subtitle should be visually subordinate (smaller, muted) so it doesn't break the Russian-first design principle.

---

### TASK-066
**title:** [PLAYABILITY] Location unlock notification — HUD toast when new location becomes accessible
**track:** FAST
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/ui/hud.js, app/config.js]
**writes:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js]
**done_when:** Whenever a scene pushes a new location to `unlockedLocations`, a `HUD_TOAST` event fires immediately after with a message naming the newly accessible location (e.g. "The park is now open!"). Toast is visible for 4 seconds. Player does not need to discover the unlock by accident.
**notes:** [PLAYABILITY] Each interior scene silently calls `progress.unlockedLocations.push(nextLocation)` with no user-facing feedback. The player may not notice the new building is accessible until they walk past it. Per REFERENCE-GAMEDESIGN.md §2: "lock the system, not the display" — the unlock event should be felt, not just stored. Use the existing `EVENTS.HUD_TOAST` mechanism.

---

### BUG-028
**title:** [PLAYABILITY] First-visit scripted dialogue never seeds vocabulary — story:apartment:2 blocked without TutorAI
**track:** BUG
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/content/apartment-dialogue.js, app/storage.js, app/config.js]
**writes:** [app/game/scenes/ApartmentScene.js]
**done_when:** After the ApartmentScene first-visit scripted dialogue completes (DIALOGUE_END fires), at least 5 vocabulary entries from `APARTMENT_DIALOGUE.NPC_DATA.tutorVocabulary` (e.g. здравствуйте, привет, спасибо, да, нет) are dispatched as `EVENTS.VOCABULARY_NEW` events and saved to vocabulary storage. Story mission `story:apartment:2` (vocab_count >= 5) passes completion check after the scripted first visit without requiring TutorAI. Playwright test: first-visit flow → assert vocabulary storage has >= 5 entries after DIALOGUE_END.
**notes:** [PLAYABILITY] [CODE SCAN] `story:apartment:2` requires `vocab_count >= 5`. Vocabulary is only added to the store via `EVENTS.DIALOGUE_END` with `detail.vocab` array (populated by TutorAI). The first-visit scripted dialogue fires DIALOGUE_END with no `vocab` field — zero words are seeded. If the Gemini API is unavailable, rate-limited, or the player exits before TutorAI completes a turn, they can never complete mission 2 and the entire progression chain (unlock park → café → etc.) is permanently blocked. Fix: in ApartmentScene `_onDialogueEnd`, when `_firstVisitScripted` was true (i.e. the first-visit scripted exchange just completed), dispatch 5 basic words from `NPC_DATA.tutorVocabulary` as a `VOCABULARY_NEW` event batch. This matches the pedagogical intent (Galina teaches these words in the scripted exchange) and unblocks progression without requiring API availability.

---

### TASK-067
**title:** [PLAYABILITY] Chapter test — add overworld access point; TestScene has no launch trigger
**track:** BUG
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/scenes/WorldScene.js, app/game/scenes/TestScene.js, app/ui/test.js, app/game/systems/StoryMissions.js, app/config.js]
**writes:** [app/game/scenes/WorldScene.js]
**done_when:** A player who has completed all story missions for chapter 1 can access the chapter test. Either: (a) a "Professor's Apartment" building zone is added to WorldScene that launches `scene.start('Test', { chapter: N })` when entered, or (b) an alternative access path (HUD button, story mission trigger) is implemented and documented. TestScene is confirmed reachable in Playwright.
**notes:** [PLAYABILITY] `scene.start('Test', ...)` is never called anywhere in the codebase. TestScene is registered in main.js and fully implemented (TASK-020), but there is no button, zone, or trigger that launches it. Chapter tests are completely inaccessible to players. This was confirmed by grep — zero matches for `start.*'Test'` across all app/ JS files.

---

### P2 — Content depth
*Progression systems that enrich the experience. Implement after P1 is stable and tested.*

---

---

- TASK-050 | DONE | 2026-04-01 | Daily NPC conversation limit — session farewell after one rich exchange | 38f4ac5

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

### P2 — Game feel & aliveness (assess 2026-04-01)
*Gaps found by /assess full run. Game is playable but these gaps make the world feel empty, interactions feel hollow, and progression feel unrewarding.*

---

### TASK-068
**title:** [GAME_FEEL] Mission completion feedback — HUD toast + brief acknowledgement on MISSION_COMPLETE
**track:** FAST
**status:** DONE
**priority:** P2
**depends_on:** []
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/ui/hud.js, app/config.js]
**writes:** [app/ui/hud.js]
**done_when:** When `EVENTS.MISSION_COMPLETE` fires, a HUD toast appears for 3 seconds with a positive brief message (e.g. "Задание выполнено! ✓" / "Mission complete!"). The mission slot clears AFTER the toast, not before. Player has a visible beat of acknowledgement before the next mission silently takes over.
**notes:** [GAME_FEEL] Currently `MISSION_COMPLETE` causes hud.js to remove the `is-visible` class and clear the title text — that's it. No toast, no beat, no reaction. Per REFERENCE-DIALOGUE.md §2: "the NPC's response should be emotional or relational, not a recap." Even without NPC lines, a brief HUD moment prevents the player from feeling their accomplishment was unnoticed. Use `EVENTS.HUD_TOAST` to fire the message, then clear the mission slot after a 500ms delay.

---

- TASK-069 | DONE | 2026-04-01 | Cross-location gossip lines — Galina, Tamara, Boris reference other NPCs/locations | e82207c

---

- TASK-070 | DONE | 2026-04-01 | Galina life-detail variations — sister Lyudmila + plant story thread | 7a9e911

---

- TASK-071 | DONE | 2026-04-01 | TutorAI vocab recognition — known-word list injected into system prompt before startConversation | d442b82

---

### TASK-073
**title:** [GAME_FEEL] TutorAI vocab reinforcement — fix slice direction to use most recently learned words
**track:** FAST
**status:** DONE
**priority:** P2
**depends_on:** []
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/tutor.js]
**writes:** [app/tutor.js]
**done_when:** `_buildSystemPrompt` in `app/tutor.js` uses `.slice(-8)` (or equivalent) to select the 8 most recently learned words from `_learnedWords`. Verified by reading the function: the 8 words injected into the reinforcement prompt are the last 8 entries from the vocabulary array (most recently acquired), not the first 8 of the recent 20 (oldest of the recent batch).
**notes:** [GAME_FEEL] Strategy 2 (vocab reinforcement) was implemented in 738ce48. `startConversation()` correctly loads the last 20 learned words via `(vocab.words || []).slice(-20)`. But `_buildSystemPrompt` then uses `learnedWords.slice(0, 8)`, which takes the 8 OLDEST of those 20 — i.e., words the player learned 12-20 interactions ago. The NPC reinforces stale vocabulary instead of what the player just learned. Fix: change `.slice(0, 8)` to `.slice(-8)`. This aligns with SRS principle (recency: newly acquired words need reinforcement most). The player's most recently learned words should be the ones the NPC naturally re-uses in conversation.

---

- TASK-072 | DONE | 2026-04-01 | Amber completion overlay on buildings when all location missions done | ce47196

---

### TASK-074
**title:** [GAME_FEEL] NPC relationship tiers — implement stranger/acquaintance/friend dialogue switching
**track:** BUILD
**status:** DONE
**priority:** P2
**depends_on:** []
**assigned_agents:** [architect, content-writer, linguist, coder, reviewer, playtester, git]
**reads:** [app/game/content/apartment-dialogue.js, app/storage.js, app/config.js, REFERENCE-DIALOGUE.md, CLAUDE-VISION.md]
**writes:** [app/game/content/apartment-dialogue.js, app/storage.js, app/config.js]
**done_when:** Galina's dialogue (at minimum) responds to a numeric relationship tier stored in `progress.npcRelationships.galina.tier` (0=stranger, 1=acquaintance, 2=friend). Tier 0: Galina addresses the player with "вы" (formal you). Tier 1 (after 3+ visits): Galina switches to "ты" and references something from a prior interaction. Tier 2 (after 7+ visits): Galina initiates small talk, asks about the player. VARIATIONS with `tier` trigger conditions replace the current flat flag-based triggers for at least 2 new lines per tier.
**notes:** [GAME_FEEL] [EXPERIENCE SCAN] All Galina VARIATIONS use binary flags (`galina_met: true/false`, `galina_intro: true/false`) with no tier system. Galina speaks identically to a first-time visitor and to a player who has visited 10 times. Per REFERENCE-DIALOGUE.md §1: "three dialogue tiers minimum — stranger, acquaintance, friend. Lines at each tier should reference shared history." Without tiers, the player never feels a relationship arc. The "вы" → "ты" shift is itself a Russian language lesson (formal/informal address) that the player experiences before understanding it grammatically — matching REFERENCE-DIALOGUE.md §3.

---

### TASK-075
**title:** [GAME_FEEL] Active production input — add typing field to dialogue for vocabulary production moments
**track:** BUILD
**status:** DONE
**priority:** P2
**depends_on:** []
**assigned_agents:** [architect, coder, reviewer, playtester, git]
**reads:** [app/ui/dialogue.js, app/style.css, app/tokens.css, app/config.js, REFERENCE-GAMEDESIGN.md]
**writes:** [app/ui/dialogue.js, app/style.css]
**done_when:** The dialogue UI supports an optional `inputPrompt` field in `DIALOGUE_UPDATE` event detail. When present, a text input field renders below the NPC speech bubble with a placeholder (e.g., "Type the Russian word..."). Player types and submits with Enter. The submitted text is dispatched as `EVENTS.DIALOGUE_CHOICE` with `{ choiceId: '__typed__', text: <playerInput> }`. At minimum one StoryMissions conversation uses an inputPrompt to require the player to type a taught vocabulary word before the mission completes.
**notes:** [GAME_FEEL] [EXPERIENCE SCAN] Every player interaction is a choice button click — no vocabulary word has ever required the player to produce (type) Russian text. Per REFERENCE-GAMEDESIGN.md §6: "production beats reception — studies show learners who use new words retain them significantly better than those who only encounter them. Design at least one active production moment per vocabulary word." The current system supports only reception (clicking displayed Russian). Adding an optional text input to the dialogue box (used sparingly, not on every turn) enables the "production" missions the curriculum plan requires. The input should be low-stakes — no red flash on wrong answers, NPC reacts in character.

---

### TASK-083
**title:** [GAME_FEEL] TutorAI persona is tier-unaware — inject relationship tier into Galina's persona before startConversation()
**track:** FAST
**status:** DONE
**priority:** P2
**depends_on:** [TASK-074b]
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/content/apartment-dialogue.js, app/config.js]
**writes:** [app/game/scenes/ApartmentScene.js]
**done_when:** In `ApartmentScene._onDialogueStart`, before calling `TutorAI.startConversation(aiNpcData)`, read `progress.npcRelationships.galina.tier` from storage (sync from a cached value is fine — avoid a second async call; store it in `this._galinaTier` during `create()`). Build the persona string conditionally: tier 0 → existing persona (formal "вы", stranger register). Tier 1 → append "You have spoken with this student several times. Address them with ты (informal you) instead of вы. Reference that you have met before." Tier 2 → append "This student is a friend now. Use ты, initiate small talk, ask how their studies are going, reference your past conversations." Playwright test: seed progress with `galina.tier: 1`, enter Apartment, press E, assert dialogue opens — cannot assert AI content but can assert `TutorAI.startConversation` was called (smoke only). At minimum: no crash, dialogue opens with tier >= 1 save.
**notes:** [GAME_FEEL] [CODE SCAN] `updateGalinaTier()` correctly promotes tier 0→1→2 based on visit count (wired in TASK-074b). However, `ApartmentScene._onDialogueStart` always passes the same static `persona` string to TutorAI regardless of tier. After 10 visits, Galina still greets the player as a complete stranger — "Это квартира три, какая вам нужна?" — because TutorAI has no knowledge of the relationship history. Per REFERENCE-GAMEDESIGN.md §3: "three tiers minimum — stranger, acquaintance, friend. Lines at each tier should reference shared history." The fix is 5-10 lines: cache tier in `create()` from getProgress(), inject a conditional tier descriptor into the persona before each `startConversation()` call.

---

### TASK-084
**title:** [ALIVENESS] VARIATIONS content banks are dead code — wire scripted variation selector for return visits across all 6 scenes
**track:** BUILD
**status:** DONE
**priority:** P2
**depends_on:** [TASK-083]
**assigned_agents:** [architect, coder, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js, app/game/content/apartment-dialogue.js, app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, app/config.js]
**writes:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js]
**done_when:** A shared `selectVariation(variations, flags, progress)` helper is implemented. Given the VARIATIONS array and current flags/progress state, it finds the first variation whose `trigger` matches: `{ flag, value }` objects check `flags[flag] === value`; function triggers call `trigger(flags, progress)`; `{ tier }` objects check `progress.npcRelationships[npcId].tier >= tier`. On NPC interaction (E key press), each scene calls `selectVariation()` before launching TutorAI. If a matching variation is found, it dispatches the variation's lines as scripted content (same pattern as ApartmentScene's first-visit scripted mode). If no match, TutorAI launches as fallback. Playwright test: seed `galina_met: true, galina_intro: false` → enter Apartment, press E → assert dialogue opens with variation_2 content (self-introduction exchange) within 2s.
**notes:** [ALIVENESS] [CODE SCAN] All 6 content files (apartment-, park-, cafe-, market-, station-, police-dialogue.js) contain rich VARIATIONS arrays: Galina has 15+ scripted variations (including tier-gated lines for acquaintance and friend tiers), Artyom has 12+, Tamara has 12+, etc. None of these variations are ever rendered on return visits — every NPC interaction after first visit goes directly to TutorAI. The TutorAI does provide dynamic content, but it cannot replicate the carefully written scripted beats (the вы→ты switch reveal, the jam delivery mission, the Lyudmila life-detail moments). These scripted variations exist because they teach specific vocabulary or story beats in a controlled way that TutorAI cannot reliably reproduce. The fix architecture: a shared variation selector utility + a pre-TutorAI dispatch path in each scene's NPC interaction handler. Variations should be exhausted (each variation shown max once) before looping, with TutorAI as fallback when all available variations for current state are exhausted.

---

### TASK-074b
**title:** Wire updateGalinaTier() into ApartmentScene._onDialogueEnd — tier promotion not yet active
**track:** FAST
**status:** DONE
**priority:** P2
**depends_on:** [TASK-074]
**assigned_agents:** [coder, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/content/apartment-dialogue.js]
**writes:** [app/game/scenes/ApartmentScene.js]
**done_when:** After each completed Galina interaction, `APARTMENT_DIALOGUE.updateGalinaTier(progress)` is called in `_onDialogueEnd` and the result is saved via `saveProgress()`. After 3 visits, `progress.npcRelationships.galina.tier` is 1. After 7, it is 2. A hydration guard in `create()` backfills `tier: 0, visitCount: 0` for existing saves missing those fields. Playwright test: simulate 3 visits, assert tier === 1.
**notes:** The `updateGalinaTier(progress)` helper was added to apartment-dialogue.js in TASK-074 but ApartmentScene was not in the writes list. This follow-up wires the helper into the existing `_onDialogueEnd` flow. Also update the variation selector to filter by `(v.minTier ?? 0) <= currentTier` so tier-gated lines only show at the right tier.

---

### TASK-076
**title:** [ALIVENESS] Time-of-day and visit-count NPC variation triggers — add temporal variation to dialogue
**track:** CONTENT
**status:** DONE
**priority:** P2
**depends_on:** [TASK-074]
**assigned_agents:** [content-writer, linguist, coder, git]
**reads:** [app/game/content/apartment-dialogue.js, app/storage.js, app/config.js, REFERENCE-GAMEDESIGN.md, REFERENCE-DIALOGUE.md]
**writes:** [app/game/content/apartment-dialogue.js, app/storage.js]
**done_when:** At least 2 new Galina VARIATIONS use time-of-day triggers (morning 06:00–12:00, evening 18:00–23:00 via `new Date().getHours()`) rather than only flag conditions. At least 1 variation fires on a high visit count (e.g., 5+ total visits to the apartment, tracked in `progress.npcRelationships.galina.visitCount`). The trigger evaluation logic in ApartmentScene (or a shared helper) checks these conditions before selecting a variation, with fallback to the existing flag-based system.
**notes:** [ALIVENESS] [EXPERIENCE SCAN] All NPC dialogue triggers in `apartment-dialogue.js` are binary flag conditions (`galina_met`, `galina_intro`). There is no time-of-day or visit-frequency variation. Per REFERENCE-GAMEDESIGN.md §4: "each location needs minimum 3 variation triggers per NPC: (1) time-of-day variation, (2) weather variation, (3) relationship-tier progression." Without temporal variation, NPCs feel frozen — Galina says the same things at 8am and 10pm. Even one morning greeting ("Доброе утро" vs. afternoon default) makes the world feel alive. Visit-count variation allows Galina to comment "Вы снова здесь" (You're here again) after several visits, acknowledging the player's history.

---

### TASK-085
**title:** [ALIVENESS] NPC relationship tiers for Artyom, Lena, Fatima, Konstantin, Alina — stranger/acquaintance/friend progression
**track:** BUILD
**status:** BACKLOG
**priority:** P2
**depends_on:** [TASK-074, TASK-074b]
**assigned_agents:** [architect, content-writer, linguist, coder, reviewer, playtester, git]
**reads:** [app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js, app/storage.js, REFERENCE-DIALOGUE.md]
**writes:** [app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js, app/storage.js]
**done_when:** Each of the 5 non-apartment NPCs (Artyom, Lena, Fatima, Konstantin, Alina) has: (1) `updateNpcTier(progress, npcId)` helper in their dialogue file mirroring `APARTMENT_DIALOGUE.updateGalinaTier`, promoting tier 0→1 at 3 visits, tier 1→2 at 7 visits; (2) at minimum 2 VARIATIONS with `{ tier: 1 }` trigger that use "ты" address form and reference prior interaction; (3) tier cached in scene `create()` and injected into TutorAI persona; (4) tier saved in `_onDialogueEnd`; (5) Playwright smoke test confirms no crash on return visit with `tier: 1` seeded progress.
**notes:** [ALIVENESS] [EXPERIENCE SCAN] Only Galina has a relationship tier system. After visiting the park 10 times, Artyom still greets the player as a complete stranger — "Привет! Ты новенький?" Per REFERENCE-DIALOGUE.md §1: "three dialogue tiers minimum — lines at each tier should reference shared history." The вы→ты shift is itself a Russian language lesson (formal/informal register) that players experience before understanding grammatically. Without tiers, locations feel exhausted after one session and players have no relational reason to return. This task mirrors the TASK-074/074b/TASK-083 pipeline for all non-apartment scenes. The content-writer adds 2 tier-1 VARIATIONS per NPC; the coder wires tier storage and persona injection; linguist verifies register transitions.

---

### TASK-086
**title:** [GAME_FEEL] Wire active production moments — at least one inputPrompt per location that requires player to TYPE Russian
**track:** CONTENT
**status:** BACKLOG
**priority:** P2
**depends_on:** [TASK-075]
**assigned_agents:** [content-writer, linguist, coder, reviewer, playtester, git]
**reads:** [app/game/content/apartment-dialogue.js, app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, app/game/systems/StoryMissions.js, REFERENCE-GAMEDESIGN.md]
**writes:** [app/game/content/apartment-dialogue.js, app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js]
**done_when:** At least one VARIATION per location (6 locations total) contains a line with `inputPrompt: 'Type the Russian word...'` that prompts the player to type a vocabulary word. The NPC responds to `__typed__` choice with a recast-style reaction (if correct: praise; if wrong: neutral recast with correct form). StoryMissions `story:apartment:2` ("learn 5 greeting words") uses an inputPrompt for at least one word. All 6 inputPrompt exchanges tested in Playwright: render text input, accept Enter, dispatch `__typed__` choice, NPC response appears.
**notes:** [GAME_FEEL] TASK-075 added the `inputPrompt` field to the dialogue system (dialogue.js renders a text input, Enter dispatches `__typed__` choice) but NO content file uses it. Per REFERENCE-GAMEDESIGN.md §6: "production beats reception — learners who use new words retain them significantly better than those who only encounter them. Design at least one active production moment per vocabulary word." Without inputPrompt usage, every player interaction is a choice button click — the player never produces Russian text. The design spec was always "player must say or type the word, not just click through." This task writes the content that activates the system. Low-stakes: NPC reacts warmly to correct answers, uses recast for wrong answers per REFERENCE-DIALOGUE.md §4.

---

### TASK-087
**title:** [ALIVENESS] Scripted return-visit VARIATIONS for park/cafe/market/station/police NPCs — 3 variations each with tier/temporal triggers
**track:** CONTENT
**status:** BACKLOG
**priority:** P2
**depends_on:** [TASK-084, TASK-085]
**assigned_agents:** [content-writer, linguist, git]
**reads:** [app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js, REFERENCE-DIALOGUE.md, REFERENCE-GAMEDESIGN.md, CLAUDE-VISION.md]
**writes:** [app/game/content/park-dialogue.js, app/game/content/cafe-dialogue.js, app/game/content/market-dialogue.js, app/game/content/station-dialogue.js, app/game/content/police-dialogue.js]
**done_when:** Each of the 5 non-apartment content files gains a minimum 3 new VARIATIONS beyond the first-visit 'opening': (1) a morning/evening time-of-day variation (using `new Date().getHours()` in the trigger function), (2) a tier-1 acquaintance variation where the NPC addresses the player with "ты" and references the first visit, (3) a high-visit-count variation (visitCount >= 5) where the NPC mentions an unprompted life detail (their schedule, a complaint, something unrelated to the player). All variations pass the REFERENCE-DIALOGUE.md voice consistency tests: identifiable without the name tag, reference established backstory, no contradiction with world facts.
**notes:** [ALIVENESS] [EXPERIENCE SCAN] The TASK-084 variation selector is wired and working — it will select and display scripted VARIATIONS from content files on return visits. But content files for park/cafe/market/station/police have only their opening first-visit VARIATION (or no return-visit content at all). Without this content, the selector always falls through to TutorAI on return visits, meaning no scripted вы→ты shift, no cross-NPC gossip callbacks, no temporal flavor. Per REFERENCE-GAMEDESIGN.md §4: "minimum 3 variation triggers per NPC." This is a pure content task — no code changes required. Voice briefs from REFERENCE-DIALOGUE.md §1 must be applied per NPC. Linguist verifies all Russian is natural and A1-appropriate.

---

### BUG-004
**title:** Journal does not open on J key press — Phaser keyboard intercept blocks window listener
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/ui/hud.js, app/game/main.js]
**writes:** [app/ui/hud.js]
**done_when:** Pressing J key while on the game canvas opens the journal overlay (`.journal` gets `is-open` class). Tests `gameplay.spec.js > Journal > opens on J key press`, `closes on second J key press`, and `closes on Escape key when open` all pass on both desktop and mobile.
**notes:** Found by playtester 2026-03-31. 6 tests fail (3 per viewport). After clicking the Phaser canvas, keyboard events dispatched by Playwright go to the focused canvas element. Phaser's InputPlugin intercepts keydown on the canvas before they bubble to `window`, so `hud.js`'s `window.addEventListener('keydown', _onKeyDown)` at line 165 never fires. Fix: move the J-key listener from `window` to `document` in `hud.js`, or add `disableGlobalCapture` to Phaser's keyboard config in `app/game/main.js`, or use `document.addEventListener` which receives the event before Phaser can stop propagation. Failing tests: `tests/gameplay.spec.js > Journal > opens on J key press`.

---

### BUG-005
**title:** dialogue:end event does not self-close the overlay — DialogueUI does not listen to its own end event
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/ui/dialogue.js]
**writes:** [app/ui/dialogue.js]
**done_when:** Dispatching `window.dispatchEvent(new CustomEvent('dialogue:end'))` causes `#dialogue-overlay` to lose the `is-active` class within 2000ms. Test `gameplay.spec.js > Dialogue overlay > dialogue:end event closes the overlay` passes on both desktop and mobile.
**notes:** Found by playtester 2026-03-31. 2 tests fail. `DialogueUI` (`app/ui/dialogue.js`) only listens to `EVENTS.DIALOGUE_END` to run `_onDialogueClose` (physics resume). It does NOT call `close()` when it receives `dialogue:end` externally. `close()` is the only function that removes `is-active` from `#dialogue-overlay` (via CSS transitionend callback at line 280-283). When something externally fires `dialogue:end` the overlay stays open. Fix: in `_init()`, add a listener for `EVENTS.DIALOGUE_END` that calls `close()` if the overlay is currently `is-active` (guard against infinite loop since `close()` also dispatches `EVENTS.DIALOGUE_END`). Failing test: `tests/gameplay.spec.js > Dialogue overlay > dialogue:end event closes the overlay`.

---

### BUG-006
**title:** persistence.spec.js uses about:blank to clear localStorage — SecurityError in Chromium sandbox
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [tests/persistence.spec.js]
**writes:** [tests/persistence.spec.js]
**done_when:** Tests `Progress storage > progress has expected default shape` and `Vocabulary storage > vocabulary key exists after boot (may be empty array)` pass on both desktop and mobile without SecurityError.
**notes:** Found by playtester 2026-03-31. 4 tests fail. `persistence.spec.js` lines 24-25 and 64-65 navigate to `about:blank` then call `page.evaluate(() => localStorage.clear())`. Chromium denies `localStorage` access on `about:blank` (`SecurityError: Access is denied for this document`). Fix: replace the `about:blank` + `localStorage.clear()` pattern with `page.addInitScript(() => { localStorage.clear(); })` before `waitForGameReady(page)`, which runs before page scripts on the next navigation to `/`. Failing tests: `tests/persistence.spec.js > Progress storage > progress has expected default shape`, `tests/persistence.spec.js > Vocabulary storage > vocabulary key exists after boot`.

---

### BUG-007
**title:** settings:volume:change window event does not trigger saveSettings — wrong event mechanism and localStorage-only assumption
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [tests/persistence.spec.js, app/ui/settings.js, app/storage.js]
**writes:** [tests/persistence.spec.js]
**done_when:** Test `Settings storage > settings key is written when a setting changes` passes on both desktop and mobile.
**notes:** Found by playtester 2026-03-31. 2 tests fail. Two compounding issues: (1) `persistence.spec.js:91` dispatches `settings:volume:change` window event, but `settings.js` has no window event listener for inbound settings changes — `_onVolumeChange()` is wired to the DOM slider `input` event only. Dispatching a window event bypasses the save entirely. (2) Even if the save were triggered, `storage.js kvSet()` (lines 23-35) only writes to `localStorage` as a fallback when `/api/kv` POST fails — if the dev server returns 200, `localStorage` is never written, so `localStorage.getItem('settings')` stays null. Fix: update the test to interact with the volume slider DOM element directly (triggering `_onVolumeChange`), and either (a) mock `/api/kv` to return a non-200 so localStorage fallback fires, or (b) update the test assertion to check the KV API state instead of localStorage. Failing test: `tests/persistence.spec.js > Settings storage > settings key is written when a setting changes`.

---

### BUG-011
**title:** Journal never opens on J key press — _onKeyDown only handles close, no open branch
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/ui/journal.js]
**writes:** [app/ui/journal.js]
**done_when:** Pressing J while the journal is closed adds `is-open` to `.journal`. Tests `gameplay.spec.js > Journal > opens on J key press`, `closes on second J key press`, and `closes on Escape key when open` pass on both desktop and mobile.
**notes:** Found by playtester 2026-03-31. 6 tests fail (3 per viewport). BUG-004 was previously filed against hud.js, but code inspection shows the gap is in `journal.js _onKeyDown` (line 251-257): the handler returns early when `!_open`, so J-key only ever closes the journal, never opens it. No other code path dispatches `EVENTS.JOURNAL_OPEN` on J key press. Fix: in `_onKeyDown`, add an else branch — when `!_open && e.code === 'KeyJ'`, call `open()`. The existing window listener in `_init` (line 294) already receives the event; only the open branch is missing. Supersedes BUG-004 (same symptom, correct root cause now identified). Failing tests: `tests/gameplay.spec.js > Journal > opens on J key press`.

---

### BUG-012
**title:** localStorage.progress missing chapter/unlockedLocations/npcRelationships — default shape never persisted on first boot
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/storage.js, app/config.js]
**writes:** [app/storage.js]
**done_when:** After clearing localStorage and booting, `localStorage.getItem('progress')` parses to an object containing `chapter: 1`, `unlockedLocations: ['apartment']`, `completedMissions: []`, and `npcRelationships: {}`. Test `persistence.spec.js > Progress storage > progress has expected default shape` passes on both desktop and mobile.
**notes:** Found by playtester 2026-03-31. 2 tests fail. `getProgress()` in `storage.js` line 40 returns `DEFAULT_PROGRESS` in-memory when no stored value exists, but never writes it to localStorage. `saveProgress()` is only called by `markIntroSeen()`, which merges `hasSeenIntro:true` into an otherwise empty object and writes that minimal object. Result: `localStorage.progress` = `{ hasSeenIntro: true, lastSession: "..." }` after boot. Fix: in `getProgress()`, when `data` is null, call `kvSet(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS)` (fire-and-forget) before returning the default, so the first boot seeds localStorage with the full default shape. Failing test: `tests/persistence.spec.js > Progress storage > progress has expected default shape`.

---

### BUG-013
**title:** vocabulary:new event does not write to localStorage — test uses wrong trigger event
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [tests/persistence.spec.js, app/ui/journal.js, app/storage.js]
**writes:** [tests/persistence.spec.js]
**done_when:** After boot, dispatching a trigger that exercises the vocabulary write path causes `localStorage.getItem('vocabulary')` to return a non-null value. Test `persistence.spec.js > Vocabulary storage > vocabulary key exists after boot (may be empty array)` passes on both desktop and mobile.
**notes:** Found by playtester 2026-03-31. 2 tests fail. `EVENTS.VOCABULARY_NEW` (`vocabulary:new`) is an outbound notification — nothing listens to it to trigger a localStorage write. The actual write path is: `dialogue:end` event with `detail.vocab` array → `journal.js _onDialogueEnd` → `addVocabulary()` → `kvSet('vocabulary', ...)`. Fix: update `persistence.spec.js` line 67-70 to dispatch `dialogue:end` with `detail: { vocab: [{ russian: 'привет', translation: 'hello' }] }` instead of `vocabulary:new`. Failing test: `tests/persistence.spec.js > Vocabulary storage > vocabulary key exists after boot (may be empty array)`.

---

### BUG-014
**title:** Settings volume slider query uses [data-setting="volume"] but markup has no data-setting attribute
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [tests/persistence.spec.js, app/ui/settings.js]
**writes:** [tests/persistence.spec.js]
**done_when:** The volume slider is found by the test, its value is set to "50", and `expect(sliderValue).toBe("50")` passes on both desktop and mobile. Test `persistence.spec.js > Settings storage > volume slider value changes when interacted with` passes.
**notes:** Found by playtester 2026-03-31. 2 tests fail. `persistence.spec.js` line 91 queries `input[type="range"][data-setting="volume"]` but `settings.js` line 78 renders `<input id="volume-slider" class="settings-slider" type="range" ...>` with no `data-setting` attribute. Selector returns null, slider.value is never set. This supersedes BUG-007 (same symptom, correct root cause now identified — it is a selector mismatch, not an event mechanism issue). Fix: update the test selector to `#volume-slider`, or add `data-setting="volume"` to the input in settings.js. Failing test: `tests/persistence.spec.js > Settings storage > volume slider value changes when interacted with`.

---

### BUG-015
**title:** Journal never opens on J key — WorldScene and journal.js both handle KeyJ, causing immediate open+close
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/game/scenes/WorldScene.js, app/ui/journal.js]
**writes:** [app/game/scenes/WorldScene.js]
**done_when:** Pressing J opens the journal (`locator('.journal')` has class `is-open`), pressing J again closes it, pressing Escape while open closes it. Tests `gameplay.spec.js > Journal > opens on J key press`, `closes on second J key press`, and `closes on Escape key when open` pass on both desktop and mobile (6 tests total).
**notes:** Found by playtester 2026-03-31. WorldScene.js lines 150–152 add a Phaser `down` listener that dispatches `journal:open` on KeyJ. `journal.js` line 296 also listens for `window keydown` with `e.code === 'KeyJ'` and toggles open/close. When J is pressed: the `journal:open` event fires first → `open()` sets `_open = true`; then `_onKeyDown` fires → sees `_open === true` → calls `close()`. Journal opens and immediately closes. Fix: remove the Phaser keyboard listener from WorldScene.js (lines 150–152 and the destroy block at 234–236) and let `journal.js` own all J-key handling exclusively. Failing tests: `tests/gameplay.spec.js > Journal > opens on J key press` (×2), `closes on second J key press` (×2), `closes on Escape key when open` (×2).

---

### BUG-016
**title:** Progress default-shape test fails — localStorage contaminated with partial `{ hasSeenIntro: true }` from prior boot sequence
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [tests/persistence.spec.js, app/storage.js]
**writes:** [tests/persistence.spec.js]
**done_when:** `expect(progress).toMatchObject({ chapter: 1, completedMissions: expect.any(Array), npcRelationships: expect.any(Object), unlockedLocations: expect.arrayContaining(['apartment']) })` passes on both desktop and mobile. Test `persistence.spec.js > Progress storage > progress has expected default shape` passes.
**notes:** Found by playtester 2026-03-31. `storage.js` `kvSet()` line 24 always writes through to localStorage regardless of API mock. The game's boot/intro sequence calls `markIntroSeen()` → `saveProgress({ hasSeenIntro: true })` → overwrites `localStorage.progress` with a partial object. When the "default shape" test later reads `localStorage.progress` (KV API mocked to null), it finds only `{ hasSeenIntro: true }`. Fix: in `tests/persistence.spec.js`, clear `localStorage.progress` before the shape assertion (`await page.evaluate(() => localStorage.removeItem('progress'))`) and then re-read so `getProgress()` returns a fresh `DEFAULT_PROGRESS`. Failing test: `tests/persistence.spec.js > Progress storage > progress has expected default shape` (×2, desktop + mobile).

---

### BUG-017
**title:** Playwright workers saturate `npx serve` — 26 cascade timeouts after test ~50
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [playwright.config.js]
**writes:** [playwright.config.js]
**done_when:** All 88 tests complete without `page.goto` or `page.waitForSelector` timeouts caused by server saturation. Full run achieves 84 passing, 0 failing, 4 skipped.
**notes:** Found by playtester 2026-03-31. With `workers: 8` and 2 projects (desktop + mobile), Playwright runs up to 6 simultaneous workers. Each worker loads Phaser (heavy asset + WebGL init) from `npx serve`, a single-threaded static server. After ~50 concurrent page loads, the server stops responding within the 40s timeout — all subsequent `page.goto('/')` calls time out. 26 tests fail as cascade. Fix: set `workers: 2` (or `fullyParallel: false` with `workers: 1`) in playwright.config.js so only one Phaser boot runs at a time. Application code is not at fault. Failing tests: all tests after the 50th in the run order including `Pause menu`, `HUD`, `Scene state`, `Input — no crash > movement/E/J/Escape`, `Mobile layout > dialogue box`.

---

### BUG-018
**title:** Journal does not open on J key press — Phaser keyboard plugin not reliable in Playwright
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/ui/journal.js]
**writes:** [app/ui/journal.js]
**done_when:** `tests/gameplay.spec.js > Journal > opens on J key press`, `closes on second J key press`, and `closes on Escape key when open` all pass on both desktop and mobile (6 tests total, currently 6 failing).
**notes:** Found by playtester 2026-03-31. `journal.js` `_onKeyDown` (lines 251–256) handles only `Escape` — there is no `KeyJ` branch. Opening via J is delegated to `WorldScene._journalKey.on('down', ...)` (WorldScene.js lines 150–153) which dispatches `EVENTS.JOURNAL_OPEN`. Phaser's `addKey().on('down')` callback does not fire when Playwright sends `page.keyboard.press('KeyJ')` after clicking the canvas, so the journal never opens. The event-based path (`journal:open` custom event dispatched directly) works fine. Fix: add `e.code === KEYBOARD_SHORTCUTS.JOURNAL` branch to `_onKeyDown` in `app/ui/journal.js` to toggle the journal via a native DOM listener, making J-key handling independent of Phaser. Failing tests: `tests/gameplay.spec.js > Journal > opens on J key press` (×2), `closes on second J key press` (×2), `closes on Escape key when open` (×2).

---

### BUG-019
**title:** Journal J-key opens and immediately closes — dual keydown handlers cancel each other
**track:** BUG
**status:** DONE
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/ui/journal.js, app/ui/hud.js]
**writes:** [app/ui/journal.js]
**done_when:** `tests/gameplay.spec.js > Journal > opens on J key press`, `closes on second J key press`, and `closes on Escape key when open` all pass on both desktop and mobile (6 tests total, currently 6 failing). Target: 84 passing, 0 failing, 4 skipped.
**notes:** Found by playtester 2026-03-31. Two separate `document` keydown handlers both respond to `KeyJ`. `app/ui/hud.js:127-135` dispatches `EVENTS.JOURNAL_OPEN` when `KeyJ` fires. `app/ui/journal.js:251-258` also listens for `KeyJ` on `document` and calls `open()` directly. On a single keypress both fire synchronously in the same event loop tick: hud.js calls `open()` (sets `_open=true`, adds `.is-open`), then journal.js keydown fires and calls `open()` again which sees `_open===true` and immediately calls `close()` (removes `.is-open`). Journal opens and closes before Playwright can observe the class. Fix: remove the `_onKeyDown` function and its `document.addEventListener('keydown', _onKeyDown)` registration from `app/ui/journal.js` entirely — rely solely on the `EVENTS.JOURNAL_OPEN` / `EVENTS.JOURNAL_CLOSE` event path that hud.js and menu.js already use. Keep the Escape handler only if no other module covers it. Failing tests: `tests/gameplay.spec.js > Journal > opens on J key press` (×2), `closes on second J key press` (×2), `closes on Escape key when open` (×2).

---

### BUG-024
**title:** Tap-to-advance blocked when advance hint shown — ApartmentScene first-visit onboarding dead-end (body click)
**track:** BUG
**status:** DONE
**priority:** P0
**depends_on:** [BUG-023]
**assigned_agents:** fixer, reviewer
**reads:** [app/ui/dialogue.js]
**writes:** [app/ui/dialogue.js]
**done_when:** `await page.locator('.dialogue-body').click({ position: { x: 80, y: 30 }, force: true })` followed by `expect(page.locator('.dialogue-choice-btn')).toHaveCount(3, { timeout: 2000 })` passes in test "1-4 clicking dialogue body advances narration to scripted choices".
**notes:** [RECOVERY] [PLAYABILITY] The BUG-023 fix added a `.dialogue-advance-hint` `<p>` element inside `_choices` when no choices are present. However `_onTapAdvance` in `dialogue.js` guards with `if (_choices.children.length > 0) { return; }` without exempting the advance hint. So a click on `.dialogue-body` never fires `__advance__` as long as the hint is visible. The `_onKeyDown` handler already exempts the hint (`!_choices.querySelector('.dialogue-advance-hint')`), so Enter key works. Body click does not. Confirmed by playthrough test: "Block 1 – Apartment first visit > 1-4 clicking dialogue body advances narration to scripted choices". Error: `expect(locator('.dialogue-choice-btn')).toHaveCount(3)` — Expected: 3, Received: 0, Timeout: 2000ms. Tests 1-5, 1-6, 1-7 also fail as cascade.

---

### BUG-025
**title:** Location unlock toasts overwritten by controls hint — player never sees "park/cafe/market/station/police is now open"
**track:** BUG
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** fixer, reviewer
**reads:** [app/game/scenes/WorldScene.js, app/ui/hud.js]
**writes:** [app/game/scenes/WorldScene.js]
**done_when:** After entering ApartmentScene with seed `unlockedLocations: ['apartment']`, `expect(page.locator('#tutor-status')).toContainText(/park/i)` passes within 3s (and equivalents for cafe/market/station/police in their respective scenes).
**notes:** [PLAYABILITY] All 5 location-unlock toast tests (1-9, 2-9, 3-9, 4-9, 5-9) fail with `#tutor-status` showing "WASD / ↑↓←→ to move, E to talk" instead of the expected location name. The controls-hint toast fires synchronously on `location:enter` via a WorldScene listener that is not removed in `shutdown()`. When the new scene's `create()` dispatches `location:enter`, the stale WorldScene listener fires the controls hint, which lands in `#tutor-status` after the async unlock toast, overwriting it. Player enters every new location but never sees which location just unlocked. Confirmed by playthrough test: "1-9 park unlock toast fires on first apartment visit". Error: Expected pattern `/park/i`, Received string: `"WASD / ↑↓←→ to move, E to talk"`, Timeout: 5000ms.

---

### BUG-026
**title:** Return-visit JS-errors test times out — 6-scene iteration loop exceeds 40s default test timeout
**track:** BUG
**status:** DONE
**priority:** P2
**depends_on:** []
**assigned_agents:** fixer, reviewer
**reads:** [tests/playthrough.spec.js]
**writes:** [tests/playthrough.spec.js]
**done_when:** Test "7-errors no JS errors during return visits to all 6 scenes" completes within its timeout with 0 JS errors reported.
**notes:** [TEST INFRA] The "7-errors" test iterates all 6 scenes in one test body. Each `waitForSceneActive` has an 8s timeout; 6 scenes × ~9s = ~54s which exceeds the 40s default Playwright test timeout. Error: `page.evaluate: Test timeout of 40000ms exceeded`. Fix options: (a) split into per-scene error tests, or (b) add `test.setTimeout(90_000)` at the top of the test. NOTE: do NOT modify game source files. Confirmed by playthrough test: "Block 7 – Return visits (all complete) > 7-errors no JS errors during return visits to all 6 scenes". Error: `Test timeout of 40000ms exceeded` at `page.evaluate((k) => window.__GAME__.scene.start(k), key)`.

---

### TASK-078
**title:** ParkScene missing first-visit scripted dialogue — no auto-open, no NPC relationship save for Artyom
**track:** BUILD
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** fixer, reviewer
**reads:** [app/game/scenes/ParkScene.js, app/game/scenes/ApartmentScene.js]
**writes:** [app/game/scenes/ParkScene.js]
**done_when:** All six of these pass: "2-2 first-visit dialogue opens automatically within 2s", "2-3 advance hint visible", "2-4 clicking body advances narration", "2-5 all choices have English text", "2-6 first choice closes dialogue", "2-7 artyom.met saved to progress".
**notes:** [PLAYABILITY] ParkScene has no first-visit scripted flow. On first entry the player sees only empty park tiles — no NPC narration fires, no guided exchange introduces Artyom, and `progress.npcRelationships.artyom` is never set. Pattern to follow: ApartmentScene sections 7b + 11 + `_scriptedPhase` state machine + `_onDialogueEnd` save. Confirmed by playthrough test: "Block 2 – Park first visit > 2-2 first-visit dialogue opens automatically within 2s". Error: `expect(locator('#dialogue-overlay')).toHaveClass(/is-active/)` — Received: `""`, Timeout: 2000ms. Tests 2-3 through 2-7 also fail (same root cause).

---

### TASK-079
**title:** CafeScene missing first-visit scripted dialogue — no auto-open, no NPC relationship save for Lena
**track:** BUILD
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** fixer, reviewer
**reads:** [app/game/scenes/CafeScene.js, app/game/scenes/ApartmentScene.js]
**writes:** [app/game/scenes/CafeScene.js]
**done_when:** All six of these pass: "3-2 first-visit dialogue opens automatically within 2s", "3-3 advance hint visible", "3-4 clicking body advances narration", "3-5 all choices have English text", "3-6 first choice closes dialogue", "3-7 lena.met saved to progress".
**notes:** [PLAYABILITY] CafeScene has no first-visit scripted flow. Same missing pattern as ParkScene. Primary NPC to introduce: Lena (id: `lena`). Confirmed by playthrough test: "Block 3 – Café first visit > 3-2 first-visit dialogue opens automatically within 2s". Error: `expect(locator('#dialogue-overlay')).toHaveClass(/is-active/)` — Received: `""`, Timeout: 2000ms.

---

### TASK-080
**title:** MarketScene missing first-visit scripted dialogue — no auto-open, no NPC relationship save for Fatima
**track:** BUILD
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** fixer, reviewer
**reads:** [app/game/scenes/MarketScene.js, app/game/scenes/ApartmentScene.js]
**writes:** [app/game/scenes/MarketScene.js]
**done_when:** All six of these pass: "4-2 first-visit dialogue opens automatically within 2s", "4-3 advance hint visible", "4-4 clicking body advances narration", "4-5 all choices have English text", "4-6 first choice closes dialogue", "4-7 fatima.met saved to progress".
**notes:** [PLAYABILITY] MarketScene has no first-visit scripted flow. Primary NPC to introduce: Fatima (id: `fatima`). Confirmed by playthrough test: "Block 4 – Market first visit > 4-2 first-visit dialogue opens automatically within 2s". Error: `expect(locator('#dialogue-overlay')).toHaveClass(/is-active/)` — Received: `""`, Timeout: 2000ms.

---

### TASK-081
**title:** StationScene missing first-visit scripted dialogue — no auto-open, no NPC relationship save for Konstantin
**track:** BUILD
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** fixer, reviewer
**reads:** [app/game/scenes/StationScene.js, app/game/scenes/ApartmentScene.js]
**writes:** [app/game/scenes/StationScene.js]
**done_when:** All six of these pass: "5-2 first-visit dialogue opens automatically within 2s", "5-3 advance hint visible", "5-4 clicking body advances narration", "5-5 all choices have English text", "5-6 first choice closes dialogue", "5-7 konstantin.met saved to progress".
**notes:** [PLAYABILITY] StationScene has no first-visit scripted flow. Primary NPC to introduce: Konstantin (id: `konstantin`). Confirmed by playthrough test: "Block 5 – Station first visit > 5-2 first-visit dialogue opens automatically within 2s". Error: `expect(locator('#dialogue-overlay')).toHaveClass(/is-active/)` — Received: `""`, Timeout: 2000ms.

---

### TASK-082
**title:** PoliceScene missing first-visit scripted dialogue — no auto-open, no NPC relationship save for Alina
**track:** BUILD
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** fixer, reviewer
**reads:** [app/game/scenes/PoliceScene.js, app/game/scenes/ApartmentScene.js]
**writes:** [app/game/scenes/PoliceScene.js]
**done_when:** All six of these pass: "6-2 first-visit dialogue opens automatically within 2s", "6-3 advance hint visible", "6-4 clicking body advances narration", "6-5 all choices have English text", "6-6 first choice closes dialogue", "6-7 alina.met saved to progress".
**notes:** [PLAYABILITY] PoliceScene has no first-visit scripted flow. Primary NPC to introduce: Alina (id: `alina`). PoliceScene is the final location — no next-location unlock toast. Confirmed by playthrough test: "Block 6 – Police first visit > 6-2 first-visit dialogue opens automatically within 2s". Error: `expect(locator('#dialogue-overlay')).toHaveClass(/is-active/)` — Received: `""`, Timeout: 2000ms.

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

---

### BUG-029
**title:** WorldScene controls-hint toast overwrites location-unlock toasts in every test
**track:** BUG
**status:** DONE
**priority:** P2
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/game/scenes/WorldScene.js]
**writes:** [app/game/scenes/WorldScene.js]
**done_when:** All four of these pass on desktop: `flows.spec.js > Mission system flows > unlock toast appears when hud:toast fires`, `Block 1 – Apartment first visit > 1-9 park unlock toast fires on first apartment visit`, `Block 2 – Park first visit > 2-9 cafe unlock toast fires on first park visit`, `Block 3 – Café first visit > 3-9 market unlock toast fires on first cafe visit`. Each must show the expected text (`"The park is now open!"`, `/park/i`, `/cafe/i`, `/market/i`) in `#tutor-status` rather than "WASD / ↑↓←→ to move, E to talk".
**notes:** Found by playtester. `WorldScene._showControlsHint()` (`app/game/scenes/WorldScene.js:487`) fires a `hud:toast` via `setTimeout(..., 400)` on every fresh page load. The `sessionStorage` guard resets per Playwright test page, so the 400ms controls-hint toast fires in every test and overwrites any unlock toast that was dispatched earlier. Fix: check whether `#tutor-status` is already showing active content before firing the controls hint, or skip the controls hint if an unlock toast is queued. Do NOT modify test files. Failing tests: `tests/flows.spec.js > Mission system flows > unlock toast appears when hud:toast fires` (line 351), and the three block-level unlock toast tests.

---

### BUG-030
**title:** Loading placeholder '...' never resolves — dialogue stays frozen on '...' indefinitely when TutorAI is slow
**track:** BUG
**status:** DONE
**priority:** P2
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/ui/dialogue.js]
**writes:** [app/ui/dialogue.js]
**done_when:** `tests/experience.spec.js > Dialogue — no permanent placeholder text > dialogue text resolves away from placeholder within 3s` passes on both desktop and mobile. The test fires `dialogue:start` with `{ russian: '...', loading: true, choices: [] }` and asserts `.dialogue-russian` no longer shows only `'...'` within 3000ms. Fix must ensure the loading-state timeout (or existing fallback path) replaces `'...'` with a user-visible message (e.g. an error indicator or fallback line) when TutorAI has not responded within ~2.5s.
**notes:** Found by playtester. `tests/experience.spec.js:208`. The dialogue overlay correctly enters loading state with `'...'` placeholder, but the fallback timer does not fire or does not update `.dialogue-russian`. This may be a regression from BUG-021 (TutorAI loading state fallback, marked DONE 2026-04-01). The loading flag propagation path in `app/ui/dialogue.js` is the suspected location.

---

### BUG-031
**title:** Police scene — first choice click does not close dialogue; alina.met never saved
**track:** BUG
**status:** DONE
**priority:** P1
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester]
**reads:** [app/game/content/police-dialogue.js, app/game/scenes/PoliceScene.js]
**writes:** [app/game/content/police-dialogue.js, app/game/scenes/PoliceScene.js]
**done_when:** All of these pass on both desktop and mobile: `tests/playthrough.spec.js > Block 6 – Police first visit > 6-6 picking first choice closes dialogue`, `tests/playthrough.spec.js > Block 6 – Police first visit > 6-7 alina.met saved to progress after first exchange`. The dialogue overlay must lose `is-active` class within 3s of clicking the first `.dialogue-choice-btn` after the narration-to-choices transition. `progress.npcRelationships.alina.met` must be `true` after the exchange.
**notes:** BLOCKED after 2 playtester fails. Two remaining issues: (1) `_firstVisitScripted` flag likely not set so `_onDialogueEnd` save branch never entered for `alina.met` on desktop. (2) Mobile: PoliceScene never becomes active — `waitForSceneActive('Police')` times out, suspected joystick/input layer init stall. Changes made so far: `police-dialogue.js` has `isFinal: true` on response lines; `PoliceScene.js` choice dispatch fixed from `choiceId`/`text` to `id`/`russian`. Desktop 6-6 now passes. Needs deeper investigation of `_firstVisitScripted` wiring and mobile scene activation.

---

### BUG-032
**title:** [RECOVERY] Scripted choice does not close dialogue — regression from TASK-084 variation-selector wiring
**track:** BUG
**status:** BACKLOG
**priority:** P0
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/scenes/CafeScene.js, app/game/utils/variation-selector.js, app/ui/dialogue.js, app/config.js]
**writes:** [app/game/scenes/ApartmentScene.js, app/game/scenes/CafeScene.js]
**done_when:** All of these pass on desktop: `flows.spec.js > First-visit onboarding flow > picking a scripted choice closes the dialogue`, `playthrough.spec.js > Block 3 – Café first visit > 3-7 lena.met saved to progress after first exchange`. The `#dialogue-overlay` must lose `is-active` within 3s of clicking the first `.dialogue-choice-btn` after the narration-to-choices transition. Root cause: in the TASK-084 variation-selector path, when `isFinal: true` response is dispatched, the `_scriptedCloseTimer` fires `DIALOGUE_END` after 1500ms — but CafeScene (and other scenes) may not have wired `_onDialogueChoice` to handle the variation-phase response with `isFinal` correctly, causing the timer to never fire.
**notes:** [RECOVERY] Confirmed by test results 2026-04-03. `flows.spec.js` "picking a scripted choice closes the dialogue" fails: `#dialogue-overlay` stays `is-active` 3s after choice click. `playthrough.spec.js` "3-7 lena.met saved" fails with same root cause — dialogue never closes so `_onDialogueEnd` never fires, so `lena.met` is never saved. The TASK-084 variation-selector patch was applied to all 6 scenes, but the `_scriptedCloseTimer` wiring in the variation-choice path may be missing or broken in scenes other than ApartmentScene. Inspect `_onDialogueChoice` in all scenes — each must call `this.time.delayedCall(1500, () => window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END)))` when a variation response has `isFinal: true`.

---

### BUG-033
**title:** [RECOVERY] Loading placeholder '...' still shows after 3s — BUG-030 fix is a regression in HEAD
**track:** BUG
**status:** BACKLOG
**priority:** P0
**depends_on:** []
**assigned_agents:** [fixer, reviewer, playtester, git]
**reads:** [app/ui/dialogue.js, app/config.js]
**writes:** [app/ui/dialogue.js]
**done_when:** `tests/experience.spec.js > Dialogue — no permanent placeholder text > dialogue text resolves away from placeholder within 3s` passes on desktop. When `dialogue:start` fires with `{ russian: '...', loading: true, choices: [] }`, `.dialogue-russian` must display something other than `'...'` within 3000ms — either a fallback error line or a TutorAI response.
**notes:** [RECOVERY] BUG-030 was marked DONE (committed 2026-04-03) but the experience.spec.js desktop test still fails in the current results.json. The fallback timer in `app/ui/dialogue.js` either does not fire within the 3s window or does not update `.dialogue-russian` when it fires. Inspect the `_loadingFallbackTimer` or equivalent path: ensure it replaces the `'...'` text with a visible fallback line (e.g. "..." → "Подождите... / One moment...") when no TutorAI response arrives within 2500ms.

---

### BUG-034
**title:** [PLAYABILITY] Mobile Playwright worker crashes (STATUS_ACCESS_VIOLATION) — all mobile tests fail with worker process exit
**track:** BUG
**status:** BACKLOG
**priority:** P1
**depends_on:** []
**assigned_agents:** [fixer, playtester, git]
**reads:** [playwright.config.js, tests/helpers.js, app/game/main.js]
**writes:** [playwright.config.js]
**done_when:** All mobile-project specs that were passing before (smoke, gameplay, persistence, playthrough, experience, flows) pass again. Zero "worker process exited unexpectedly (code=3221225794)" errors in test results. At minimum: `smoke.spec.js > page loads without JavaScript errors` passes on mobile.
**notes:** [PLAYABILITY] Multiple mobile tests fail with `code=3221225794` (Windows STATUS_ACCESS_VIOLATION — a native process crash, not a test assertion failure). This is a Playwright/Chromium process crash on the Windows environment, unrelated to game logic. Possible causes: (1) mobile viewport + WebGL init triggers a GPU driver fault; (2) a Playwright version issue with the mobile project config; (3) a canvas size or pixel ratio calculation that causes a memory fault. Fix approach: try adding `--disable-gpu` launch args to the mobile project in playwright.config.js, or downgrade/upgrade Playwright browser binaries. Do NOT modify game code. If crash persists, mark mobile tests as `skip` with a documented note to avoid blocking the CI pipeline.

---

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
- BUG-002 | DONE | 2026-03-30 | Duplicate #hud-mute fix — reuse existing AudioManager button | ed2a84e
- TASK-052 | DONE | 2026-03-30 | Mobile dialogue UX — tap-to-advance, 48px touch targets | 8a05e14
- BUG-003 | DONE | 2026-03-30 | NPC hint hides on dialogue open — _dialogueOpen guard + CSS fallback removal | 9e92978
- TASK-048 | DONE | 2026-03-30 | Wire MissionGenerator to HUD + Journal, Russian empty state | 5265943
- TASK-047 | DONE | 2026-03-30 | NPC relationship tiers — stranger/acquaintance/friend dialogue | e3251d7
- TASK-060 | DONE | 2026-03-30 | Verify+fix overworld building tile frames, hatch overlay, dead props removed | 67ce7ea
- BUG-008, BUG-005, BUG-004, BUG-011, BUG-006, BUG-007, BUG-012, BUG-013, BUG-014, BUG-016, BUG-017 | DONE | 2026-03-31 | Interior scene exits, dialogue close, J-key journal, storage cache, test fixes | 09f50ac
- BUG-009 | DONE | 2026-03-31 | First-visit scripted dialogue race condition — _firstVisitScripted synchronous before async getProgress | 43c8b3d

## Session log

- 2026-04-01 · TASK-070 Galina life-detail variations — sister Lyudmila (trigger: galina_key_given) + plant story (trigger: tier 1). Linguist PASS 16 lines, 0 corrections. 7a9e911
- 2026-04-01 · TASK-069 Cross-location gossip — Galina→Artyom+café, Tamara→Lena, Boris→Galina. Linguist PASS after 1 fix (gendered past tense). e82207c
- 2026-04-01 · TASK-072 World-state completion overlay — amber rectangle over completed buildings, completedLocations in progress storage, LOCATION_COMPLETE event. 98 passing, 0 failing. ce47196
- 2026-04-01 · TASK-071 TutorAI vocab recognition — slice(-20) knownWords from storage injected into system prompt. 98 passing, 0 failing. d442b82
- 2026-04-01 · TASK-050 Daily NPC conversation limit — lastTalkedDate[npcId] UTC date tracking in progress storage, scripted farewell on repeat visit, alreadySpokenToday injected into TutorAI system prompt. 98 passing, 0 failing. 38f4ac5

- 2026-04-01 · TASK-064 Recovery playtest — 84 passing, 0 failing, 4 skipped. All BUG-008–BUG-019 fixes confirmed stable. Recovery queue cleared. sign-off
- 2026-04-02 · BUG-024 + BUG-025 — both resolved in ff16d2c (BUG-023's commit). _onTapAdvance hint-child guard + mobile Enter advance. flows.spec.js 40/40 desktop+mobile, smoke+gameplay 64/64. IMPROVEMENTS.md cleanup only.

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
- 2026-03-30 · TASK-052 Mobile dialogue UX — tap-to-advance on .dialogue-body, stopPropagation guard, cursor:pointer · 8a05e14
- 2026-03-30 · TASK-048 Wire MissionGenerator — MISSION_START dispatch, HUD load on init, Journal object rendering · 5265943
- 2026-03-30 · TASK-047 NPC relationship tiers — _getTier, async _startDialogue, 4 tier-tagged Galina variants · e3251d7
- 2026-03-30 · TASK-060 Building tile frames verified + hatch overlay, BUILD-ART playtester removed · cb4d60d
