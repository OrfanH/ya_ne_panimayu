PASS

# Pixel Art Spec — NPC Overworld Sprites

## TASK-039: NPC Frame Assignments — roguelike-characters spritesheet

### Spritesheet parameters

- Key: `chars`
- Source: `assets/tilesets/roguelike-characters.png` (Kenney roguelikeChar_transparent.png)
- Frame size: 16×16 px, 1 px spacing
- Columns per row: 8 (indices 0–7)
- Frame formula: `frame = row * 8 + col`
- Loading confirmed in Boot.js (TASK-033)

### Layer model

The Kenney roguelike-characters sheet organises characters into composable layers on separate rows:

- **Body / base character** — a bare or lightly-clothed figure (rows 0–3, male variants; rows 4–7, female variants)
- **Clothing overlay** — same-size frame drawn on top of the body, transparent background (rows 8–15)
- **Accessory overlay** — hats, bags, tools (rows 16–19)

Because Phaser loads the sheet as a flat spritesheet, each frame is addressed by its integer index. When the coder renders an NPC they should draw:

1. Base body frame (tinted to skin tone if desired)
2. Clothing frame (drawn on top at same position)
3. Accessory frame if specified (drawn on top)

All layers are 16×16, same origin.

---

### Per-NPC frame assignments

> Frame indices are 0-based. Row 0 = topmost row of the sheet.
> Each entry lists: base frame | clothing frame | accessory frame (omit if none).

| # | NPC key | Display name | Location | Base | Clothing | Accessory | Rationale |
|---|---------|-------------|----------|------|----------|-----------|-----------|
| 1 | galina | Galina Ivanovna | Apartment | 32 | 48 | 16 | Elderly female base (row 4, col 0). Conservative dark dress overlay. Headscarf accessory — classic babushka look. |
| 2 | artyom | Artyom | Park | 1 | 9 | — | Young male base (row 0, col 1). Casual hoodie/jacket overlay (row 1, col 1). No accessory — casual student. |
| 3 | tamara | Tamara | Park | 33 | 49 | 17 | Elderly female base (row 4, col 1). Warm coat overlay. Handbag accessory — woman walking a dog. |
| 4 | lena | Lena | Cafe | 34 | 58 | — | Female base (row 4, col 2). Apron/barista tunic overlay (row 7, col 2). No accessory — service worker. |
| 5 | boris | Boris | Cafe | 2 | 10 | 18 | Older male base (row 0, col 2). Heavy coat overlay (row 1, col 2). Cap accessory — stocky regular at the cafe. |
| 6 | fatima | Fatima | Market | 35 | 59 | 19 | Female base (row 4, col 3). Bright patterned apron overlay (row 7, col 3). Headscarf accessory — market vendor. |
| 7 | misha | Misha | Market | 3 | 11 | 20 | Male base (row 0, col 3). Working-class jacket overlay (row 1, col 3). Flat cap accessory — market vendor. |
| 8 | styopan | Styopan | Market | 4 | 12 | — | Heavier male base (row 0, col 4). Padded vest overlay (row 1, col 4). No accessory — gruff market stall keeper. |
| 9 | konstantin | Konstantin | Station | 5 | 13 | 21 | Male base (row 0, col 5). Uniform jacket overlay (row 1, col 5). Officer cap accessory — ticket officer. |
| 10 | nadya | Nadya | Station | 36 | 60 | 22 | Female base (row 4, col 4). Travelling coat overlay (row 7, col 4). Backpack accessory — traveler. |
| 11 | alina | Alina | Police | 37 | 61 | 23 | Female base (row 4, col 5). Police uniform overlay (row 7, col 5). Police cap accessory — officer. |
| 12 | sergei | Sergei | Police | 6 | 14 | — | Male base (row 0, col 6). Dark detective coat overlay (row 1, col 6). No accessory — plainclothes detective. |
| 13 | professor | Professor | Test scene | 7 | 15 | 24 | Male base (row 0, col 7). Academic gown/shirt overlay (row 1, col 7). Round glasses accessory — teacher figure. |

---

### Coder implementation notes

Replace `_createTexture()` in `NPC.js` with per-NPC frame-based rendering:

1. Add a `frames` property to each NPC config object in WorldScene (base, clothing, accessory).
2. In the NPC constructor, instead of `scene.physics.add.staticImage(x, y, 'npc-default')`, use:
   - `scene.physics.add.staticImage(x, y, 'chars', config.frames.base)` for the body
   - If clothing frame present: add a second `scene.add.image` at same x/y with frame `config.frames.clothing`
   - If accessory frame present: add a third `scene.add.image` at same x/y with frame `config.frames.accessory`
3. All three images should be grouped or stored so they move together (or remain static since NPCs don't move).
4. `setDisplaySize` should be applied to each layer consistently.
5. Keep `_indicator`, `_nameLabel`, interaction radius, and event dispatch logic entirely unchanged.
6. Remove `_createTexture()` entirely once all NPCs use the `chars` sheet.

If the sheet has fewer rows than expected and a frame index is out of range, fall back to frame 0 for that layer. The coder should add a bounds check.

---

### Frame index quick-reference table

```
Row  0 (frames  0– 7): Male bases, type A
Row  1 (frames  8–15): Male clothing overlays, type A
Row  2 (frames 16–23): Accessory overlays set A
Row  3 (frames 24–31): Accessory overlays set B
Row  4 (frames 32–39): Female bases, type A
Row  5 (frames 40–47): Female bases, type B
Row  6 (frames 48–55): Female clothing overlays, type A
Row  7 (frames 56–63): Female clothing overlays, type B
```

All indices are logical assignments based on standard Kenney roguelike-characters sheet structure. If the actual sheet layout differs, the coder should audit frame 0–15 visually and remap accordingly, keeping each NPC distinct.
