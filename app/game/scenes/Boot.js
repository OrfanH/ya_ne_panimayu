/* ============================================
   Boot Scene — Asset preloading + animation registration
   ============================================ */

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x191919);

    this.add.text(width / 2, height / 2 - 48, 'Один Семестр', {
      fontFamily: 'monospace',
      fontSize:   '20px',
      color:      '#F7F7F5',
    }).setOrigin(0.5);

    // Loading bar
    const bx = width / 2 - 150;
    const by = height / 2 - 10;
    const bw = 300;
    const bh = 20;

    const border = this.add.graphics();
    border.lineStyle(2, 0x3D3A8C);
    border.strokeRect(bx - 1, by - 1, bw + 2, bh + 2);

    const bar = this.add.graphics();
    this.load.on('progress', (v) => {
      bar.clear();
      bar.fillStyle(0x3D3A8C);
      bar.fillRect(bx, by, bw * v, bh);
    });

    /*
     * Kenney RPG Urban Pack — tilemap_packed.png
     * 432 × 288 px  |  27 cols × 18 rows  |  16 × 16 tiles  |  0 px spacing
     * Frame index:  col = N % 27,  row = Math.floor(N / 27)
     * Pixel origin: x = col × 16,  y = row × 16
     *
     * Key frames used by this game:
     *   Ground tiles (terrain)
     *     0   — grass (bright green)
     *     27  — grass dark (row 1, col 0)
     *     81  — sidewalk / path (row 3, col 0, grey)
     *     16  — brick wall (row 0, col 16)
     *
     *   Character sprites — cols 23-26 of every row
     *     Player (char 1):  rows 0-3  → frames 23-26, 50-53, 77-80, 104-107
     *     NPC    (char 2):  row  4    → frame 131 (static)
     */
    this.load.spritesheet('urban', 'assets/tilesets/tilemap_packed.png', {
      frameWidth:  16,
      frameHeight: 16,
    });

    // Kenney Roguelike Modern City — 37×28 tiles, 16×16 px, 1px spacing
    this.load.spritesheet('city', 'assets/tilesets/roguelike-city.png', {
      frameWidth:  16,
      frameHeight: 16,
      spacing:     1,
    });

    // Kenney Roguelike Indoors — 16×16 px, 1px spacing
    this.load.spritesheet('indoors', 'assets/tilesets/roguelike-indoors.png', {
      frameWidth:  16,
      frameHeight: 16,
      spacing:     1,
    });

    // Kenney Roguelike Characters — 16×16 px, 1px spacing
    this.load.spritesheet('chars', 'assets/tilesets/roguelike-characters.png', {
      frameWidth:  16,
      frameHeight: 16,
      spacing:     1,
    });
  }

  create() {
    // Player walk animations  (4 frames per direction)
    const ANIM_FPS = 8;

    // Row 0, cols 23-26 → facing down
    this.anims.create({
      key:       'player-walk-down',
      frames:    this.anims.generateFrameNumbers('urban', { start: 23, end: 26 }),
      frameRate: ANIM_FPS,
      repeat:    -1,
    });

    // Row 1, cols 23-26 → facing up
    this.anims.create({
      key:       'player-walk-up',
      frames:    this.anims.generateFrameNumbers('urban', { start: 50, end: 53 }),
      frameRate: ANIM_FPS,
      repeat:    -1,
    });

    // Row 2, cols 23-26 → facing right (flipped for left)
    this.anims.create({
      key:       'player-walk-side',
      frames:    this.anims.generateFrameNumbers('urban', { start: 77, end: 80 }),
      frameRate: ANIM_FPS,
      repeat:    -1,
    });

    this.scene.start('World');
  }
}
