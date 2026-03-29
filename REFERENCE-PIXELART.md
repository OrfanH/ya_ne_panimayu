# REFERENCE-PIXELART.md
*Deep research synthesis for Один Семестр. Every rule is actionable. Sources linked inline.*
*Generated: 2026-03-29*

---

## 1. Tile Scale Decision: Use 16×16

**Recommendation: 16×16 tiles.** Reasons:

1. Kenney Tiny Town — the project's base asset pack — is built at 16×16. Changing tile size means rebuilding all base assets.
2. 16×16 is the standard for top-down overworld RPGs in the Harvest Moon / Stardew Valley lineage (Stardew uses 16×16 tiles at a 480×270 internal resolution, scaled up 4×).
3. 16×16 forces constraints that teach pixel placement fundamentals and produce cleaner, more readable environments than 32×32 for small-screen targets.
4. Mobile-first: at 16×16, a 480×270 canvas scaled to 1080p gives clean 4× integer scaling. At 32×32, you have fewer tiles on screen which produces a cramped, zoomed-in feel on mobile.

**Character sprites at 16×16 tiles: use 16×16 or 16×24.** Standard sprite dimensions across the genre: 16×16, 16×24 (slightly taller than a tile — improves readability and silhouette in top-down perspective), 32×32 for detailed characters. For Один Семестр: 16×24 character sprites on 16×16 tiles is the standard approach. NPC portraits for dialogue are separate (see §4).

**Display resolution: 480×270 internal, scaled 4×.** This matches Stardew Valley's approach. At 4× scale, 16×16 tiles render at 64×64 physical pixels on a 1080p screen — crisp and readable. Never scale non-integer (e.g., 3.5×) — this causes pixel bleed.

**Anti-aliasing: never.** Use the Pencil tool in Aseprite, not the Paintbrush. Disable the Eraser's soft edge. Every edge must be a hard pixel boundary. Anti-aliasing in pixel art creates muddy, illegible edges at small resolution.

---

## 2. Palette Construction Rules

**Master palette: 128 colours organised as 8 ramps of 9 swatches each.** Extract a per-location sub-palette of 16-24 colours. Never add colours ad-hoc — always expand the master palette first, then use those colours in assets.

**Ramp construction:**
- 9 swatches per ramp, brightness increases left to right
- Starting brightness rarely at 0% (pure black looks dirty); end brightness rarely at 100% (pure white reads as light source, not surface)
- Saturation peaks at midtones (swatch 4-5), falls off at both ends — never use 100% saturation; never reach 0% except for neutrals
- Hue shift: **+20° per swatch toward warmer hues as brightness increases** (shadows cool toward blue/purple; highlights warm toward yellow/orange). This is the single most important technique for making colours look natural vs "muddy straight ramp"

**Environment palette for Один Семестр — warm, lived-in small town:**
- Base hue range: 60-120° (yellow-greens, warm greens for grass/vegetation); 20-50° (warm ochres, tans for paths and building exteriors)
- Accent per location: one distinct accent hue per location used for key interactive objects and NPC clothing
  - Apartment: dusty blue-grey (cold, functional, transitional space)
  - Park: bright warm green + flower accents (yellow, pink)
  - Café: amber/coffee brown with warm cream highlights
  - Market: saturated red-orange (market stalls, awnings)
  - Train station: steel blue-grey (industrial, transitional)
  - Police station: muted navy + institutional cream (formal, slightly uncomfortable)

**Saturation rules:**
- Large background areas (ground, walls, sky): low saturation (20-40%)
- Medium objects (furniture, paths, vegetation): medium saturation (50-65%)
- Focal/interactive objects and NPC clothing: higher saturation (65-80%) — this draws the eye
- Avoid using maximum saturation anywhere in a scene except for UI elements or deliberate emphasis

**Cohesion rule: every asset uses colours drawn from the same master ramp.** Never introduce a new hue not in the master palette for environmental assets. Characters may use slightly more varied hues but must share the same value range.

---

## 3. NPC Sprite Conventions

**Top-down view: 3/4 perspective (not true top-down).** Characters face at a ~45° angle — head visible, body shown with slight perspective, feet visible. This is the Stardew Valley convention and the Kenney asset convention. True top-down (bird's eye) loses face readability.

**4-directional movement: down, left, right, up.** Left and right sprites can share a flipped asset (mirror x-axis). Down-facing is the "idle" default and the most detailed frame — this is what the player sees when talking.

**Walk cycle: 4 frames per direction.** Frame 0: neutral (feet together). Frame 1: step right. Frame 2: neutral. Frame 3: step left. Total: 16 frames for a 4-direction walk cycle. Each frame at 16×24 pixels. Animate at 8-10 FPS for smooth movement feel.

**Idle animation: 2 frames.** Subtle breathing motion — shift the body/head sprite 1 pixel up on frame 2. Duration: 800ms frame 1, 800ms frame 2. Anything more complex is wasted at this resolution and draw distance.

**Silhouette readability at 16×16:** The silhouette must be readable even without colour — if the character fills the entire 16×24 bounding box, the silhouette is lost. Leave at least 1px gap on each horizontal side. Character head should be ~6×6px at 16×24 scale. Use contrasting hair/hat colour vs clothing to separate head from body at a glance.

**One visual differentiator per NPC:** Each named NPC needs one visually distinctive element readable at full zoom-out: a unique hair colour, a distinctive hat, or unique clothing colour. This prevents NPCs from being interchangeable from a distance.

---

## 4. Portrait Art Rules

**Portrait dimensions: 64×64px at 1× (rendered at 4× = 256×256 on screen).** At 64×64, a face occupies roughly 30×30px — enough for readable expression with 2-3px eyes, 3-4px nose area, 4-5px mouth.

**Expression through eyes and mouth only.** At portrait scale, only eyes and mouth change between expression states. Shifting an eyebrow by 1px changes the impression dramatically. Keep 3-4 expression states per NPC: neutral, happy, concerned/uncertain, emphatic (for strong reactions).

**Face construction at 64×64:**
- Hair/head silhouette: occupies top 40% of canvas
- Eyes: positioned at ~35% from top; each eye approximately 3×2px (whites optional — often implied by eyelid shape)
- Mouth: positioned at ~65% from top; 4-5px wide
- Clothing visible in lower 25% — this is what makes each portrait character-specific at a glance

**Talking animation: 2 frames.** Frame 1: mouth closed. Frame 2: mouth slightly open (shift 1-2px). Cycle at ~150ms alternation during spoken dialogue. Do not animate talking unless the mouth changes are clearly readable — a badly animated mouth at small resolution looks worse than static.

**Lighting consistency: top-left light source.** Shadow falls bottom-right on all portrait faces. Apply consistently across all NPC portraits. Skin highlight: 1px on forehead and nose tip using the warmest highlight swatch in the skin ramp.

**Portrait palette: 6-8 colours maximum per character.** Skin (3-4 value ramp), hair (2-3 values), clothing (1-2 accent colours), outline (darkest skin-adjacent tone or dark neutral — never pure black unless it is stylistically deliberate).

---

## 5. Interior vs Exterior Visual Language

**Colour temperature shift: interiors are 10-15% cooler and 15-20% less saturated.** Exterior ground and vegetation uses warm ochres and greens. Interior floors and walls shift toward cooler tones — grey-beige, muted blue-grey, dusty rose. This signals "indoors" immediately without requiring a UI label.

**Lighting direction changes indoors.** Exterior: top-down ambient light (shadows cast south/southeast). Interior: point-source light from windows and lamps. Interior floors should have visible light patches near window positions. This tells the player where they are and makes interiors feel distinct from exteriors.

**Floor texture convention:**
- Exterior: natural materials (grass tiles, dirt path, stone pavers) — irregular, organic variation
- Interior: regular geometric pattern (wood planks, tile grid, rug) — consistent, human-made feel
- The eye immediately reads regular vs irregular as indoor vs outdoor

**Ceiling: implied, never shown.** Top-down RPGs do not show ceilings. Signal "ceiling exists" via: wall tiles at the top border of the room, darkened tile edges near walls, furniture placement. The player's imagination fills in the rest.

**Border/frame convention:** Exterior scenes extend to map edge. Interior scenes have visible room borders — a thick-tile wall border around the playable floor area signals "room." Add a 2-tile-wide wall border in the room's wall colour on all sides.

**Transition signal: roof-removal animation.** When entering a building, the roof tiles should fade or slide away (standard RPG convention). This is a Phaser scene transition, not a tile decision, but the tile set must include interior roof tiles distinct from the playable floor, ready for fade-out.

---

## 6. Kenney Pack Coverage and Gaps

**Kenney Tiny Town (16×16, 130 files, CC0):**
- Covers: exterior town tiles (grass, paths, roads), building facades (walls, doors, windows, roofs), some decorative objects (benches, trees, fences), basic characters
- Does NOT include: interior floor tiles, interior furniture, café interior props, apartment interior, market stall interiors, police station interior, Russian-specific signage

**Kenney Tiny Dungeon (16×16, CC0):**
- Covers: dungeon/interior stone floors, walls, doors, chests, character sprites, weapons, items
- Partially useful for: police station's institutional interior (stone/brick walls), basement or utility areas
- Does NOT include: modern interior (apartment), commercial interior (café, market)

**Known gaps to fill with custom assets:**
1. Café interior: counter tile, coffee machine prop, small round tables, chairs, menu board
2. Apartment interior: bed tile, desk tile, wardrobe, window-with-curtain, Soviet-era wallpaper pattern
3. Market interior/stalls: vendor table, produce pile props, awning tile, price sign
4. Police station interior: desk (institutional style), filing cabinet prop, notice board tile
5. Russian signage: Cyrillic shop signs, street signs, building labels — all custom, unavailable in any Kenney pack

---

## 7. Extending Kenney Without Visual Jarring

**Match the line weight.** Kenney's Tiny series uses a 1px dark outline (approximately #1a1a2e or similar dark navy) on character sprites and buildings. Any custom asset must use the same 1px outline at the same darkness level. Switching to no outline or 2px outline immediately marks an asset as foreign.

**Match saturation levels.** Kenney Tiny Town uses moderate saturation — not hyper-saturated cartoon style. Sample the average saturation of existing Kenney tiles (roughly 45-55% saturation for environment tiles) and match this when building custom assets. A custom café chair at 80% saturation will look out of place against a 45% Kenney floor.

**Palette-constrain custom assets to the master palette.** Before creating any custom tile: pick the 6-8 colours you will use from the master palette only. Do not introduce new hues for custom assets. If a new hue is needed (e.g., coffee brown for café), add it to the master palette first, then build all café assets using it consistently.

**Share Kenney's style: dithering only if Kenney uses it.** Kenney Tiny assets generally do not use dithering — they rely on flat colour with outline. Do not introduce dithered shading in custom assets. Flat colour with a 1-2px highlight is the correct approach.

**Test at 4× scale in context.** Place every new custom tile next to existing Kenney tiles at the game's 4× render scale before finalising. What looks cohesive at 1× (Aseprite canvas) may read differently at 4× (in-game). The test is always in context, never the isolated asset.

---

## 8. Mobile Display Considerations

**Minimum sprite readable size on mobile: 16×16 at 4× = 64×64 physical pixels.** On a 375px-wide mobile screen (iPhone SE), 64px characters give roughly 5 characters across the screen width — enough for social interactions without crowding.

**Camera zoom: no dynamic zoom.** Do not zoom in/out dynamically on mobile. Consistent 4× scale prevents pixel bleed and maintains crispness. If the player needs to see more of the world, the viewport pans — the zoom never changes.

**Touch target alignment.** Interaction zones (NPCs, doors, items) must be at minimum 48×48 physical pixels. At 4× scale, a 16×16 tile = 64×64 physical pixels — safe. Do not create interactable objects smaller than 16×16 at base scale.

**Palette choice for OLED screens.** Avoid pure white (#ffffff) as a background colour — it bleeds on OLED. Use near-white (e.g., #f5f0e8 for paper/sky backgrounds). Near-black outlines (#1a1a2e rather than #000000) read better on both LCD and OLED.

---

## Sources

- [Kenney Tiny Town](https://kenney.nl/assets/tiny-town)
- [Kenney Tiny Dungeon on itch.io](https://kenney-assets.itch.io/tiny-dungeon)
- [Lospec Pixel Art Tutorials — Topdown](https://lospec.com/pixel-art-tutorials/tags/topdown)
- [Pixel Art Tutorial, Part 1: Basics & Tools — Gamedeveloper.com](https://www.gamedeveloper.com/art/pixel-art-tutorial-part-1-basics-tools)
- [Pixelblog #1: Color Palettes — Slynyrd](https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes)
- [How to start making pixel art #6: Basic Color Theory — Pedro Medeiros / Pixel Grimoire](https://medium.com/pixel-grimoire/how-to-start-making-pixel-art-6-a74f562a4056)
- [Color Theory for Pixel Artists: It's All Relative — Pixel Parmesan](https://pixelparmesan.com/blog/color-theory-for-pixel-artists-its-all-relative)
- [Pixel Art Hueshifting Tutorials — Lospec](https://lospec.com/pixel-art-tutorials/tags/hueshifting)
- [How to Draw Pixel Art Characters — Pixnote](https://pixnote.net/en/learn/character/)
- [Using Kenney's sprites — Red Blob Games](https://www.redblobgames.com/x/1608-kenney-sprites/)
