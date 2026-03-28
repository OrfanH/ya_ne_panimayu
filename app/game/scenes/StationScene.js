/* ============================================
   StationScene — Train station with Konstantin + Nadya NPCs.
   Unlocked after market visit.
   ============================================ */

const STATION_COLS = 16;
const STATION_ROWS = 10;

class StationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Station' });
  }

  create() {
    const T = GAME_CONFIG.TILE_SIZE;
    const stW = STATION_COLS * T;
    const stH = STATION_ROWS * T;

    const gfx = this.add.graphics();

    // Floor — concrete grey
    gfx.fillStyle(0xB0B0B0);
    gfx.fillRect(0, 0, stW, stH);

    // Tile pattern
    for (let row = 0; row < STATION_ROWS; row++) {
      for (let col = 0; col < STATION_COLS; col++) {
        if ((row + col) % 2 === 0) {
          gfx.fillStyle(0xA0A0A0);
          gfx.fillRect(col * T, row * T, T, T);
        }
      }
    }

    // Walls
    gfx.lineStyle(T, 0x888888);
    gfx.strokeRect(T / 2, T / 2, stW - T, stH - T);

    // Platform line (yellow safety stripe)
    gfx.fillStyle(0xDDCC44);
    gfx.fillRect(0, 2 * T - 2, stW, 4);

    // Ticket window
    gfx.fillStyle(0x6B6B6B);
    gfx.fillRect(2 * T, 3 * T, 3 * T, 2 * T);
    gfx.fillStyle(0xAADDFF);
    gfx.fillRect(2 * T + T * 0.3, 3 * T + T * 0.2, 2.4 * T, T);

    // Benches
    gfx.fillStyle(0x555555);
    gfx.fillRect(8 * T, 6 * T, 2 * T, T * 0.4);
    gfx.fillRect(12 * T, 6 * T, 2 * T, T * 0.4);

    // Player
    const spawnX = 8 * T;
    const spawnY = 8 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // NPCs
    const konstantinData = STATION_DIALOGUE.KONSTANTIN;
    this._konstantin = new NPC(this, 3 * T + T / 2, 5 * T + T / 2, {
      id: konstantinData.id, name: konstantinData.name, tileSize: T,
    });

    const nadyaData = STATION_DIALOGUE.NADYA;
    this._nadya = new NPC(this, 12 * T + T / 2, 4 * T + T / 2, {
      id: nadyaData.id, name: nadyaData.name, tileSize: T,
    });

    // Physics + camera
    this.physics.world.setBounds(0, 0, stW, stH);
    this.cameras.main.setBounds(0, 0, stW, stH);
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
      if (detail.npcId === konstantinData.id) {
        TutorAI.startConversation(konstantinData);
      } else if (detail.npcId === nadyaData.id) {
        TutorAI.startConversation(nadyaData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    this._onDialogueEnd = () => { this.physics.resume(); };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // HUD + unlock
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Train Station' },
    }));

    getProgress().then((progress) => {
      if (!progress.unlockedLocations.includes('police')) {
        progress.unlockedLocations.push('police');
        saveProgress(progress);
      }
    });
  }

  update() {
    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;
    const eDown = Phaser.Input.Keyboard.JustDown(this._eKey);
    this._player.update(this._cursors, this._wasd);
    this._konstantin.checkInteraction(px, py, eDown);
    this._nadya.checkInteraction(px, py, eDown);
  }

  shutdown() {
    window.removeEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
  }
}
