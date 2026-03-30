/* ============================================
   TestScene — Chapter test room with Professor NPC.
   Launched via scene.start('Test', { chapter: N }).
   ============================================ */

// TILE INDEX (roguelike-indoors, 27-col sheet, N = row*27+col)
// floor_a: 0, floor_b: 1, wall: 239, desk: 266

const TEST_COLS = 12;
const TEST_ROWS = 9;

class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Test' });
  }

  create(data) {
    const T = GAME_CONFIG.TILE_SIZE;
    const roomW = TEST_COLS * T;
    const roomH = TEST_ROWS * T;

    this._chapter = (data && data.chapter) ? data.chapter : 1;
    this._testActive = false;

    // -------------------------------------------------------
    // 1. Draw floor and wall border
    // -------------------------------------------------------
    const FLOOR_A = 0;
    const FLOOR_B = 1;
    const WALL_FRAME = 239;
    const DESK_FRAME = 266;

    // Floor tiles (inner area, excluding wall perimeter)
    for (let r = 1; r < TEST_ROWS - 1; r++) {
      for (let c = 1; c < TEST_COLS - 1; c++) {
        const frame = (r + c) % 2 === 0 ? FLOOR_A : FLOOR_B;
        this.add.image(c * T + T / 2, r * T + T / 2, 'indoors', frame);
      }
    }

    // Wall perimeter tiles
    for (let c = 0; c < TEST_COLS; c++) {
      this.add.image(c * T + T / 2, T / 2, 'indoors', WALL_FRAME);
      this.add.image(c * T + T / 2, (TEST_ROWS - 1) * T + T / 2, 'indoors', WALL_FRAME);
    }
    for (let r = 1; r < TEST_ROWS - 1; r++) {
      this.add.image(T / 2, r * T + T / 2, 'indoors', WALL_FRAME);
      this.add.image((TEST_COLS - 1) * T + T / 2, r * T + T / 2, 'indoors', WALL_FRAME);
    }

    // Professor's desk — 3 tiles wide at row 3
    for (let c = 6; c <= 8; c++) {
      this.add.image(c * T + T / 2, 3 * T + T / 2, 'indoors', DESK_FRAME);
    }

    // -------------------------------------------------------
    // 2. Player
    // -------------------------------------------------------
    const spawnX = 2 * T + T / 2;
    const spawnY = 4 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // -------------------------------------------------------
    // 3. Professor NPC
    // -------------------------------------------------------
    const npcX = 8 * T + T / 2;
    const npcY = 4 * T + T / 2;
    this._professor = new NPC(this, npcX, npcY, {
      id: 'professor',
      name: 'Professor',
      tileSize: T,
    });

    // -------------------------------------------------------
    // 4. World bounds
    // -------------------------------------------------------
    this.physics.world.setBounds(0, 0, roomW, roomH);

    // -------------------------------------------------------
    // 5. Camera
    // -------------------------------------------------------
    this.cameras.main.setBounds(0, 0, roomW, roomH);
    this.cameras.main.startFollow(
      this._player.gameObject,
      true,
      GAME_CONFIG.CAMERA_LERP,
      GAME_CONFIG.CAMERA_LERP
    );
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
    // 7. Event listeners
    // -------------------------------------------------------
    this._onTestEnd = () => {
      this._testActive = false;
    };
    window.addEventListener(EVENTS.TEST_END, this._onTestEnd);

    this._onTestDismiss = () => {
      this.physics.resume();
      this.scene.start('World');
    };
    window.addEventListener(EVENTS.TEST_DISMISS, this._onTestDismiss);

    // -------------------------------------------------------
    // 8. Location enter event for HUD
    // -------------------------------------------------------
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Exam Room' },
    }));
  }

  update() {
    if (this._testActive) { return; }

    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;
    const eDown = Phaser.Input.Keyboard.JustDown(this._eKey);

    this._player.update(this._cursors, this._wasd);

    if (eDown) {
      const dx = px - this._professor.gameObject.x;
      const dy = py - this._professor.gameObject.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= GAME_CONFIG.INTERACTION_RADIUS) {
        this._testActive = true;
        this.physics.pause();
        window.dispatchEvent(new CustomEvent(EVENTS.TEST_START, {
          detail: { chapter: this._chapter },
        }));
      }
    }
  }

  shutdown() {
    window.removeEventListener(EVENTS.TEST_END, this._onTestEnd);
    window.removeEventListener(EVENTS.TEST_DISMISS, this._onTestDismiss);
    this._player.destroy();
    this._professor.destroy();
  }
}
