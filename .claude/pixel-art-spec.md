FAIL — TASK-056 audit found all frame assignments wrong. See handoffs/pixel-art-report.md.

# Pixel Art Spec — NPC Overworld Sprites

## TASK-056: NPC Frame Assignments — roguelike-characters spritesheet (VERIFIED AUDIT)

> **Supersedes TASK-039 spec.** All previous frame numbers were derived from a wrong column-count assumption and must not be used.

### Spritesheet parameters (verified 2026-03-30)

- Key: `chars`
- Source: `assets/tilesets/roguelike-characters.png` (Kenney roguelikeChar_transparent.png)
- Image dimensions: **918 × 203 px**
- Frame size: 16×16 px, 1 px spacing
- **Columns per row: 54** (previously assumed: 8 — WRONG)
- **Rows: 12** (previously assumed: 20 — WRONG)
- **Total frames: 648**
- **Correct frame formula: `frame = row * 54 + col`**
- Loading confirmed in Boot.js: `frameWidth: 16, frameHeight: 16, spacing: 1`
- `pixelArt: true` confirmed in `app/game/main.js` line 10

---

### Actual sheet layout (pixel-verified)

```
Within each ROW, columns are organised as groups:

Col  0–1:  Complete south-facing character sprites (2 poses/variants)
Col  2:    EMPTY separator
Col  3–4:  Shoe/foot accessories (tiny - bottom of frame only)
Col  5:    EMPTY separator
Col  6–9:  RED clothing overlays (4 animation directions: S, S-walk, E/W, N)
Col 10–13: GREEN/teal clothing overlays (4 directions)
Col 14–17: BLUE/purple clothing overlays (4 directions)
Col 18:    EMPTY separator
Col 19–26: Head accessories / headscarves / hats (8 types, grey then red variants)
Col 27:    EMPTY separator
Col 28–31: Face detail overlays (expressions, beards)
Col 32:    EMPTY separator
Col 33–40: Equipment overlays (weapons, bags, items)
Col 41:    EMPTY separator
Col 42–53: Additional equipment / character pieces
```

```
ROWS = character type variants. Each row has the same column layout above.

Row  0 (frames   0–53):  Pale/fair skin character, south-facing
Row  1 (frames  54–107): Same pale skin body (identical col 0-1) — different clothing silhouettes in cols 6-17
Row  2 (frames 108–161): Tan/brown skin character, south-facing
Row  3 (frames 162–215): Green-tinted body (fantasy race — skip for human NPCs)
Row  4 (frames 216–269): Nearly EMPTY — col 0-1 empty; limited cols only
Row  5 (frames 270–323): Flesh skin character with built-in red clothing elements in base
Row  6 (frames 324–377): Character with red head/face markings — distinct ethnic/style type
Row  7 (frames 378–431): Hooded/dark-cloaked figure
Row  8 (frames 432–485): Armored/helmeted character, dark orange skin
Row  9 (frames 486–539): Red-cloaked figure with visible flesh face
Row 10 (frames 540–593): Two-character merged sprite — not suitable as NPC base
Row 11 (frames 594–647): White/grey robed wizard figure
```

---

### Layer model (architecture unchanged, frame numbers corrected)

The 3-layer compositing system is correct:
1. **Base** (col 0 of desired row) — complete assembled character, all skin/body pixels
2. **Clothing** (cols 6, 10, or 14 of desired row) — torso overlay only, transparent head area
3. **Accessory** (cols 19–26 of desired row) — head covering only, transparent body area

For **south-facing static NPCs**, use the **col-6 variant** for clothing (not col 7/8/9 which are side/walk variants).

---

### Frame visual descriptions (key frames verified by pixel analysis)

#### Body bases (col 0 per row)

| Frame | Row | Col | Visual content | Pixels |
|---|---|---|---|---|
| 0 | 0 | 0 | Pale/fair skin, full south-facing body, naked/base layer | 170 |
| 54 | 1 | 0 | Identical to frame 0 — same pale skin base | 170 |
| 108 | 2 | 0 | Tan/brown skin, same proportions as frame 0 | 170 |
| 270 | 5 | 0 | Flesh skin body with built-in red elements (already partially clothed) | 188 |
| 324 | 6 | 0 | Mixed flesh+red character, red markings on head/face area | 170 |
| 378 | 7 | 0 | Mostly dark/outline body with hooded silhouette | 188 |
| 432 | 8 | 0 | Dark orange-brown skin, armored/helmeted head | 186 |
| 486 | 9 | 0 | Red-cloaked figure with flesh face | 184 |
| 594 | 11 | 0 | White/grey robed figure, multicolor elements | 214 |

#### Clothing overlays — south-facing only (col 6, 10, 14 variants)

| Frame | Row | Col | Visual | Pixels |
|---|---|---|---|---|
| 6 | 0 | 6 | Red vest/tunic, shoulder+upper-body, south A (smaller cut) | 78 |
| 7 | 0 | 7 | Red coat, fuller torso coverage, south B | 98 |
| 9 | 0 | 9 | Red uniform jacket with dark/grey accent (formal) | 102 |
| 10 | 0 | 10 | Green/teal vest, south A (smaller cut) | 78 |
| 11 | 0 | 11 | Green coat, fuller coverage, south B | 98 |
| 13 | 0 | 13 | Green uniform jacket with grey accent | 102 |
| 14 | 0 | 14 | Blue/purple vest, south A (smaller cut) | 78 |
| 15 | 0 | 15 | Blue coat, fuller coverage, south B | 98 |
| 17 | 0 | 17 | Blue uniform jacket with grey accent (police/official) | 102 |
| 60 | 1 | 6 | Red lower-body dominant clothing (skirt/trousers heavy) | 58 |
| 61 | 1 | 7 | Red variant, side-weighted silhouette | 72 |
| 64 | 1 | 10 | Green lower-body dominant | 58 |
| 68 | 1 | 14 | Blue lower-body dominant | 58 |
| 114 | 2 | 6 | Red clothing for tan-skin character | 86 |
| 118 | 2 | 10 | Green clothing for tan-skin character | 86 |
| 122 | 2 | 14 | Blue/grey clothing for tan-skin character | 86 |
| 276 | 5 | 6 | Red clothing for row-5 character | 78 |
| 334 | 6 | 10 | Green clothing for row-6 character (verify non-empty) | ~78 |
| 392 | 7 | 14 | Blue clothing for row-7 character (verify non-empty) | ~78 |
| 492 | 9 | 6 | Red/clothing for row-9 character (verify non-empty) | ~78 |

#### Head accessories (cols 19–26)

**Row 0 accessories (grey palette):**

| Frame | Col | Visual | Pixels |
|---|---|---|---|
| 19 | 19 | Tiny flat beret outline — barely visible (just top 4 rows) | 16 |
| 20 | 20 | **Tall hood/headscarf** — wraps head and extends down neck, babushka-style | 42 |
| 21 | 21 | Flat cap with visor/cross element below | 22 |
| 22 | 22 | Rounded hat with chin strap or neck wrap | 36 |

**Row 0 accessories (red palette — cols 23–26):**

| Frame | Col | Visual | Pixels |
|---|---|---|---|
| 23 | 23 | Red flat beret/cap (tiny — just top of frame) | 16 |
| 24 | 24 | **Red tall hood/headscarf** — same babushka shape as frame 20 but red | 42 |
| 25 | 25 | Red flat cap with visor | 22 |
| 26 | 26 | Red rounded hat with neck wrap | 36 |

**Row 1 accessories:**

| Frame | Col | Visual | Pixels |
|---|---|---|---|
| 73 | 19 | Thin cap outline (slightly wider brim than frame 19) | 28 |
| 74 | 20 | Hood extending LEFT only (asymmetric — unusual) | 42 |
| 75 | 21 | Hood extending RIGHT only | 42 |
| 76 | 22 | Full symmetric hood wrapping full neck | 42 |

**Row 2 accessories (for tan skin character):**

| Frame | Col | Visual | Pixels |
|---|---|---|---|
| 127 | 19 | Brim hat with glasses element | 24 |
| 128 | 20 | Very small 3-pixel tall flat cap (tiny) | 12 |
| 129 | 21 | **Wide-brim hat / academic mortarboard** — most hat-like | 32 |
| 130 | 22 | Small ear/side pieces only | 8 |
| 133 | 25 | Red wide-brim hat | 32 |

---

### Corrected NPC_FRAMES assignments

Replace the entire `NPC_FRAMES` object in `app/game/entities/NPC.js`:

```javascript
const NPC_FRAMES = {
  // galina: elderly woman, babushka headscarf
  // row0 base (pale) + green clothing + grey hood/headscarf accessory
  galina:     { base: 0,   clothing: 10,  accessory: 20 },

  // artyom: young male student, casual
  // row1 base (same pale body, different clothing cuts available) + green vest
  artyom:     { base: 54,  clothing: 64 },

  // tamara: elderly woman walking dog, warm coat
  // row0 base + red fuller coat + rounded hat with neck wrap
  tamara:     { base: 0,   clothing:  7,  accessory: 22 },

  // lena: female barista
  // row2 base (tan skin = distinct from galina/tamara) + green clothing
  lena:       { base: 108, clothing: 118 },

  // boris: stocky older male, cap
  // row0 base + blue fuller coat + flat cap accessory
  boris:      { base: 0,   clothing: 15,  accessory: 19 },

  // fatima: female market vendor, headscarf
  // row2 base (tan skin) + red clothing + red headscarf accessory
  fatima:     { base: 108, clothing: 114, accessory: 24 },

  // misha: male market vendor, flat cap
  // row1 base + red lower-cut clothing + cap-with-visor
  misha:      { base: 54,  clothing: 60,  accessory: 21 },

  // styopan: heavy male, vest (built-in clothing in row 5 base)
  // row5 base has clothing elements built in + red clothing overlay
  styopan:    { base: 270, clothing: 276 },

  // konstantin: male uniform, officer cap
  // row0 base + blue uniform jacket (formal grey accent) + rounded hat
  konstantin: { base: 0,   clothing: 17,  accessory: 26 },

  // nadya: female traveler, backpack
  // row6 base (distinct red-face markings) + green clothing
  nadya:      { base: 324, clothing: 334 },

  // alina: female police officer
  // row7 base (hooded/dark = police severity) + blue clothing
  alina:      { base: 378, clothing: 392 },

  // sergei: male detective
  // row9 base (red cloak = overcoat detective look)
  sergei:     { base: 486, clothing: 492 },

  // professor: male academic, glasses
  // row2 base (tan skin) + blue/grey clothing + wide-brim academic hat
  professor:  { base: 108, clothing: 122, accessory: 129 },
};
```

---

### Coder implementation notes

The existing NPC.js architecture is correct — no structural changes needed. Only the `NPC_FRAMES` constant values need replacing.

Key points:
- The `safeFrame()` guard already in NPC.js handles any out-of-range frame by falling back to frame 0.
- South-facing clothing uses col 6 (smaller cut) or col 7 (fuller cut) within each row. Both are valid; the assignments above use the fuller cut (col 7 offset where applicable) for better visibility at 28×28 display size.
- `pixelArt: true` is confirmed in `app/game/main.js` — 16×16 upscaled to 28×28 will render crisp.
- Frames 334, 392, 492 are predicted non-empty but should be verified with `scene.textures.get('chars').frameTotal`.

---

### Frame quick-reference (corrected)

```
All frames: frame = row * 54 + col
Sheet: 918×203px, 54 cols, 12 rows, 16×16 frames, 1px spacing

Body bases (col 0):      row * 54
Red clothing S (col 6):  row * 54 + 6
Green clothing S (col 10): row * 54 + 10
Blue clothing S (col 14):  row * 54 + 14
Hat/hood type A (col 19):  row * 54 + 19
Hood/babushka (col 20):    row * 54 + 20
Cap+visor (col 21):        row * 54 + 21
Round hat (col 22):        row * 54 + 22
Red variants:              row * 54 + 23..26
Academic mortarboard:      2 * 54 + 21 = 129 (row 2 only)
```
