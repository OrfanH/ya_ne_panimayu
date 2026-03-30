# Pixel Art Asset Mapping — Один Семестр
*Audit date: 2026-03-30. Ground-up assessment, not a check-in.*

---

## 1. Current Visual State — Honest Verdict

### Overworld (WorldScene)

The overworld is visually split between two completely different tileset sources that are never reconciled. The ground layer uses `roguelike-city.png` frames 888 and 962 (Kenney Roguelike Modern City, grass tiles). The player character comes from `tilemap_packed.png` (Kenney RPG Urban Pack). The buildings are composed from `roguelike-city.png` wall/roof/door tiles — but the selection is arbitrary: apartment wall is frame 0, police wall is frame 8, market wall is frame 22. None of these have been verified against what those frames actually contain in the roguelike-city sheet. The frame indices in the `CITY_TILES` constant appear to be guesses or placeholders — e.g. frame 888 for grass would sit at row 24, col 0 of a 37-wide sheet, which is plausible but unconfirmed.

Buildings have hardcoded programmatic colour overlays (`roofColor`, `wallColor`) defined directly in `BUILDING_ZONES` as hex values (`0xD95F3B`, `0xE8C99A`, etc.), but these colours are never actually drawn — `_drawBuilding()` uses only the `CITY_TILES.buildings[id]` frames and does not read `roofColor`/`wallColor` for rendering. The colour fields in `BUILDING_ZONES` are dead code. The buildings therefore have whatever visual appearance those city tileset frames happen to contain.

The path network uses two near-identical grey frames (606, 644) from roguelike-city in a checker pattern. At 16×16 this reads as a flat grey fill. There is no visual separation between the street surface and where a path ends.

The locked building overlay is a programmatic purple-tinted rectangle with a programmatic padlock glyph drawn using `this.add.graphics()`. This has no connection to any pixel-art asset. At the game's display scale it will read as a smeared purple rectangle, not a readable visual indicator.

### Interior Scenes (Apartment, Park, Cafe, Market, Station, Police)

All six interior scenes draw their floor and wall from `roguelike-indoors.png`. The frame assignments are internally inconsistent — each scene picks different indices with no documented rationale:

- ApartmentScene: floor frames 0/1, wall 239
- ParkScene: floor 68/69, wall 197
- CafeScene: floor 216/23, wall 239 — floor_b frame 23 is almost certainly not a floor tile (low-index frames in roguelike-indoors are typically decorative items or character sprites, not floor fills)
- MarketScene: floor 324/325, wall 266 — frame 266 in a 27-wide sheet is row 9, col 22, completely undocumented
- StationScene: floor 216/217, wall 268
- PoliceScene: floor 216/217, wall 239

Five scenes use different wall tiles for the perimeter border. There is no master wall tile. Some share frame 239; others use 197, 266, 268. The player entering the apartment then the police station will see two different wall textures for what should read as "the same world."

All furniture is either: (a) a single arbitrary `roguelike-indoors` frame placed in the corner of each room — frames 131, 125, 341 appear across multiple scenes without spatial logic; or (b) programmatic graphics (counters, benches, filing cabinets, fountains, trees) drawn with `this.add.graphics()` using flat hexadecimal colours. The programmatic geometry has no outline, no pixel texture, and sits in front of the tiled floor with no visual coherence.

The ParkScene is the most incoherent: the floor uses `roguelike-indoors` tiles (which are dungeon/interior tiles), but the scene is supposed to be an outdoor park. Trees are drawn as flat green circles. The fountain is drawn as two concentric circles in blue-grey. The benches are small brown rectangles. None of this reads as a park.

### NPC Sprites

NPC sprites use the `roguelike-characters.png` sheet, loaded as `'chars'`, with a 3-layer composite model (base body + clothing + accessory). The frame indices in `NPC_FRAMES` are logical assignments based on an assumed sheet structure. The sheet's actual layout has not been verified against the assumptions in `pixel-art-spec.md`. The spec notes: "If the actual sheet layout differs, the coder should audit frame 0–15 visually and remap accordingly." This audit has not been performed. It is unknown whether galina looks like an elderly woman with a headscarf or a random character frame.

All NPCs are rendered at `tileSize - 4` display size using `setDisplaySize`. At 32px tile size this is 28×28. The roguelike-characters frames are 16×16 with 1px spacing, being stretched to 28×28. This produces blurring unless Phaser is configured with `pixelArt: true`. It is unclear from the source whether this is set.

The `_indicator` [E] prompt above NPCs uses 'Kenney Pixel' font at 12px. This is the one element that reads correctly.

### Portraits

The portraits directory (`app/assets/portraits/`) exists but is completely empty. `NPC.js` constructs portrait paths as `` `assets/portraits/${this._id}.png` `` and passes them to the dialogue UI. The dialogue UI's `<img>` element has an `onerror` handler that clears the portrait area on load failure. This means: every NPC interaction currently shows a blank portrait area. No NPC has a face. This is the single most visible deficiency in the current state.

### UI (Dialogue, HUD, Journal)

The dialogue box is CSS-styled HTML with a pixel-art-adjacent aesthetic (dark `#3a3d4a` background, chunky `2px` border, inset shadows, `border-radius: 0`). It reads acceptably as a game UI. However it uses no actual pixel art assets — no 9-slice border tile, no parchment texture, no font from the game's visual language beyond 'Kenney Pixel'. It is a flat dark box that would look at home in any minimal UI.

The HUD location badge and mission indicator use the same dark box styling. `ui-pack.png` is present in `app/assets/ui/` but is never loaded in Boot.js and never referenced anywhere in the codebase. It is a completely orphaned asset.

The journal is entirely CSS HTML with no pixel art input.

---

## 2. Asset Inventory

| Pack file | Path | What it contains | Scenes using it |
|---|---|---|---|
| `tilemap_packed.png` | `app/assets/tilesets/tilemap_packed.png` | Kenney RPG Urban Pack — 432×288 px, 27 cols × 18 rows, 16×16 tiles, 0px spacing. Ground tiles, building tiles, character sprites (cols 23-26). | Boot.js loads as `'urban'`. MapBuilder.js extracts ground/wall tiles. Player.js uses for walk sprite. |
| `roguelike-city.png` | `app/assets/tilesets/roguelike-city.png` | Kenney Roguelike Modern City — 37 cols × 28 rows, 16×16 tiles, 1px spacing. City buildings, ground, roads, characters. | WorldScene.js: grass, paths, all building tiles. |
| `roguelike-indoors.png` | `app/assets/tilesets/roguelike-indoors.png` | Kenney Roguelike Modern City — Indoors variant — 27 cols per row, 16×16 tiles, 1px spacing. Interior floors, walls, furniture. | ApartmentScene, ParkScene, CafeScene, MarketScene, StationScene, PoliceScene (floors + walls + furniture corners). |
| `roguelike-characters.png` | `app/assets/tilesets/roguelike-characters.png` | Kenney Roguelike Characters — 16×16 tiles, 1px spacing. Multi-row character sprites with body/clothing/accessory layers. | NPC.js: all 13 NPCs. |
| `ui-pack.png` | `app/assets/ui/ui-pack.png` | Kenney UI Pack — buttons, panels, icons. | Nowhere. Loaded nowhere. Completely orphaned. |
| `KenneyPixel.ttf` | `app/assets/fonts/KenneyPixel.ttf` | Kenney Pixel font. | NPC indicators, Boot.js title text, building labels, HUD elements. |
| `KenneyMini.ttf` | `app/assets/fonts/KenneyMini.ttf` | Kenney Mini font. | Unknown — not found in any .js reference. Potentially orphaned. |
| Portraits directory | `app/assets/portraits/` | Empty directory. | NPC.js attempts to load `assets/portraits/{id}.png` for all 13 NPCs. All fail silently. |

---

## 3. Full Element Mapping Table

| Element | Scene / File | Currently used asset | Kenney source pack | Status | Notes |
|---|---|---|---|---|---|
| Ground grass tile A | WorldScene.js | `city` frame 888 | roguelike-city.png | ⚠ Wrong | Used in roguelike-city sheet, but frame 888 at row 24 col 0 may not be the intended grass. Comment says "#509860 bright green" but unverified. |
| Ground grass tile B | WorldScene.js | `city` frame 962 | roguelike-city.png | ⚠ Wrong | Comment says "olive green" — checker pattern of two near-identical greens reads as flat fill. Needs confirmed frame. |
| Path tile A | WorldScene.js | `city` frame 606 | roguelike-city.png | ⚠ Wrong | Two grey frames (606, 644) used in checker. Visually indistinct. No path edge variation. |
| Path tile B | WorldScene.js | `city` frame 644 | roguelike-city.png | ⚠ Wrong | See above. |
| Building wall — apartment | WorldScene.js | `city` frame 0 | roguelike-city.png | ⚠ Wrong | Frame 0 is row 0 col 0 of roguelike-city — typically a ground or decorative tile, unlikely a building wall. |
| Building wall — park | WorldScene.js | `city` frame 925 | roguelike-city.png | ⚠ Wrong | Row 25 col 0. Unverified. |
| Building wall — cafe | WorldScene.js | `city` frame 163 | roguelike-city.png | ⚠ Wrong | Row 4 col 15. Unverified. |
| Building wall — market | WorldScene.js | `city` frame 22 | roguelike-city.png | ⚠ Wrong | Row 0 col 22. Unverified. |
| Building wall — station | WorldScene.js | `city` frame 607 | roguelike-city.png | ⚠ Wrong | Row 16 col 15. Unverified. |
| Building wall — police | WorldScene.js | `city` frame 8 | roguelike-city.png | ⚠ Wrong | Row 0 col 8. Unverified. |
| Building roof — apartment | WorldScene.js | `city` frame 37 | roguelike-city.png | ⚠ Wrong | Row 1 col 0. Unverified. |
| Building roof — park | WorldScene.js | `city` frame 365 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building roof — cafe | WorldScene.js | `city` frame 141 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building roof — market | WorldScene.js | `city` frame 290 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building roof — station | WorldScene.js | `city` frame 485 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building roof — police | WorldScene.js | `city` frame 566 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building door — apartment | WorldScene.js | `city` frame 74 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building door — park | WorldScene.js | `city` frame 889 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building door — cafe | WorldScene.js | `city` frame 529 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building door — market | WorldScene.js | `city` frame 59 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building door — station | WorldScene.js | `city` frame 643 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building door — police | WorldScene.js | `city` frame 45 | roguelike-city.png | ⚠ Wrong | Unverified. |
| Building locked overlay | WorldScene.js | Programmatic rectangle (0x555577) | None | ⚠ Wrong | Flat purple smear. No pixel art asset. |
| Padlock glyph | WorldScene.js | Programmatic graphics | None | ⚠ Wrong | Two arcs + rectangle drawn at runtime. No pixel asset. |
| Building labels | WorldScene.js | Phaser text, 'Kenney Pixel' font | KenneyPixel.ttf | ✓ Correct | Font is right. |
| Ground grass tile (fallback) | MapBuilder.js | Programmatic 0x6AAF4E fill | None | ⚠ Wrong | Only used when `urban` texture absent. Flat colour, no texture. |
| Ground path tile (fallback) | MapBuilder.js | Programmatic 0xC8A96E fill | None | ⚠ Wrong | Fallback only. Two-stripe thin border. |
| Ground grass tile (urban extract) | MapBuilder.js | `urban` frame 0 via canvas extract | tilemap_packed.png | ✓ Correct | Extracted at correct 16×16 from RPG Urban Pack. Scaled to TILE_SIZE. |
| Ground grass dark (urban extract) | MapBuilder.js | `urban` frame 27 via canvas extract | tilemap_packed.png | ✓ Correct | Row 1 col 0 — verified in Boot.js comment. |
| Path tile (urban extract) | MapBuilder.js | `urban` frame 81 via canvas extract | tilemap_packed.png | ✓ Correct | Row 3 col 0 — verified as grey sidewalk in Boot.js comment. |
| Wall tile (urban extract) | MapBuilder.js | `urban` frame 16 via canvas extract | tilemap_packed.png | ✓ Correct | Row 0 col 16 — used as invisible collision body only. |
| Player sprite — idle | Player.js | `urban` frame 23 | tilemap_packed.png | ⚠ Wrong | Frame 23 (row 0, col 23) is from the character section of RPG Urban Pack. This is a generic tileset character, not a player avatar. No name, no distinctive design. 16×16 stretched to tileSize-4 (28px at 32px tiles). |
| Player walk-down animation | Player.js / Boot.js | `urban` frames 23-26 | tilemap_packed.png | ⚠ Wrong | Correct frames for the character in RPG Urban Pack, but character is visually generic. |
| Player walk-up animation | Player.js / Boot.js | `urban` frames 50-53 | tilemap_packed.png | ⚠ Wrong | Row 1 cols 23-26. Correct for this sheet, but generic character. |
| Player walk-side animation | Player.js / Boot.js | `urban` frames 77-80 | tilemap_packed.png | ⚠ Wrong | Row 2 cols 23-26. Flipped for left direction. |
| Player directional textures (fallback) | Player.js | Programmatic gold rectangle with direction triangle | None | ⚠ Wrong | Gold box with dark triangle indicating direction. Only used when 'urban' absent. Placeholder. |
| NPC base body — galina | NPC.js | `chars` frame 32 | roguelike-characters.png | ⚠ Unknown | Frame 32 = row 4 col 0. Assumed elderly female base. NOT visually verified. |
| NPC clothing — galina | NPC.js | `chars` frame 48 | roguelike-characters.png | ⚠ Unknown | Frame 48 = row 6 col 0. Assumed dark dress overlay. NOT verified. |
| NPC accessory — galina | NPC.js | `chars` frame 16 | roguelike-characters.png | ⚠ Unknown | Frame 16 = row 2 col 0. Assumed headscarf. NOT verified. |
| NPC base body — artyom | NPC.js | `chars` frame 1 | roguelike-characters.png | ⚠ Unknown | Row 0 col 1. NOT verified. |
| NPC clothing — artyom | NPC.js | `chars` frame 9 | roguelike-characters.png | ⚠ Unknown | Row 1 col 1. NOT verified. |
| NPC base body — tamara | NPC.js | `chars` frame 33 | roguelike-characters.png | ⚠ Unknown | Row 4 col 1. NOT verified. |
| NPC clothing — tamara | NPC.js | `chars` frame 49 | roguelike-characters.png | ⚠ Unknown | Row 6 col 1. NOT verified. |
| NPC accessory — tamara | NPC.js | `chars` frame 17 | roguelike-characters.png | ⚠ Unknown | Row 2 col 1. NOT verified. |
| NPC base body — lena | NPC.js | `chars` frame 34 | roguelike-characters.png | ⚠ Unknown | Row 4 col 2. NOT verified. |
| NPC clothing — lena | NPC.js | `chars` frame 58 | roguelike-characters.png | ⚠ Unknown | Row 7 col 2. NOT verified. |
| NPC base body — boris | NPC.js | `chars` frame 2 | roguelike-characters.png | ⚠ Unknown | Row 0 col 2. NOT verified. |
| NPC clothing — boris | NPC.js | `chars` frame 10 | roguelike-characters.png | ⚠ Unknown | Row 1 col 2. NOT verified. |
| NPC accessory — boris | NPC.js | `chars` frame 18 | roguelike-characters.png | ⚠ Unknown | Row 2 col 2. NOT verified. |
| NPC base body — fatima | NPC.js | `chars` frame 35 | roguelike-characters.png | ⚠ Unknown | Row 4 col 3. NOT verified. |
| NPC clothing — fatima | NPC.js | `chars` frame 59 | roguelike-characters.png | ⚠ Unknown | Row 7 col 3. NOT verified. |
| NPC accessory — fatima | NPC.js | `chars` frame 19 | roguelike-characters.png | ⚠ Unknown | Row 2 col 3. NOT verified. |
| NPC base body — misha | NPC.js | `chars` frame 3 | roguelike-characters.png | ⚠ Unknown | Row 0 col 3. NOT verified. |
| NPC clothing — misha | NPC.js | `chars` frame 11 | roguelike-characters.png | ⚠ Unknown | Row 1 col 3. NOT verified. |
| NPC accessory — misha | NPC.js | `chars` frame 20 | roguelike-characters.png | ⚠ Unknown | Row 2 col 4. NOT verified. |
| NPC base body — styopan | NPC.js | `chars` frame 4 | roguelike-characters.png | ⚠ Unknown | Row 0 col 4. NOT verified. |
| NPC clothing — styopan | NPC.js | `chars` frame 12 | roguelike-characters.png | ⚠ Unknown | Row 1 col 4. NOT verified. |
| NPC base body — konstantin | NPC.js | `chars` frame 5 | roguelike-characters.png | ⚠ Unknown | Row 0 col 5. NOT verified. |
| NPC clothing — konstantin | NPC.js | `chars` frame 13 | roguelike-characters.png | ⚠ Unknown | Row 1 col 5. NOT verified. |
| NPC accessory — konstantin | NPC.js | `chars` frame 21 | roguelike-characters.png | ⚠ Unknown | Row 2 col 5. NOT verified. |
| NPC base body — nadya | NPC.js | `chars` frame 36 | roguelike-characters.png | ⚠ Unknown | Row 4 col 4. NOT verified. |
| NPC clothing — nadya | NPC.js | `chars` frame 60 | roguelike-characters.png | ⚠ Unknown | Row 7 col 4. NOT verified. |
| NPC accessory — nadya | NPC.js | `chars` frame 22 | roguelike-characters.png | ⚠ Unknown | Row 2 col 6. NOT verified. |
| NPC base body — alina | NPC.js | `chars` frame 37 | roguelike-characters.png | ⚠ Unknown | Row 4 col 5. NOT verified. |
| NPC clothing — alina | NPC.js | `chars` frame 61 | roguelike-characters.png | ⚠ Unknown | Row 7 col 5. NOT verified. |
| NPC accessory — alina | NPC.js | `chars` frame 23 | roguelike-characters.png | ⚠ Unknown | Row 2 col 7. NOT verified. |
| NPC base body — sergei | NPC.js | `chars` frame 6 | roguelike-characters.png | ⚠ Unknown | Row 0 col 6. NOT verified. |
| NPC clothing — sergei | NPC.js | `chars` frame 14 | roguelike-characters.png | ⚠ Unknown | Row 1 col 6. NOT verified. |
| NPC base body — professor | NPC.js | `chars` frame 7 | roguelike-characters.png | ⚠ Unknown | Row 0 col 7. NOT verified. |
| NPC clothing — professor | NPC.js | `chars` frame 15 | roguelike-characters.png | ⚠ Unknown | Row 1 col 7. NOT verified. |
| NPC accessory — professor | NPC.js | `chars` frame 24 | roguelike-characters.png | ⚠ Unknown | Row 3 col 0. NOT verified. |
| NPC interaction indicator [E] | NPC.js | Phaser text, 'Kenney Pixel' 12px | KenneyPixel.ttf | ✓ Correct | Readable. Correct font. |
| Portrait — galina | NPC.js / dialogue.js | `assets/portraits/galina.png` | None | ✗ Missing | File does not exist. Silently fails in dialogue. |
| Portrait — artyom | NPC.js / dialogue.js | `assets/portraits/artyom.png` | None | ✗ Missing | File does not exist. |
| Portrait — tamara | NPC.js / dialogue.js | `assets/portraits/tamara.png` | None | ✗ Missing | File does not exist. |
| Portrait — lena | NPC.js / dialogue.js | `assets/portraits/lena.png` | None | ✗ Missing | File does not exist. |
| Portrait — boris | NPC.js / dialogue.js | `assets/portraits/boris.png` | None | ✗ Missing | File does not exist. |
| Portrait — fatima | NPC.js / dialogue.js | `assets/portraits/fatima.png` | None | ✗ Missing | File does not exist. |
| Portrait — misha | NPC.js / dialogue.js | `assets/portraits/misha.png` | None | ✗ Missing | File does not exist. |
| Portrait — styopan | NPC.js / dialogue.js | `assets/portraits/styopan.png` | None | ✗ Missing | File does not exist. |
| Portrait — konstantin | NPC.js / dialogue.js | `assets/portraits/konstantin.png` | None | ✗ Missing | File does not exist. |
| Portrait — nadya | NPC.js / dialogue.js | `assets/portraits/nadya.png` | None | ✗ Missing | File does not exist. |
| Portrait — alina | NPC.js / dialogue.js | `assets/portraits/alina.png` | None | ✗ Missing | File does not exist. |
| Portrait — sergei | NPC.js / dialogue.js | `assets/portraits/sergei.png` | None | ✗ Missing | File does not exist. |
| Portrait — professor | NPC.js / dialogue.js | `assets/portraits/professor.png` | None | ✗ Missing | File does not exist. |
| Apartment floor tile A | ApartmentScene.js | `indoors` frame 0 | roguelike-indoors.png | ⚠ Unknown | Frame 0 of roguelike-indoors — needs visual verification. May be correct. |
| Apartment floor tile B | ApartmentScene.js | `indoors` frame 1 | roguelike-indoors.png | ⚠ Unknown | Frame 1 — needs visual verification. |
| Apartment wall tile | ApartmentScene.js | `indoors` frame 239 | roguelike-indoors.png | ⚠ Unknown | Row 8 col 22. Undocumented. Used by PoliceScene too. |
| Apartment furniture (top-left) | ApartmentScene.js | `indoors` frame 131 | roguelike-indoors.png | ⚠ Unknown | Row 4 col 23. Placed as corner decor. No documentation. |
| Apartment furniture (top-right) | ApartmentScene.js | `indoors` frame 125 | roguelike-indoors.png | ⚠ Unknown | Row 4 col 17. Shared with cafe and station. |
| Apartment furniture (bottom-right) | ApartmentScene.js | `indoors` frame 341 | roguelike-indoors.png | ⚠ Unknown | Row 12 col 17. Shared with cafe, market, police. |
| Park floor tile A | ParkScene.js | `indoors` frame 68 | roguelike-indoors.png | ⚠ Wrong | ParkScene is an outdoor park — using interior floor tiles for an outdoor space is categorically wrong. These tiles are designed for inside rooms. |
| Park floor tile B | ParkScene.js | `indoors` frame 69 | roguelike-indoors.png | ⚠ Wrong | Same issue as above. |
| Park wall/border tile | ParkScene.js | `indoors` frame 197 | roguelike-indoors.png | ⚠ Wrong | A park does not have wall tiles. The perimeter should be hedge, fence, or vegetation tiles. |
| Park path (horizontal + vertical) | ParkScene.js | Programmatic 0xC8A96E fill + 0xB89558 edges | None | ⚠ Wrong | Flat sand-coloured rectangle. No pixel texture. |
| Park decorations (fountain) | ParkScene.js | Programmatic concentric circles | None | ⚠ Wrong | Two grey-blue circles. No pixel asset. |
| Park decorations (benches) | ParkScene.js | Programmatic brown rectangles | None | ⚠ Wrong | Flat colour. No pixel asset. |
| Park decorations (trees) | ParkScene.js | Programmatic trunk rect + canopy circle | None | ⚠ Wrong | Trunk is a dark-brown rectangle, canopy is a dark-green circle. No outline, no pixel texture. |
| Park furniture (top-left) | ParkScene.js | `indoors` frame 131 | roguelike-indoors.png | ⚠ Wrong | Interior furniture in a park. |
| Park furniture (top-right) | ParkScene.js | `indoors` frame 132 | roguelike-indoors.png | ⚠ Wrong | Interior furniture in a park. |
| Park furniture (bottom-left) | ParkScene.js | `indoors` frame 133 | roguelike-indoors.png | ⚠ Wrong | Interior furniture in a park. |
| Cafe floor tile A | CafeScene.js | `indoors` frame 216 | roguelike-indoors.png | ⚠ Unknown | Shared with station and police. Possibly a stone/tile floor. |
| Cafe floor tile B | CafeScene.js | `indoors` frame 23 | roguelike-indoors.png | ⚠ Wrong | Frame 23 = row 0 col 23 — in roguelike-indoors low-index frames tend to be decorative props, not floor tiles. Likely wrong. Will look jarring as a floor checker. |
| Cafe wall tile | CafeScene.js | `indoors` frame 239 | roguelike-indoors.png | ⚠ Unknown | Same as apartment. |
| Cafe furniture (corners) | CafeScene.js | `indoors` frames 125, 131, 341 | roguelike-indoors.png | ⚠ Unknown | Same frames recycled from apartment. No cafe-specific furniture. |
| Cafe counter | CafeScene.js | Programmatic 0x6B4226 / 0x8B6B42 rectangles | None | ⚠ Wrong | Flat brown rectangles, no pixel texture or outline. |
| Cafe tables | CafeScene.js | Programmatic 0x8B6B42 squares | None | ⚠ Wrong | Flat brown squares at 70% tile width. No chairs drawn. |
| Cafe window | CafeScene.js | Programmatic 0xAADDFF rectangle with stroke | None | ⚠ Wrong | Light blue rectangle with brown stroke. No pixel texture. |
| Market floor tile A | MarketScene.js | `indoors` frame 324 | roguelike-indoors.png | ⚠ Unknown | Row 12 col 0. Undocumented. |
| Market floor tile B | MarketScene.js | `indoors` frame 325 | roguelike-indoors.png | ⚠ Unknown | Row 12 col 1. Undocumented. |
| Market wall tile | MarketScene.js | `indoors` frame 266 | roguelike-indoors.png | ⚠ Unknown | Row 9 col 22. Unique to market. |
| Market furniture (corners) | MarketScene.js | `indoors` frames 23, 341, 131 | roguelike-indoors.png | ⚠ Wrong | Frame 23 reused — likely wrong tile as noted under cafe. |
| Market aisle | MarketScene.js | Programmatic 0xC8B898 fill | None | ⚠ Wrong | Flat tan rectangle. No pixel texture. |
| Market stall bases | MarketScene.js | Programmatic 0x8B6B42 rectangles | None | ⚠ Wrong | Flat brown rectangles. |
| Market stall awnings | MarketScene.js | Programmatic colour fills (0xD95F3B, 0xC97C3A, 0x3A7FC1) | None | ⚠ Wrong | Flat coloured rectangles extending slightly past stall width. |
| Market stall counters | MarketScene.js | Programmatic 0x6B4226 strips | None | ⚠ Wrong | Thin dark-brown strip. |
| Station floor tile A | StationScene.js | `indoors` frame 216 | roguelike-indoors.png | ⚠ Unknown | Same as cafe floor A. |
| Station floor tile B | StationScene.js | `indoors` frame 217 | roguelike-indoors.png | ⚠ Unknown | Row 8 col 1. Undocumented. |
| Station wall tile | StationScene.js | `indoors` frame 268 | roguelike-indoors.png | ⚠ Unknown | Row 9 col 25. Unique to station. |
| Station furniture (corners) | StationScene.js | `indoors` frames 125, 239, 341 | roguelike-indoors.png | ⚠ Wrong | Frame 239 used as both a wall tile (in other scenes) and a corner furniture here. |
| Station platform stripe | StationScene.js | Programmatic 0xDDCC44 strip, 4px height | None | ⚠ Wrong | Yellow safety line is only 4px tall at any tile size. Barely visible. |
| Station ticket window | StationScene.js | Programmatic 0x6B6B6B + 0xAADDFF rectangles | None | ⚠ Wrong | Grey box with blue glass window. No pixel art. |
| Station benches | StationScene.js | Programmatic 0x555555 rectangles | None | ⚠ Wrong | Dark grey rectangles. |
| Police floor tile A | PoliceScene.js | `indoors` frame 216 | roguelike-indoors.png | ⚠ Unknown | Same as cafe/station floor A. |
| Police floor tile B | PoliceScene.js | `indoors` frame 217 | roguelike-indoors.png | ⚠ Unknown | Same as station floor B. |
| Police wall tile | PoliceScene.js | `indoors` frame 239 | roguelike-indoors.png | ⚠ Unknown | Same as apartment wall. |
| Police furniture (corners) | PoliceScene.js | `indoors` frames 125, 341, 266 | roguelike-indoors.png | ⚠ Unknown | Frame 266 is the market wall tile, reused as corner furniture here. |
| Police front desk | PoliceScene.js | Programmatic 0x6B6B7B rectangle | None | ⚠ Wrong | Blue-grey strip. |
| Police filing cabinets | PoliceScene.js | Programmatic 0x777788 rectangles × 3 | None | ⚠ Wrong | Three grey-blue rectangles. |
| Police waiting chairs | PoliceScene.js | Programmatic 0x555566 squares × 3 | None | ⚠ Wrong | Three small dark squares. |
| Test scene floor | TestScene.js | Programmatic 0xC8B99A fill | None | ⚠ Wrong | Flat sand-coloured rectangle covering entire room. |
| Test scene wall border | TestScene.js | Programmatic lineStyle stroke (0x7A6449) | None | ⚠ Wrong | 1-tile-thick brown stroke outline. No tiled wall. |
| Test scene professor desk | TestScene.js | Programmatic 0x8B6914 rectangle | None | ⚠ Wrong | Brown rectangle near professor position. |
| Dialogue box | dialogue.js / style.css | CSS HTML element, no pixel art | None | ⚠ Wrong | Dark `#3a3d4a` box with 2px border. Functional but not grounded in game's visual language. No 9-slice border tile. |
| Dialogue portrait | dialogue.js | Empty — all portrait images missing | None | ✗ Missing | Portrait area renders blank for all NPCs. |
| HUD location badge | hud.js / style.css | CSS HTML element, no pixel art | None | ⚠ Wrong | Same dark-box style as dialogue. Not using `ui-pack.png`. |
| HUD mission indicator | hud.js / style.css | CSS HTML element, no pixel art | None | ⚠ Wrong | Same issue. |
| HUD mute button | hud.js / style.css | CSS HTML element, no pixel art | None | ⚠ Wrong | Not using `ui-pack.png`. |
| Journal panel | journal.js / style.css | CSS HTML element, no pixel art | None | ⚠ Wrong | No pixel border or texture. Pure CSS. |

---

## 4. What Needs to Be Redone

### Critical — broken at runtime or so wrong it breaks immersion

1. **All 13 NPC portraits are missing.** Every conversation shows a blank portrait box. This is the most immediately noticeable failure. The `assets/portraits/` directory exists but is empty.

2. **NPC character frame assignments are unverified.** The entire `NPC_FRAMES` map in `NPC.js` (and the matching spec in `pixel-art-spec.md`) is based on assumed sheet structure. No one has loaded `roguelike-characters.png` at runtime and checked which frame is which character. Any NPC could be rendering the wrong sprite, or a completely blank frame if the sheet has fewer rows than assumed.

3. **CafeScene floor tile B (frame 23) is almost certainly wrong.** Frame 23 in roguelike-indoors is a low-index frame — these are typically decorative items, not floor tiles. The cafe floor will show a non-floor graphic in every other checker tile.

4. **ParkScene uses indoor tiles for an outdoor park.** Floor frames 68/69 and wall frame 197 come from the roguelike-indoors pack. The park will visually read as a dungeon room, not an outdoor space.

5. **TestScene has no tiled floor or walls.** The exam room is a flat programmatic colour fill with a stroke outline. It looks like a placeholder from 2019.

### High — present but visually incoherent with the rest of the game

6. **All six interior scenes use different wall tiles with no master convention.** Apartment (239), park (197), cafe (239), market (266), station (268), police (239). Two scenes share the wall tile, four don't. All four should be audited and consolidated to a single consistent wall tile — or a small set of thematically appropriate wall tiles with documented rationale.

7. **All furniture in all scenes is programmatic geometry.** Counters, tables, benches, filing cabinets, stall awnings, fountains, and trees are all flat-colour rectangles and circles drawn with `this.add.graphics()`. None of these are tiled assets. They have no outline, no shading, no texture. They sit on top of the tiled floor and break the pixel-art register immediately.

8. **Player sprite is a generic tileset character from the RPG Urban Pack.** The player character (frame 23 of `tilemap_packed.png`) is a character sprite from a road/urban tileset — not a dedicated protagonist sprite. The sprite has no visual design identity distinguishing it as "the player" vs "an NPC."

9. **Two separate tileset packs are used in the same game.** The overworld uses `roguelike-city.png` for buildings/ground and `tilemap_packed.png` (RPG Urban Pack) for the player and map builder tiles. These are different packs with potentially different visual registers, palette values, and art styles. The player character may be noticeably mismatched against the ground tiles.

10. **Building frame indices in WorldScene are unverified guesses.** The `CITY_TILES.buildings` object assigns specific frames for wall, roof, and door per building. None of these have been checked against the actual roguelike-city sheet. Buildings will render whatever tile happens to be at those coordinates — which may be a road line, a decoration, or an empty frame.

11. **The dialogue box, HUD, and journal are generic dark-box CSS.** They are not grounded in any pixel art visual language. `ui-pack.png` is loaded on disk but has never been used anywhere. The UI should be rebuilt using that pack.

### Medium — works but misses the intended aesthetic

12. **Programmatic path drawing in ParkScene.** The path network is drawn with `gfx.fillStyle` — a flat sand-coloured block with thin edge lines. No tile variation, no organic feel.

13. **The locked building overlay is a programmatic purple rectangle.** The padlock glyph works mechanically but looks like a vector icon pasted onto a pixel game.

14. **NPC display size uses `setDisplaySize(tileSize-4, tileSize-4)` on a 16×16 sprite.** At 32px tile size, this stretches 16×16 sprites to 28×28. If Phaser is not configured with `pixelArt: true` the bilinear interpolation will produce blurry NPC sprites. This must be confirmed.

15. **`KenneyMini.ttf` is never referenced in any .js file.** Loaded to disk but wasted.

---

## 5. Gaps Requiring New Assets

These visual needs cannot be met by any existing Kenney pack currently on disk.

### Gap 1 — All 13 NPC portrait images (CRITICAL)
**Needed:** 13 portrait images, one per named NPC, at 64×64px (per REFERENCE-PIXELART.md §4). Each portrait needs 2 expression variants minimum (neutral, talking mouth open). File naming: `galina.png`, `artyom.png`, `tamara.png`, `lena.png`, `boris.png`, `fatima.png`, `misha.png`, `styopan.png`, `konstantin.png`, `nadya.png`, `alina.png`, `sergei.png`, `professor.png`. Location: `app/assets/portraits/`.

**No Kenney pack supplies named character portraits.** These must be created as custom pixel art following the 64×64 spec in REFERENCE-PIXELART.md §4. Human must provide.

### Gap 2 — Outdoor park tiles
**Needed:** Outdoor park-appropriate tiles to replace the indoor floor/wall tiles currently misused in ParkScene. Required: grass tile (exterior ground, not the same green as the overworld — slightly cooler/more detailed), gravel path tile, hedge or fence border tile (for park perimeter, not a dungeon wall), decorative vegetation tile (flower bed, bush).

**Coverage check:** Kenney Tiny Town (not currently in `assets/`) includes some outdoor decorative tiles. However it is NOT on disk. The three packs currently on disk (tilemap_packed.png, roguelike-city.png, roguelike-indoors.png) do not include a coherent set of outdoor park-specific tiles that would visually distinguish an outdoor park from an interior space. Human must provide either the Tiny Town pack or a custom set.

### Gap 3 — Cafe interior props
**Needed:** Pixel art tiles for: coffee counter tile, small round table (top-down), café chair, window-with-curtain tile, perhaps a chalkboard menu tile. These must match the roguelike-indoors visual register (same outline weight, same saturation level).

**No existing on-disk pack covers this.** REFERENCE-PIXELART.md §6 explicitly lists "Café interior: counter tile, coffee machine prop, small round tables, chairs, menu board" as a known gap. Human must provide.

### Gap 4 — Market stall props
**Needed:** Vendor table tile (top-down, with produce/goods on surface), awning tile (coloured canopy top), price sign prop. Same roguelike-indoors register.

**Same known gap per REFERENCE-PIXELART.md §6.** Human must provide.

### Gap 5 — Police station interior props
**Needed:** Institutional desk tile (grey-blue, different from café counter), filing cabinet tile (1×1 or 1×2), notice board tile.

**Same known gap per REFERENCE-PIXELART.md §6.** Human must provide.

### Gap 6 — Dedicated player character sprite
**Needed:** A protagonist sprite that is visually distinct from NPCs — readable at 16×24px (to match REFERENCE-PIXELART.md §1 standard), 4-directional, 4-frame walk cycle per direction. The foreign student player character should have a distinct visual differentiator (backpack, distinctive clothing) that reads at full zoom-out.

**The current player uses a generic tileset character from RPG Urban Pack.** Kenney roguelike-characters.png could potentially supply this if a specific frame is designated as the protagonist, but this requires a deliberate selection and documentation. Currently no frame is designated. Human decision required before coder can implement.

---

## 6. Orphaned and Broken References

### Loaded in Boot.js but not used anywhere as intended

| Asset key | Boot.js load call | Actual usage | Verdict |
|---|---|---|---|
| `city` (roguelike-city.png) | `this.load.spritesheet('city', ...)` | WorldScene.js — ground and buildings | ✓ Used |
| `indoors` (roguelike-indoors.png) | `this.load.spritesheet('indoors', ...)` | All 6 interior scenes | ✓ Used |
| `chars` (roguelike-characters.png) | `this.load.spritesheet('chars', ...)` | NPC.js | ✓ Used |
| `urban` (tilemap_packed.png) | `this.load.spritesheet('urban', ...)` | MapBuilder.js (tile extraction), Player.js (walk sprite) | ✓ Used but partially — player only uses 3 animation sets from it; MapBuilder only extracts 4 tile types |

### On disk but never loaded in Boot.js

| File | Path | Status |
|---|---|---|
| `ui-pack.png` | `app/assets/ui/ui-pack.png` | On disk, never loaded. All UI is CSS-only. This pack could replace the programmatic HUD/dialogue styling. |
| `KenneyMini.ttf` | `app/assets/fonts/KenneyMini.ttf` | On disk, never referenced in any .js or .css file. |
| All portrait files | `app/assets/portraits/*.png` | Directory exists, all portrait files absent. NPC.js references all 13 by path. All fail silently via `onerror`. |

### Texture keys used in scenes but behaviour if absent

| Key | Where used | What happens if absent |
|---|---|---|
| `'urban'` | Player.js, MapBuilder.js | Player.js falls back to programmatic gold-box sprite. MapBuilder.js falls back to programmatic flat-colour tiles. Game runs but looks worse. |
| `'city'` | WorldScene.js | No fallback. World renders blank / Phaser errors on missing frame. |
| `'indoors'` | All 6 interior scenes | No fallback. All interior scenes break. |
| `'chars'` | NPC.js | No fallback beyond frame 0 safety clamp. NPCs render as frame 0 character for all. |

### Dead code in WorldScene

| Code | Location | Issue |
|---|---|---|
| `roofColor`, `wallColor`, `doorColor` fields on `BUILDING_ZONES` objects | WorldScene.js lines 12-23 | These hex values are never read by `_drawBuilding()`. The function uses only `CITY_TILES.buildings[zone.id]` frames. The colour fields are vestigial from an earlier implementation. |

---

*End of mapping. Do not update `pixel-art-spec.md` until this document is reviewed and approved.*
