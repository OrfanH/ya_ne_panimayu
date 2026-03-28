/* ============================================
   PoliceScene — Police station with Alina + Sergei NPCs.
   Unlocked after train station visit.
   ============================================ */

const POLICE_COLS = 14;
const POLICE_ROWS = 10;

class PoliceScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Police' });
  }

  create() {
    const T = GAME_CONFIG.TILE_SIZE;
    const polW = POLICE_COLS * T;
    const polH = POLICE_ROWS * T;

    const gfx = this.add.graphics();

    // Floor — institutional beige
    gfx.fillStyle(0xD8D0C0);
    gfx.fillRect(0, 0, polW, polH);

    // Linoleum pattern
    for (let row = 0; row < POLICE_ROWS; row++) {
      for (let col = 0; col < POLICE_COLS; col++) {
        if ((row + col) % 2 === 0) {
          gfx.fillStyle(0xCEC6B6);
          gfx.fillRect(col * T, row * T, T, T);
        }
      }
    }

    // Walls
    gfx.lineStyle(T, 0x9090A0);
    gfx.strokeRect(T / 2, T / 2, polW - T, polH - T);

    // Front desk
    gfx.fillStyle(0x6B6B7B);
    gfx.fillRect(3 * T, 3 * T, 8 * T, T * 0.6);

    // Filing cabinets (back wall)
    gfx.fillStyle(0x777788);
    gfx.fillRect(2 * T, T + T * 0.2, 2 * T, T * 1.5);
    gfx.fillRect(5 * T, T + T * 0.2, 2 * T, T * 1.5);
    gfx.fillRect(8 * T, T + T * 0.2, 2 * T, T * 1.5);

    // Waiting chairs
    gfx.fillStyle(0x555566);
    gfx.fillRect(3 * T, 7 * T, T * 0.6, T * 0.6);
    gfx.fillRect(5 * T, 7 * T, T * 0.6, T * 0.6);
    gfx.fillRect(7 * T, 7 * T, T * 0.6, T * 0.6);

    // Player
    const spawnX = 7 * T;
    const spawnY = 8 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // NPCs
    const alinaData = POLICE_DIALOGUE.ALINA;
    this._alina = new NPC(this, 7 * T, 2 * T + T / 2, {
      id: alinaData.id, name: alinaData.name, tileSize: T,
    });

    const sergeiData = POLICE_DIALOGUE.SERGEI;
    this._sergei = new NPC(this, 11 * T + T / 2, 5 * T + T / 2, {
      id: sergeiData.id, name: sergeiData.name, tileSize: T,
    });

    // Physics + camera
    this.physics.world.setBounds(0, 0, polW, polH);
    this.cameras.main.setBounds(0, 0, polW, polH);
    this.cameras.main.startFollow(this._player.gameObject, true, GAME_CONFIG.CAMERA_LERP, GAME_CONFIG.CAMERA_LERP);
    this.cameras.main.fadeIn(300);

    // Input
    this._eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this._cursors = this.input.keyboard.createCursorKeys();
    this._wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Dialogue
    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (detail.npcId === alinaData.id) {
        TutorAI.startConversation(alinaData);
      } else if (detail.npcId === sergeiData.id) {
        TutorAI.startConversation(sergeiData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    this._onDialogueEnd = () => { this.physics.resume(); };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // HUD
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Police Station' },
    }));
  }

  update() {
    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;
    const eDown = Phaser.Input.Keyboard.JustDown(this._eKey);
    this._player.update(this._cursors, this._wasd);
    this._alina.checkInteraction(px, py, eDown);
    this._sergei.checkInteraction(px, py, eDown);
  }

  shutdown() {
    window.removeEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
  }
}
