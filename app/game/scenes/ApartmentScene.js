/* ============================================
   ApartmentScene — Interior room, player + NPC tutor
   ============================================ */

const APARTMENT_COLS = 12;
const APARTMENT_ROWS = 9;

class ApartmentScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Apartment' });
  }

  create() {
    const T = GAME_CONFIG.TILE_SIZE;
    const roomW = APARTMENT_COLS * T;
    const roomH = APARTMENT_ROWS * T;

    // -------------------------------------------------------
    // 1. Draw floor and wall border
    // -------------------------------------------------------
    const gfx = this.add.graphics();

    // Floor fill
    gfx.fillStyle(0xD4C4A0);
    gfx.fillRect(0, 0, roomW, roomH);

    // Wall border (1-tile thick)
    gfx.lineStyle(T, 0x8B7355);
    gfx.strokeRect(T / 2, T / 2, roomW - T, roomH - T);

    // -------------------------------------------------------
    // 2. Player
    // -------------------------------------------------------
    const spawnX = 2 * T + T / 2;
    const spawnY = 4 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // -------------------------------------------------------
    // 3. NPC
    // -------------------------------------------------------
    const npcX = 8 * T + T / 2;
    const npcY = 4 * T + T / 2;
    this._npc = new NPC(this, npcX, npcY, { id: 'tutor', name: 'Tutor', tileSize: T });

    // -------------------------------------------------------
    // 4. World bounds
    // -------------------------------------------------------
    this.physics.world.setBounds(0, 0, roomW, roomH);

    // -------------------------------------------------------
    // 5. Camera
    // -------------------------------------------------------
    this.cameras.main.setBounds(0, 0, roomW, roomH);
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
    // 7. Dialogue-end listener → resume physics
    // -------------------------------------------------------
    this._onDialogueEnd = () => {
      this.physics.resume();
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
  }

  update() {
    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;

    this._player.update(this._cursors, this._wasd);
    this._npc.checkInteraction(px, py, Phaser.Input.Keyboard.JustDown(this._eKey));
  }

  shutdown() {
    window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
  }
}
