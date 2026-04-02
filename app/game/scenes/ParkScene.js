/* ============================================
   ParkScene — Open park with Artyom and Tamara NPCs.
   Unlocked after apartment story beat.
   ============================================ */

// TILE INDEX (roguelike-city, 34-col sheet, N = row*34+col)
// grass_a: 816, grass_b: 850, path_a: 558, path_b: 593
// decorations: [131, 132, 133] (indoors sheet — green plant sprites)

const PARK_COLS = 16;
const PARK_ROWS = 12;

class ParkScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Park' });
  }

  create() {
    const T = GAME_CONFIG.TILE_SIZE;
    const parkW = PARK_COLS * T;
    const parkH = PARK_ROWS * T;

    // -------------------------------------------------------
    // 1. Draw park ground — grass tiles with path
    // -------------------------------------------------------
    const gfx = this.add.graphics();

    const COLS = PARK_COLS;
    const ROWS = PARK_ROWS;
    const GRASS_A = 816;
    const GRASS_B = 850;

    // Grass tiles edge-to-edge
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const frame = (r + c) % 2 === 0 ? GRASS_A : GRASS_B;
        this.add.image(c * T + T / 2, r * T + T / 2, 'city', frame);
      }
    }

    // Decoration tiles near border corners (avoiding player spawn col 8 row 10, Artyom col 4 row 6, Tamara col 12 row 3)
    this.add.image(2 * T + T / 2,  2 * T + T / 2,  'indoors', 131); // top-left area
    this.add.image(14 * T + T / 2, 2 * T + T / 2,  'indoors', 132); // top-right area
    this.add.image(2 * T + T / 2,  10 * T + T / 2, 'indoors', 133); // bottom-left area

    // Paths using city tiles (replacing programmatic fills)
    const PATH_A = 558;
    const PATH_B = 593;

    // Horizontal path (rows 5-6, full width)
    for (let r = 5; r <= 6; r++) {
      for (let c = 0; c < COLS; c++) {
        const frame = (r + c) % 2 === 0 ? PATH_A : PATH_B;
        this.add.image(c * T + T / 2, r * T + T / 2, 'city', frame);
      }
    }

    // Vertical path (cols 7-8, full height, skip rows already drawn)
    for (let r = 0; r < ROWS; r++) {
      if (r >= 5 && r <= 6) continue; // already drawn
      for (let c = 7; c <= 8; c++) {
        const frame = (r + c) % 2 === 0 ? PATH_A : PATH_B;
        this.add.image(c * T + T / 2, r * T + T / 2, 'city', frame);
      }
    }

    // -------------------------------------------------------
    // 2. Park decorations — benches, fountain, trees
    // -------------------------------------------------------
    this._drawDecorations(gfx, T);

    // -------------------------------------------------------
    // 3. Player
    // -------------------------------------------------------
    const spawnX = 8 * T;
    const spawnY = 10 * T + T / 2;
    this._player = new Player(this, spawnX, spawnY, T);
    this._player.gameObject.setCollideWorldBounds(true);

    // -------------------------------------------------------
    // 4. NPCs — Artyom (bench area) and Tamara (near fountain)
    // -------------------------------------------------------
    const artyomData = PARK_DIALOGUE.ARTYOM;
    const artyomX = 4 * T + T / 2;
    const artyomY = 6 * T + T / 2;
    this._artyom = new NPC(this, artyomX, artyomY, {
      id: artyomData.id,
      name: artyomData.name,
      tileSize: T,
    });

    const tamaraData = PARK_DIALOGUE.TAMARA;
    const tamaraX = 12 * T + T / 2;
    const tamaraY = 3 * T + T / 2;
    this._tamara = new NPC(this, tamaraX, tamaraY, {
      id: tamaraData.id,
      name: tamaraData.name,
      tileSize: T,
    });

    // -------------------------------------------------------
    // 5. World bounds
    // -------------------------------------------------------
    this._transitioning = false;
    this._sceneH = parkH;
    this.physics.world.setBounds(0, 0, parkW, parkH);

    // -------------------------------------------------------
    // 6. Camera
    // -------------------------------------------------------
    this.cameras.main.setBounds(0, 0, parkW, parkH);
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
    // 8. Dialogue-start listener — TutorAI with correct NPC.
    //    Skipped during first-visit scripted mode.
    //    NOTE: _firstVisitScripted is initialised in section 11
    //    before the async getProgress() call, so it is always set
    //    before this listener can fire.
    // -------------------------------------------------------
    this._firstVisitScripted = false; // placeholder; overwritten synchronously in section 11

    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (TutorAI.isActive() || this._firstVisitScripted) { return; }
      if (detail.npcId === artyomData.id) {
        TutorAI.startConversation(artyomData);
      } else if (detail.npcId === tamaraData.id) {
        TutorAI.startConversation(tamaraData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    // -------------------------------------------------------
    // 8b. Dialogue-choice handler for first-visit scripted responses
    //     TutorAI ignores choices when scripted mode is active.
    // -------------------------------------------------------
    this._onDialogueChoice = (e) => {
      if (!this._firstVisitScripted) { return; }
      const detail = e.detail || {};
      const choiceId = detail.choiceId;

      // Narration phase: player tapped to advance past the context line
      if (this._scriptedPhase === 'narration' && choiceId === '__advance__') {
        this._scriptedPhase = 'choices';
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       artyomData.id,
            npcName:     artyomData.name,
            russian:     'Здравствуйте! Я Артём. Давно здесь работаю.',
            translation: 'Hello! I am Artyom. I have been working here for a long time.',
            portrait:    artyomData.portrait || null,
            choices: [
              { id: 'greet',   text: 'Здравствуйте!',      translation: 'Hello!' },
              { id: 'observe', text: 'Красивый парк.',      translation: 'What a beautiful park.' },
              { id: 'walk',    text: 'Я просто гуляю.',     translation: 'I am just taking a walk.' },
            ],
          },
        }));
        return;
      }

      const scriptedResponses = {
        greet:   { russian: 'Рад познакомиться!',         translation: 'Nice to meet you!' },
        observe:  { russian: 'Спасибо, я стараюсь.',       translation: 'Thank you, I try my best.' },
        walk:    { russian: 'Приятной прогулки!',          translation: 'Enjoy your walk!' },
      };

      const response = scriptedResponses[choiceId];
      if (!response) { return; }

      window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
        detail: {
          npcId:       artyomData.id,
          npcName:     artyomData.name,
          russian:     response.russian,
          translation: response.translation,
          portrait:    artyomData.portrait || null,
          choices:     [],
        },
      }));

      this.time.delayedCall(1500, () => {
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
      });
    };
    window.addEventListener(EVENTS.DIALOGUE_CHOICE, this._onDialogueChoice);

    // -------------------------------------------------------
    // 8c. Dialogue-end listener — resume physics, save artyom.met
    //     on first visit, then hand off to TutorAI for next visit.
    // -------------------------------------------------------
    this._onDialogueEnd = () => {
      this.physics.resume();
      if (this._firstVisitScripted) {
        this._firstVisitScripted = false;
        getProgress().then((progress) => {
          progress.npcRelationships.artyom = { met: true };
          saveProgress(progress);
        });
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // -------------------------------------------------------
    // 9. Location enter event for HUD
    // -------------------------------------------------------
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Park' },
    }));

    // -------------------------------------------------------
    // 10. Unlock cafe after first park visit
    // -------------------------------------------------------
    getProgress().then((progress) => {
      if (!progress.unlockedLocations.includes('cafe')) {
        progress.unlockedLocations.push('cafe');
        saveProgress(progress);
        window.dispatchEvent(new CustomEvent(EVENTS.HUD_TOAST, {
          detail: { message: 'The cafe is now open!', duration: 4000 },
        }));
      }
    });

    // -------------------------------------------------------
    // 11. First-visit: auto-trigger scripted opening with Artyom.
    //     _firstVisitScripted blocks TutorAI takeover until the
    //     scripted exchange completes and artyom.met is saved.
    //
    //     IMPORTANT: set _firstVisitScripted = true synchronously
    //     BEFORE the async getProgress() call so TutorAI cannot
    //     race in during the period when the promise is in-flight.
    //     The flag is downgraded back to false inside the callback
    //     only when it turns out this is NOT a first visit.
    // -------------------------------------------------------
    this._firstVisitScripted = true;
    this._scriptedPhase = 'narration';
    getProgress().then((progress) => {
      const isFirstVisit = progress.npcRelationships.artyom === undefined;
      if (isFirstVisit) {
        this.time.delayedCall(350, () => {
          this.physics.pause();
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
            detail: {
              npcId:       artyomData.id,
              npcName:     artyomData.name,
              russian:     'Вы заходите в парк. Здесь тихо и уютно. Пожилой мужчина в синей куртке подметает дорожку.',
              translation: 'You enter the park. It is quiet and cosy here. An elderly man in a blue jacket is sweeping the path.',
              portrait:    artyomData.portrait || null,
              choices:     [],
            },
          }));
        });
      } else {
        this._firstVisitScripted = false;
        this._scriptedPhase = null;
      }
    });
  }

  update() {
    const px = this._player.gameObject.x;
    const py = this._player.gameObject.y;
    const eDown = Phaser.Input.Keyboard.JustDown(this._eKey);

    this._player.update(this._cursors, this._wasd);
    this._artyom.checkInteraction(px, py, eDown);
    this._tamara.checkInteraction(px, py, eDown);

    if (!this._transitioning && py >= this._sceneH - GAME_CONFIG.TILE_SIZE) {
      this._transitioning = true;
      this.physics.pause();
      this.cameras.main.fadeOut(300);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('World');
      });
    }
  }

  shutdown() {
    window.removeEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_CHOICE, this._onDialogueChoice);
    window.removeEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);
    this._player.destroy();
  }

  // ---------------------------------------------------------------
  // Private — park decorations
  // ---------------------------------------------------------------
  _drawDecorations(gfx, T) {
    // Fountain at path intersection
    gfx.fillStyle(0x8899BB);
    gfx.fillCircle(8 * T, 6 * T, T * 1.2);
    gfx.fillStyle(0xAABBDD);
    gfx.fillCircle(8 * T, 6 * T, T * 0.7);

    // Benches along the horizontal path
    const benchColor = 0x8B6B42;
    gfx.fillStyle(benchColor);
    gfx.fillRect(3 * T, 5 * T - T * 0.3, T * 1.5, T * 0.3);
    gfx.fillRect(11 * T, 5 * T - T * 0.3, T * 1.5, T * 0.3);
    gfx.fillRect(3 * T, 7 * T, T * 1.5, T * 0.3);
    gfx.fillRect(11 * T, 7 * T, T * 1.5, T * 0.3);

    // Trees (simple circles)
    const treePositions = [
      [2, 2], [5, 1], [13, 1], [14, 4],
      [1, 8], [3, 10], [13, 9], [15, 10],
    ];

    for (const [col, row] of treePositions) {
      // Trunk
      gfx.fillStyle(0x6B4226);
      gfx.fillRect(col * T + T * 0.35, row * T + T * 0.5, T * 0.3, T * 0.5);
      // Canopy
      gfx.fillStyle(0x2D6B1E);
      gfx.fillCircle(col * T + T / 2, row * T + T * 0.3, T * 0.5);
    }
  }
}
