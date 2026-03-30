/* ============================================
   ApartmentScene — Interior room, player + NPC tutor
   ============================================ */

// TILE INDEX (roguelike-indoors, 27-col sheet, N = row*27+col)
// floor_a: 0, floor_b: 1, wall: 239, furniture: [131, 125, 341]

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
    // 1. Draw floor and wall border using indoors spritesheet
    // -------------------------------------------------------
    const COLS = APARTMENT_COLS;
    const ROWS = APARTMENT_ROWS;
    const FLOOR_A = 0;
    const FLOOR_B = 1;
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
      this.add.image(T / 2,               r * T + T / 2, 'indoors', WALL_FRAME); // left
      this.add.image((COLS - 1) * T + T / 2, r * T + T / 2, 'indoors', WALL_FRAME); // right
    }

    // Furniture (corners, avoiding player spawn col 2 row 4 and NPC spawn col 8 row 4)
    this.add.image(1 * T + T / 2, 1 * T + T / 2, 'indoors', 131); // top-left corner
    this.add.image(10 * T + T / 2, 1 * T + T / 2, 'indoors', 125); // top-right corner
    this.add.image(10 * T + T / 2, 7 * T + T / 2, 'indoors', 341); // bottom-right corner

    // -------------------------------------------------------
    // 2. Player
    // -------------------------------------------------------
    const spawnX = 2 * T + T / 2;
    const spawnY = 4 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // -------------------------------------------------------
    // 3. NPC — Galina Ivanovna from apartment dialogue content
    // -------------------------------------------------------
    const npcData = APARTMENT_DIALOGUE.NPC_DATA;
    const npcX = 8 * T + T / 2;
    const npcY = 4 * T + T / 2;
    this._npc = new NPC(this, npcX, npcY, {
      id: npcData.id,
      name: npcData.name,
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
    // 7. Dialogue-start listener → init TutorAI with NPC data
    //    Skipped during first-visit scripted mode (_firstVisitScripted flag).
    // -------------------------------------------------------
    this._firstVisitScripted = false;

    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (detail.npcId === npcData.id && !TutorAI.isActive() && !this._firstVisitScripted) {
        const aiNpcData = Object.assign({}, npcData, {
          persona: npcData.persona +
            ' When the student makes a grammar error, naturally model the correct form' +
            ' in your reply without labelling it as an error (recast correction).' +
            ' For example: if the student says "Я хочу идти", you reply using "пойти" naturally in your response.',
        });
        TutorAI.startConversation(aiNpcData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    // -------------------------------------------------------
    // 7b. Dialogue-choice handler for first-visit scripted responses
    //     TutorAI ignores choices when _npcId is null, so this
    //     handler is the sole responder during scripted mode.
    // -------------------------------------------------------
    this._onDialogueChoice = (e) => {
      if (!this._firstVisitScripted) { return; }
      const detail = e.detail || {};
      const choiceId = detail.choiceId;
      const opening = APARTMENT_DIALOGUE.VARIATIONS[0];
      const response = opening.lines.find((l) => l.choiceId === choiceId);
      if (!response) { return; }

      window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
        detail: {
          npcId:       npcData.id,
          npcName:     npcData.name,
          russian:     response.russian,
          translation: response.translation,
          portrait:    npcData.portrait || null,
          choices: [
            { id: 'dismiss', russian: 'Хорошо.', isFinal: true },
          ],
        },
      }));
    };
    window.addEventListener(EVENTS.DIALOGUE_CHOICE, this._onDialogueChoice);

    // -------------------------------------------------------
    // 8. Dialogue-end listener → resume physics, save galina_met
    //    on first visit, then hand off to TutorAI for next visit.
    // -------------------------------------------------------
    this._onDialogueEnd = () => {
      this.physics.resume();
      if (this._firstVisitScripted) {
        this._firstVisitScripted = false;
        getProgress().then((progress) => {
          progress.npcRelationships.galina = { met: true };
          saveProgress(progress);
        });
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // -------------------------------------------------------
    // 9. Location enter event for HUD
    // -------------------------------------------------------
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Apartment Building' },
    }));

    // -------------------------------------------------------
    // 10. Unlock park after first apartment visit
    // -------------------------------------------------------
    getProgress().then((progress) => {
      if (!progress.unlockedLocations.includes('park')) {
        progress.unlockedLocations.push('park');
        saveProgress(progress);
      }
    });

    // -------------------------------------------------------
    // 11. First-visit: auto-trigger scripted opening with choices
    //     Uses the 'opening' variation from APARTMENT_DIALOGUE.
    //     _firstVisitScripted blocks TutorAI takeover until
    //     the scripted exchange completes and galina_met is saved.
    // -------------------------------------------------------
    getProgress().then((progress) => {
      const isFirstVisit = progress.npcRelationships.galina === undefined;
      if (isFirstVisit) {
        this._firstVisitScripted = true;
        const opening = APARTMENT_DIALOGUE.VARIATIONS[0];
        const firstLine = opening.lines[0];
        this.time.delayedCall(350, () => {
          this.physics.pause();
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
            detail: {
              npcId:       npcData.id,
              npcName:     npcData.name,
              russian:     firstLine.russian,
              translation: firstLine.translation,
              portrait:    npcData.portrait || null,
              choices:     firstLine.choices,
            },
          }));
        });
      }
    });
  }

  update() {
    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;

    this._player.update(this._cursors, this._wasd);
    this._npc.checkInteraction(px, py, Phaser.Input.Keyboard.JustDown(this._eKey));
  }

  shutdown() {
    window.removeEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_CHOICE, this._onDialogueChoice);
    window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
    this._player.destroy();
  }
}
