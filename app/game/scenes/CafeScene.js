/* ============================================
   CafeScene — Warm cafe interior with Lena + Boris NPCs.
   Unlocked after park visit via Artyom's story beat.
   ============================================ */

// TILE INDEX (roguelike-indoors, 27-col sheet, N = row*27+col)
// floor_a: 216, floor_b: 23, wall: 239, furniture: [125, 131, 341]

const CAFE_COLS = 14;
const CAFE_ROWS = 10;

class CafeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Cafe' });
  }

  create() {
    const T = GAME_CONFIG.TILE_SIZE;
    const cafeW = CAFE_COLS * T;
    const cafeH = CAFE_ROWS * T;

    // -------------------------------------------------------
    // 1. Draw cafe interior using indoors spritesheet
    // -------------------------------------------------------
    const gfx = this.add.graphics();

    const COLS = CAFE_COLS;
    const ROWS = CAFE_ROWS;
    const FLOOR_A = 216;
    const FLOOR_B = 23;
    const WALL_FRAME = 239;

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

    // Furniture (near walls, avoiding player spawn col 7 row 8, Lena col 7 row 2, Boris col 11 row 5)
    this.add.image(2 * T + T / 2,  2 * T + T / 2,  'indoors', 125); // top-left area
    this.add.image(12 * T + T / 2, 2 * T + T / 2,  'indoors', 131); // top-right area
    this.add.image(12 * T + T / 2, 8 * T + T / 2,  'indoors', 341); // bottom-right area

    // -------------------------------------------------------
    // 2. Cafe furniture — counter, tables, window
    // -------------------------------------------------------
    this._drawFurniture(gfx, T);

    // -------------------------------------------------------
    // 3. Player
    // -------------------------------------------------------
    const spawnX = 7 * T;
    const spawnY = 8 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // -------------------------------------------------------
    // 4. NPCs — Lena behind counter, Boris at window table
    // -------------------------------------------------------
    const lenaData = CAFE_DIALOGUE.LENA;
    const lenaX = 7 * T;
    const lenaY = 2 * T + T / 2;
    this._lena = new NPC(this, lenaX, lenaY, {
      id: lenaData.id,
      name: lenaData.name,
      tileSize: T,
    });

    const borisData = CAFE_DIALOGUE.BORIS;
    const borisX = 11 * T + T / 2;
    const borisY = 5 * T + T / 2;
    this._boris = new NPC(this, borisX, borisY, {
      id: borisData.id,
      name: borisData.name,
      tileSize: T,
    });

    // -------------------------------------------------------
    // 5. World bounds
    // -------------------------------------------------------
    this.physics.world.setBounds(0, 0, cafeW, cafeH);

    // -------------------------------------------------------
    // 6. Camera
    // -------------------------------------------------------
    this.cameras.main.setBounds(0, 0, cafeW, cafeH);
    this.cameras.main.startFollow(this._player.gameObject, true, GAME_CONFIG.CAMERA_LERP, GAME_CONFIG.CAMERA_LERP);
    this.cameras.main.fadeIn(300);

    // -------------------------------------------------------
    // 7. Input
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
    // 8. Dialogue listeners
    // -------------------------------------------------------
    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (TutorAI.isActive()) { return; }
      if (detail.npcId === lenaData.id) {
        TutorAI.startConversation(lenaData);
      } else if (detail.npcId === borisData.id) {
        TutorAI.startConversation(borisData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    this._onDialogueEnd = () => {
      this.physics.resume();
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // -------------------------------------------------------
    // 9. Location enter event for HUD
    // -------------------------------------------------------
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Café' },
    }));

    // -------------------------------------------------------
    // 10. Unlock market after first cafe visit
    // -------------------------------------------------------
    getProgress().then((progress) => {
      if (!progress.unlockedLocations.includes('market')) {
        progress.unlockedLocations.push('market');
        saveProgress(progress);
      }
    });
  }

  update() {
    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;
    const eDown = Phaser.Input.Keyboard.JustDown(this._eKey);

    this._player.update(this._cursors, this._wasd);
    this._lena.checkInteraction(px, py, eDown);
    this._boris.checkInteraction(px, py, eDown);
  }

  shutdown() {
    window.removeEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
    this._player.destroy();
  }

  // ---------------------------------------------------------------
  // Private — cafe furniture
  // ---------------------------------------------------------------
  _drawFurniture(gfx, T) {
    // Counter (top area, horizontal bar)
    gfx.fillStyle(0x6B4226);
    gfx.fillRect(3 * T, 2 * T, 8 * T, T * 0.6);

    // Counter top surface
    gfx.fillStyle(0x8B6B42);
    gfx.fillRect(3 * T, 2 * T - T * 0.15, 8 * T, T * 0.3);

    // Tables (small squares)
    const tableColor = 0x8B6B42;
    const tables = [
      [3, 5], [3, 7], [6, 5], [6, 7], [10, 5], [10, 7],
    ];
    for (const [col, row] of tables) {
      gfx.fillStyle(tableColor);
      gfx.fillRect(col * T + T * 0.15, row * T + T * 0.15, T * 0.7, T * 0.7);
    }

    // Window — right wall
    gfx.fillStyle(0xAADDFF);
    gfx.fillRect((CAFE_COLS - 1) * T + T * 0.2, 4 * T, T * 0.6, 3 * T);

    // Window frame
    gfx.lineStyle(2, 0x6B4226);
    gfx.strokeRect((CAFE_COLS - 1) * T + T * 0.2, 4 * T, T * 0.6, 3 * T);
  }
}
