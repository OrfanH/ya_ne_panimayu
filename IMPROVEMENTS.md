# IMPROVEMENTS.md

## Current task

(none — see Backlog for next priorities)

---

## Done

- BUG-010 | DONE | 2026-03-31 | Controls hint on WorldScene load | f40323e
- TASK-064 | DONE | 2026-04-01 | Recovery playtest — 84 passing, 0 failing, BUG-008–BUG-019 confirmed stable | sign-off

---

## Knowledge Base
- [4e0810e] REFERENCE-GAMEDESIGN.md, REFERENCE-PIXELART.md, REFERENCE-DIALOGUE.md added

---

## Recovery

*Tasks here run before any Backlog task, regardless of priority. Recovery mode clears this queue first.*

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

### P2 — Content depth
*Progression systems that enrich the experience. Implement after P1 is stable and tested.*

---

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
- BUG-002 | DONE | 2026-03-30 | Duplicate #hud-mute fix — reuse existing AudioManager button | ed2a84e
- TASK-052 | DONE | 2026-03-30 | Mobile dialogue UX — tap-to-advance, 48px touch targets | 8a05e14
- BUG-003 | DONE | 2026-03-30 | NPC hint hides on dialogue open — _dialogueOpen guard + CSS fallback removal | 9e92978
- TASK-048 | DONE | 2026-03-30 | Wire MissionGenerator to HUD + Journal, Russian empty state | 5265943
- TASK-047 | DONE | 2026-03-30 | NPC relationship tiers — stranger/acquaintance/friend dialogue | e3251d7
- TASK-060 | DONE | 2026-03-30 | Verify+fix overworld building tile frames, hatch overlay, dead props removed | 67ce7ea
- BUG-008, BUG-005, BUG-004, BUG-011, BUG-006, BUG-007, BUG-012, BUG-013, BUG-014, BUG-016, BUG-017 | DONE | 2026-03-31 | Interior scene exits, dialogue close, J-key journal, storage cache, test fixes | 09f50ac
- BUG-009 | DONE | 2026-03-31 | First-visit scripted dialogue race condition — _firstVisitScripted synchronous before async getProgress | 43c8b3d

## Session log

- 2026-04-01 · TASK-064 Recovery playtest — 84 passing, 0 failing, 4 skipped. All BUG-008–BUG-019 fixes confirmed stable. Recovery queue cleared. sign-off

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
