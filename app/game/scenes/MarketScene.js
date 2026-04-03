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
    this._transitioning = false;
    this._sceneH = marketH;
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
    //    _firstVisitScripted blocks TutorAI takeover until the
    //    scripted exchange completes and fatima.met is saved.
    //    Initialised synchronously here; overwritten in section 9.
    // -------------------------------------------------------
    this._firstVisitScripted = false; // placeholder; overwritten synchronously in section 9
    this._scriptedPhase      = null;
    this._scriptedCloseTimer = null;
    this._activeVariation = null;
    this._variationCloseTimer = null;
    this._npcSeenVariations = [];
    this._npcFlags = { fatima_met: false };
    this._cachedNpcProgress = { npcRelationships: { fatima: { seenVariations: [] } } };

    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (TutorAI.isActive()) { return; }
      if (this._firstVisitScripted) { return; }
      if (detail.npcId === fatimaData.id && detail.loading === true) {
        const variation = selectVariation(
          MARKET_DIALOGUE.FATIMA.VARIATIONS,
          this._npcFlags,
          this._cachedNpcProgress,
          fatimaData.id
        );
        if (variation) {
          this._activeVariation = variation;
          this._firstVisitScripted = true;
          this._scriptedPhase = 'variation';
          const firstLine = variation.lines[0];
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
            detail: {
              npcId:       fatimaData.id,
              npcName:     fatimaData.name,
              russian:     firstLine.russian,
              translation: firstLine.translation,
              portrait:    fatimaData.portrait || null,
              choices:     firstLine.choices || [],
            },
          }));
          return;
        }
      }
      if (detail.npcId === fatimaData.id) {
        TutorAI.startConversation(fatimaData);
      } else if (detail.npcId === mishaData.id) {
        TutorAI.startConversation(mishaData);
      } else if (detail.npcId === styopanData.id) {
        TutorAI.startConversation(styopanData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    // -------------------------------------------------------
    // 7b. Dialogue-choice handler for first-visit scripted responses
    // -------------------------------------------------------
    this._onDialogueChoice = (e) => {
      if (!this._firstVisitScripted) { return; }
      const detail   = e.detail || {};
      const choiceId = detail.choiceId;

      if (this._firstVisitScripted && this._scriptedPhase === 'variation' && this._activeVariation) {
        const response = this._activeVariation.lines.find((l) => l.choiceId === choiceId);
        if (!response) { return; }
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       fatimaData.id,
            npcName:     fatimaData.name,
            russian:     response.russian,
            translation: response.translation,
            portrait:    fatimaData.portrait || null,
            choices:     response.isFinal ? [] : (response.choices || []),
          },
        }));
        if (response.isFinal) {
          this._variationCloseTimer = this.time.delayedCall(1500, () => {
            window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
          });
        }
        return;
      }

      // Narration phase: player tapped to advance past the context line
      if (this._scriptedPhase === 'narration' && choiceId === '__advance__') {
        this._scriptedPhase = 'choices';
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:   fatimaData.id,
            npcName: fatimaData.name,
            text:    'Что вам нужно? У нас свежие продукты.',
            choices: [
              { choiceId: 'c1', text: 'Здравствуйте!',        translation: 'Hello!' },
              { choiceId: 'c2', text: 'Сколько стоит?',        translation: 'How much does it cost?' },
              { choiceId: 'c3', text: 'Спасибо, я смотрю.',    translation: 'Thank you, I am just looking.' },
            ],
          },
        }));
        return;
      }

      // Choices phase: any choice closes the scripted dialogue
      if (this._scriptedPhase === 'choices') {
        this._scriptedPhase = 'done';
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:   fatimaData.id,
            npcName: fatimaData.name,
            text:    '',
            choices: [],
          },
        }));
        this._scriptedCloseTimer = setTimeout(() => {
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
        }, 1500);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_CHOICE, this._onDialogueChoice);

    this._onDialogueEnd = () => {
      this.physics.resume();
      const varId = this._activeVariation ? this._activeVariation.id : null;
      this._activeVariation = null;
      if (this._firstVisitScripted) {
        this._firstVisitScripted = false;
        getProgress().then((progress) => {
          if (!progress.npcRelationships.fatima) progress.npcRelationships.fatima = {};
          progress.npcRelationships.fatima.met = true;
          if (varId) {
            if (!progress.npcRelationships.fatima.seenVariations) {
              progress.npcRelationships.fatima.seenVariations = [];
            }
            progress.npcRelationships.fatima.seenVariations.push(varId);
          }
          saveProgress(progress);
        });
      } else if (varId) {
        getProgress().then((progress) => {
          if (!progress.npcRelationships.fatima) progress.npcRelationships.fatima = {};
          if (!progress.npcRelationships.fatima.seenVariations) {
            progress.npcRelationships.fatima.seenVariations = [];
          }
          progress.npcRelationships.fatima.seenVariations.push(varId);
          saveProgress(progress);
        });
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // -------------------------------------------------------
    // 9. First-visit: auto-trigger scripted opening with Fatima
    //
    //    IMPORTANT: set _firstVisitScripted = true synchronously
    //    BEFORE the async getProgress() call so TutorAI cannot
    //    race in during the period when the promise is in-flight.
    //    The flag is downgraded back to false inside the callback
    //    only when it turns out this is NOT a first visit.
    // -------------------------------------------------------
    this._firstVisitScripted = true;
    this._scriptedPhase      = 'narration';
    getProgress().then((progress) => {
      const rel = progress.npcRelationships && progress.npcRelationships.fatima;
      // cache for variation selector — avoids async in _onDialogueStart
      this._npcSeenVariations = (rel && rel.seenVariations) ? [...rel.seenVariations] : [];
      this._npcFlags = { fatima_met: !!(rel && rel.met) };
      this._cachedNpcProgress = {
        npcRelationships: {
          fatima: {
            seenVariations: this._npcSeenVariations,
          }
        }
      };
      const isFirstVisit = !progress.npcRelationships.fatima || !progress.npcRelationships.fatima.met;
      if (isFirstVisit) {
        this.time.delayedCall(350, () => {
          this.physics.pause();
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
            detail: {
              npcId:   fatimaData.id,
              npcName: fatimaData.name,
              text:    'Рынок шумит. Женщина за прилавком — Фатима — раскладывает овощи.',
              choices: [],
            },
          }));
        });
      } else {
        this._firstVisitScripted = false;
        this._scriptedPhase      = null;
      }
    });

    // -------------------------------------------------------
    // 10. HUD + unlock chain (original section 8 content)
    // -------------------------------------------------------
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Market' },
    }));

    getProgress().then((progress) => {
      if (!progress.unlockedLocations.includes('station')) {
        progress.unlockedLocations.push('station');
        saveProgress(progress);
        window.dispatchEvent(new CustomEvent(EVENTS.HUD_TOAST, {
          detail: { message: 'The train station is now open!', duration: 4000 },
        }));
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
    this._activeVariation = null;
    clearTimeout(this._scriptedCloseTimer);
    if (this._variationCloseTimer) {
      this._variationCloseTimer.remove(false);
      this._variationCloseTimer = null;
    }
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
