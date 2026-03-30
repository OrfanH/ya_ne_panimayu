/* ============================================
   MarketScene — Open-air market with 3 vendor NPCs.
   Unlocked after cafe visit.
   ============================================ */

// TILE INDEX (roguelike-indoors, 27-col sheet, N = row*27+col)
// floor_a: 324, floor_b: 325, wall: 266, furniture: [23, 341, 131]

const MARKET_COLS = 18;
const MARKET_ROWS = 12;

class MarketScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Market' });
  }

  create() {
    const T = GAME_CONFIG.TILE_SIZE;
    const marketW = MARKET_COLS * T;
    const marketH = MARKET_ROWS * T;

    // -------------------------------------------------------
    // 1. Draw market ground using indoors spritesheet
    // -------------------------------------------------------
    const gfx = this.add.graphics();

    const COLS = MARKET_COLS;
    const ROWS = MARKET_ROWS;
    const FLOOR_A = 324;
    const FLOOR_B = 325;
    const WALL_FRAME = 266;

    // Floor tiles (inner area, excluding wall perimeter)
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const frame = (r + c) % 2 === 0 ? FLOOR_A : FLOOR_B;
        this.add.image(c * T + T / 2, r * T + T / 2, 'indoors', frame);
      }
    }

    // Wall perimeter tiles
    for (let c = 0; c < COLS; c++) {
      this.add.image(c * T + T / 2, T / 2,                   'indoors', WALL_FRAME); // top
      this.add.image(c * T + T / 2, (ROWS - 1) * T + T / 2, 'indoors', WALL_FRAME); // bottom
    }
    for (let r = 1; r < ROWS - 1; r++) {
      this.add.image(T / 2,                  r * T + T / 2, 'indoors', WALL_FRAME); // left
      this.add.image((COLS - 1) * T + T / 2, r * T + T / 2, 'indoors', WALL_FRAME); // right
    }

    // Furniture (near corners, avoiding player spawn col 9 row 10, NPCs at col 4 row 4, col 9 row 3, col 14 row 4)
    this.add.image(2 * T + T / 2,   2 * T + T / 2,  'indoors', 23);  // top-left corner
    this.add.image(16 * T + T / 2,  2 * T + T / 2,  'indoors', 341); // top-right corner
    this.add.image(16 * T + T / 2,  10 * T + T / 2, 'indoors', 131); // bottom-right corner

    // Main aisle (horizontal)
    gfx.fillStyle(0xC8B898);
    gfx.fillRect(0, 5 * T, marketW, 2 * T);

    // -------------------------------------------------------
    // 2. Market stalls
    // -------------------------------------------------------
    this._drawStalls(gfx, T);

    // -------------------------------------------------------
    // 3. Player
    // -------------------------------------------------------
    const spawnX = 9 * T;
    const spawnY = 10 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // -------------------------------------------------------
    // 4. NPCs — Fatima, Misha, Styopan at their stalls
    // -------------------------------------------------------
    const fatimaData = MARKET_DIALOGUE.FATIMA;
    this._fatima = new NPC(this, 4 * T + T / 2, 4 * T + T / 2, {
      id: fatimaData.id, name: fatimaData.name, tileSize: T,
    });

    const mishaData = MARKET_DIALOGUE.MISHA;
    this._misha = new NPC(this, 9 * T + T / 2, 3 * T + T / 2, {
      id: mishaData.id, name: mishaData.name, tileSize: T,
    });

    const styopanData = MARKET_DIALOGUE.STYOPAN;
    this._styopan = new NPC(this, 14 * T + T / 2, 4 * T + T / 2, {
      id: styopanData.id, name: styopanData.name, tileSize: T,
    });

    // -------------------------------------------------------
    // 5. World bounds + camera
    // -------------------------------------------------------
    this.physics.world.setBounds(0, 0, marketW, marketH);
    this.cameras.main.setBounds(0, 0, marketW, marketH);
    this.cameras.main.startFollow(this._player.gameObject, true, GAME_CONFIG.CAMERA_LERP, GAME_CONFIG.CAMERA_LERP);
    this.cameras.main.fadeIn(300);

    // -------------------------------------------------------
    // 6. Input
    // -------------------------------------------------------
    this._eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this._cursors = this.input.keyboard.createCursorKeys();
    this._wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // -------------------------------------------------------
    // 7. Dialogue listeners
    // -------------------------------------------------------
    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (TutorAI.isActive()) { return; }
      if (detail.npcId === fatimaData.id) {
        TutorAI.startConversation(fatimaData);
      } else if (detail.npcId === mishaData.id) {
        TutorAI.startConversation(mishaData);
      } else if (detail.npcId === styopanData.id) {
        TutorAI.startConversation(styopanData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    this._onDialogueEnd = () => {
      this.physics.resume();
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // -------------------------------------------------------
    // 8. HUD + unlock chain
    // -------------------------------------------------------
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Market' },
    }));

    getProgress().then((progress) => {
      if (!progress.unlockedLocations.includes('station')) {
        progress.unlockedLocations.push('station');
        saveProgress(progress);
      }
    });
  }

  update() {
    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;
    const eDown = Phaser.Input.Keyboard.JustDown(this._eKey);

    this._player.update(this._cursors, this._wasd);
    this._fatima.checkInteraction(px, py, eDown);
    this._misha.checkInteraction(px, py, eDown);
    this._styopan.checkInteraction(px, py, eDown);
  }

  shutdown() {
    window.removeEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
    this._player.destroy();
  }

  // ---------------------------------------------------------------
  // Private — market stalls
  // ---------------------------------------------------------------
  _drawStalls(gfx, T) {
    const stallDefs = [
      { col: 2, row: 2, cols: 4, rows: 2, color: 0xD95F3B, label: 'Produce' },
      { col: 7, row: 1, cols: 4, rows: 2, color: 0xC97C3A, label: 'Bread' },
      { col: 12, row: 2, cols: 4, rows: 2, color: 0x3A7FC1, label: 'Goods' },
    ];

    for (const stall of stallDefs) {
      const x = stall.col * T;
      const y = stall.row * T;
      const w = stall.cols * T;
      const h = stall.rows * T;

      // Stall base
      gfx.fillStyle(0x8B6B42);
      gfx.fillRect(x, y, w, h);

      // Awning
      gfx.fillStyle(stall.color);
      gfx.fillRect(x - T * 0.3, y - T * 0.5, w + T * 0.6, T * 0.6);

      // Counter front
      gfx.fillStyle(0x6B4226);
      gfx.fillRect(x, y + h - T * 0.3, w, T * 0.3);
    }
  }
}
