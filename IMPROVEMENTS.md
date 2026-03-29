# IMPROVEMENTS.md

## Current task

(empty)

---

## Backlog

---

### TASK-033
**title:** Kenney asset extraction — copy tilesets, fonts, UI pack into project
**track:** VISUAL
**status:** READY
**depends_on:** []
**assigned_agents:** [coder]
**reads:** [app/assets/, app/index.html, app/style.css, app/game/scenes/Boot.js]
**writes:** [app/assets/tilesets/roguelike-city.png, app/assets/tilesets/roguelike-indoors.png, app/assets/tilesets/roguelike-characters.png, app/assets/fonts/KenneyPixel.ttf, app/assets/fonts/KenneyMini.ttf, app/assets/ui/ui-pack.png, app/index.html, app/game/scenes/Boot.js]
**done_when:**
- `app/assets/tilesets/roguelike-city.png` extracted from `kenney_roguelike-modern-city.zip → Tilemap/tilemap_packed.png`
- `app/assets/tilesets/roguelike-indoors.png` extracted from `kenney_roguelike-indoors.zip → Tilesheets/roguelikeIndoor_transparent.png`
- `app/assets/tilesets/roguelike-characters.png` extracted from `kenney_roguelike-characters.zip → Spritesheet/roguelikeChar_transparent.png`
- `app/assets/fonts/KenneyPixel.ttf` extracted from `kenney_kenney-fonts.zip → Fonts/Kenney Pixel.ttf`
- `app/assets/fonts/KenneyMini.ttf` extracted from `kenney_kenney-fonts.zip → Fonts/Kenney Mini.ttf`
- `app/assets/ui/ui-pack.png` extracted from `kenney_ui-pack-pixel-adventure (1).zip → Tilesheets/Small tiles/Thick outline/tilemap_packed.png`
- Boot.js preloads: key `city` (frameWidth:16, frameHeight:16, spacing:1), key `indoors` (same spec), key `chars` (same spec)
- `app/index.html` adds `@font-face` declarations for KenneyPixel and KenneyMini pointing to `assets/fonts/`
- Existing `urban` spritesheet load and all player walk animations left untouched
**notes:** Source zips are in C:\Users\ORfan\Downloads\. roguelike-city is 37×28 tiles with 1px spacing (different from `urban` 27×18 with 0px spacing — keep both). roguelike-indoors and roguelike-characters are also 16×16 with 1px spacing. Fonts load via CSS @font-face, not Phaser asset load. Do NOT use kenney_pixel-ui-pack.zip — not in the approved stack.

---

### TASK-034
**title:** Overworld map — replace programmatic rects with roguelike-city tiles
**track:** VISUAL
**status:** READY
**depends_on:** [TASK-033]
**assigned_agents:** [pixel-artist, coder]
**reads:** [app/game/scenes/WorldScene.js, app/game/systems/MapBuilder.js, app/assets/tilesets/roguelike-city.png]
**writes:** [app/game/scenes/WorldScene.js, app/game/systems/MapBuilder.js]
**done_when:**
- Ground layer: grass tile frames from `city` spritesheet replace the checkerboard `this._tileKeys.grassDark / grass` colored images. At minimum two grass tile variants for checker effect.
- Path network: sidewalk/pavement tile frames replace the filled `0xC8A96E` Graphics rects.
- Each of the 6 buildings uses distinct tile compositions drawn from roguelike-city building tiles. Apartment = residential brick; Park = green/hedge tiles; Cafe = shopfront tiles; Market = market stall tiles; Station = platform/transit tiles; Police = institutional tiles. Buildings must remain recognisable as distinct location types.
- Locked overlay and padlock glyph logic kept exactly as-is (no changes to collision or zone detection).
- Building labels retained; font updated to `'Kenney Pixel'` (loaded by TASK-033).
- Tile index mapping documented in a comment block at the top of WorldScene.js.
**notes:** pixel-artist writes a tile-index spec first (which city frames map to ground/paths/each building type). Coder implements from that spec. roguelike-city frame formula: `N = row * 37 + col` (37 tiles per row, 0-indexed). Sample.png in the zip shows the full sheet layout. Do NOT modify the collision system, zone detection, or unlock logic.

---

### TASK-035
**title:** Interior rooms — replace bare floor/wall graphics with roguelike-indoors tiles
**track:** VISUAL
**status:** READY
**depends_on:** [TASK-033]
**assigned_agents:** [pixel-artist, coder]
**reads:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js, app/assets/tilesets/roguelike-indoors.png]
**writes:** [app/game/scenes/ApartmentScene.js, app/game/scenes/ParkScene.js, app/game/scenes/CafeScene.js, app/game/scenes/MarketScene.js, app/game/scenes/StationScene.js, app/game/scenes/PoliceScene.js]
**done_when:**
- Each interior scene replaces its single `gfx.fillRect` floor and `gfx.strokeRect` wall-border with tiled layers from the `indoors` spritesheet.
- Floor tiles per location: Apartment = wood plank tiles; Park = stone/grass floor; Cafe = checkered floor tiles; Market = stone floor tiles; Station = concrete/platform tiles; Police = institutional floor tiles.
- Wall perimeter tiles from indoors pack replace the solid-colour border stroke.
- At least 2–3 furniture or prop tiles placed per room from the indoors pack (e.g. desk, bookshelf, counter, bench) to make each room feel distinct.
- All NPC spawn positions and player spawn positions remain unchanged.
- World bounds, collision, camera follow untouched.
- Tile index mapping commented at top of each modified scene file.
**notes:** pixel-artist writes a per-room tile spec first. roguelike-indoors sheet is 16×16 tiles with 1px spacing. The transparent PNG variant is used. Do NOT change scene logic, event listeners, or NPC/player wiring.

---

### TASK-036
**title:** Kenney Pixel + Mini fonts — replace all monospace/Google Fonts with Kenney fonts
**track:** VISUAL
**status:** READY
**depends_on:** [TASK-033]
**assigned_agents:** [coder]
**reads:** [app/index.html, app/tokens.css, app/style.css, app/game/scenes/Boot.js, app/game/scenes/WorldScene.js, app/ui/hud.js, app/ui/dialogue.js, app/ui/journal.js, app/ui/settings.js]
**writes:** [app/index.html, app/tokens.css, app/style.css, app/game/scenes/Boot.js, app/game/scenes/WorldScene.js, app/ui/hud.js, app/ui/dialogue.js, app/ui/journal.js, app/ui/settings.js]
**done_when:**
- `app/index.html`: Google Fonts `<link>` tags removed. `@font-face` blocks (already added in TASK-033) confirmed present for KenneyPixel and KenneyMini.
- `app/tokens.css`: `--font-game: 'Kenney Pixel', monospace` and `--font-hud: 'Kenney Mini', monospace` defined. Old Google Font family names removed.
- All `fontFamily: 'monospace'` in Phaser scene text objects replaced with `'Kenney Pixel'`.
- Boot.js loading screen title uses `'Kenney Pixel'`.
- WorldScene building labels use `'Kenney Pixel'`.
- HTML overlay UI (hud.js, dialogue.js, journal.js, settings.js): CSS font-family changed to `var(--font-game)` for body text, `var(--font-hud)` for compact labels.
- No Plus Jakarta Sans or Crimson Pro or Inter references remain anywhere.
- `image-rendering: pixelated` applied to canvas element in CSS (if not already present).
**notes:** Kenney Pixel is the dialogue/scene font. Kenney Mini is the compact HUD/label font. Both have monospace fallback. The fonts are CC0 and local — no CDN dependency.

---

### TASK-037
**title:** Dialogue UI pixel skin — stone panel border from UI adventure pack
**track:** VISUAL
**status:** READY
**depends_on:** [TASK-036]
**assigned_agents:** [pixel-artist, coder]
**reads:** [app/ui/dialogue.js, app/style.css, app/tokens.css, app/assets/ui/ui-pack.png]
**writes:** [app/style.css, app/assets/ui/]
**done_when:**
- `.dialogue-box` background replaced with a pixel-art 9-slice stone panel from the UI adventure `Thick outline` tilesheet. Stone/silver/grey tones only — never the brown wooden variant.
- The 9-slice is implemented via CSS `border-image`. Corner radius removed.
- Response choice buttons (`.dialogue-choices button`) restyled with stone button tiles — flat stone state and pressed state on click.
- `.dialogue-speaker-name` uses Kenney Pixel, white or light-grey on stone.
- `.dialogue-russian` (primary Russian text) uses Kenney Pixel at readable size.
- `.dialogue-translation` (English below) uses Kenney Mini, muted colour.
- `.dialogue-portrait` placeholder div set to `display: none` — do not remove the element.
- Dialogue box slides in from bottom as before (animation kept).
- Visual verified on desktop (1280×720) and mobile (375px wide) — no overflow, no clipped text.
**notes:** Stone/silver = the grey-toned 9-slice tiles (not the brown/wooden ancient tiles). If specific tile coordinates are unclear from the sheet, use the individual tile PNGs from `Tiles/outline/` subfolder of the zip as reference. Do NOT use kenney_pixel-ui-pack.zip.

---

### TASK-038
**title:** HUD + Journal + Settings pixel skin — consistent stone/pixel aesthetic
**track:** VISUAL
**status:** READY
**depends_on:** [TASK-037]
**assigned_agents:** [coder]
**reads:** [app/ui/hud.js, app/ui/journal.js, app/ui/settings.js, app/style.css, app/tokens.css, app/assets/ui/ui-pack.png]
**writes:** [app/style.css, app/ui/hud.js]
**done_when:**
- HUD location name pill (`#hud-location`) uses Kenney Mini font, stone/dark background. Minimal — max 2-tile-height tall.
- Mission indicator (`#hud-mission`) same stone styling, compact single line.
- Journal panel (`.journal-overlay`) uses stone 9-slice border matching dialogue box aesthetic. Tab buttons use stone pill style.
- Settings panel (`.settings-overlay`) matches journal stone style.
- Mute button (`#hud-mute`) uses a clean pixel icon style consistent with the stone palette.
- No rounded-rect CSS remaining in any HUD or overlay element.
- All panels use `--font-game` or `--font-hud` — no system fonts.
**notes:** All UI panels must look like they came from the same stone/silver UI kit. No mixing of styles. HUD must remain non-intrusive (see VISION.md).

---

### TASK-039
**title:** NPC overworld sprites — roguelike-characters composable layers
**track:** VISUAL
**status:** READY
**depends_on:** [TASK-033]
**assigned_agents:** [pixel-artist, coder]
**reads:** [app/game/entities/NPC.js, app/game/scenes/WorldScene.js, app/assets/tilesets/roguelike-characters.png]
**writes:** [app/game/entities/NPC.js]
**done_when:**
- `app/assets/tilesets/roguelike-characters.png` confirmed present (extracted in TASK-033)
- Boot.js preloads `chars` spritesheet confirmed (done in TASK-033)
- NPC.js `_createTexture()` replaced with frame-based sprite draws from the `chars` sheet
- Each of the 10 NPCs has a visually distinct appearance using different frame combinations
- NPC sprites use composable layers where available (body + clothing + accessory frames)
- All NPC interaction radii, name labels, and [E] indicators unchanged
**notes:** pack: kenney_roguelike-characters.zip → Spritesheet/roguelikeChar_transparent.png. Sheet is 16×16 tiles with 1px spacing. pixel-artist writes a per-NPC frame assignment spec first; coder implements. Do NOT introduce any other character art source.

---

### TASK-040
**title:** Full playtest — end-to-end game loop verification
**track:** BUILD
**status:** READY
**depends_on:** [TASK-038]
**assigned_agents:** [playtester]
**reads:** [app/index.html, all scene and UI files]
**writes:** [.claude/handoffs/play-report.md]
**done_when:** Playtester completes a full new-player run: onboarding → apartment → park → cafe → market → station → police → chapter tests → graduation. play-report.md filed with: (1) any broken interactions, (2) any empty or missing UI, (3) any Russian text errors visible in-game, (4) audio issues, (5) lock/unlock chain verified correct. PASS if no critical blockers found.
**notes:** Test on both desktop keyboard and simulated mobile (375px viewport). Verify dialogue box, journal, HUD, settings all display correctly with the new Kenney fonts and pixel skin.

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
- TASK-024 | DONE | 2026-03-29 | Scene transitions & cleanup — fade effects, fix legacy refs | 2bddef3
- TASK-022 | DONE | 2026-03-29 | Onboarding intro sequence — 4 panels, auto-walk, Galina auto-trigger | 885e8ac
- TASK-023 | DONE | 2026-03-29 | Settings menu UI — script mode, theme, volume | a180670
- TASK-025 | DONE | 2026-03-29 | Endgame graduation sequence — NPC farewells, vocab summary | 96c0552
- TASK-026 | DONE | 2026-03-29 | Bug fixes — vocab.join, dead code, config defaults | 0fb4151
- TASK-027 | DONE | 2026-03-29 | CDN versions pinned (Phaser 3.87.0, Tone.js 14.7.77) + fonts | 5bfe24b
- TASK-028 | DONE | 2026-03-29 | Park + Cafe scripted fallback dialogues — 12 variations each | c235ac7
- TASK-029 | DONE | 2026-03-29 | Market + Station + Police scripted fallback dialogues — 35 variations | 5c908ef
- TASK-030 | DONE | 2026-03-29 | Settings visibility, dialogue reset loop, WorldScene event bus fixes | 9f9c155
- TASK-031 | DONE | 2026-03-29 | Test bail UX, localStorage fallback, DOM cleanup | 4c3c624
- TASK-032 | DONE | 2026-03-29 | Session close — NPC.js portrait path + dialogue.js onerror stash | 4c3c624

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
- 2026-03-29 · TASK-026–032 bug fixes, CDN, all dialogues, playtest fixes · 4c3c624
- 2026-03-29 · Art stack finalised — 6 Kenney CC0 packs, visual tasks TASK-033 through TASK-040 generated
