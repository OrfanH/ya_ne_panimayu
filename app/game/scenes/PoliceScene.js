/* ============================================
   PoliceScene — Police station with Alina + Sergei NPCs.
   Unlocked after train station visit.
   ============================================ */

// TILE INDEX (roguelike-indoors, 27-col sheet, N = row*27+col)
// floor_a: 216, floor_b: 217, wall: 239, furniture: [125, 341, 266]

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

    const COLS = POLICE_COLS;
    const ROWS = POLICE_ROWS;
    const FLOOR_A = 216;
    const FLOOR_B = 217;
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

    // Furniture (near corners, avoiding player spawn col 7 row 8, Alina col 7 row 2, Sergei col 11 row 5)
    this.add.image(1 * T + T / 2,  1 * T + T / 2,  'indoors', 125); // top-left corner
    this.add.image(12 * T + T / 2, 1 * T + T / 2,  'indoors', 341); // top-right corner
    this.add.image(12 * T + T / 2, 8 * T + T / 2,  'indoors', 266); // bottom-right corner

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
    this._transitioning = false;
    this._sceneH = polH;
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

    // -------------------------------------------------------
    // Dialogue-start listener → init TutorAI with NPC data
    //   Skipped during first-visit scripted mode (_firstVisitScripted flag).
    //   NOTE: _firstVisitScripted is initialised synchronously before
    //   the async getProgress() call, so it is always set before this
    //   listener can fire.
    // -------------------------------------------------------
    this._firstVisitScripted = false; // placeholder; overwritten synchronously below
    this._activeVariation = null;
    this._variationCloseTimer = null;
    this._npcSeenVariations = [];
    this._npcFlags = { alina_met: false };
    this._cachedNpcProgress = { npcRelationships: { alina: { seenVariations: [] } } };

    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (TutorAI.isActive()) { return; }
      if (this._firstVisitScripted) { return; }
      if (detail.npcId === alinaData.id && detail.loading === true) {
        const variation = selectVariation(
          POLICE_DIALOGUE.ALINA.VARIATIONS,
          this._npcFlags,
          this._cachedNpcProgress,
          alinaData.id
        );
        if (variation) {
          this._activeVariation = variation;
          this._firstVisitScripted = true;
          this._scriptedPhase = 'variation';
          const firstLine = variation.lines[0];
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
            detail: {
              npcId:       alinaData.id,
              npcName:     alinaData.name,
              russian:     firstLine.russian,
              translation: firstLine.translation,
              portrait:    alinaData.portrait || null,
              choices:     firstLine.choices || [],
            },
          }));
          return;
        }
      }
      if (detail.npcId === alinaData.id) {
        TutorAI.startConversation(alinaData);
      } else if (detail.npcId === sergeiData.id) {
        TutorAI.startConversation(sergeiData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    // -------------------------------------------------------
    // Dialogue-choice handler for first-visit scripted responses
    //   TutorAI ignores choices when _npcId is null, so this
    //   handler is the sole responder during scripted mode.
    // -------------------------------------------------------
    this._onDialogueChoice = (e) => {
      if (!this._firstVisitScripted) { return; }
      const detail = e.detail || {};
      const choiceId = detail.choiceId;

      if (this._firstVisitScripted && this._scriptedPhase === 'variation' && this._activeVariation) {
        const response = this._activeVariation.lines.find((l) => l.choiceId === choiceId);
        if (!response) { return; }
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       alinaData.id,
            npcName:     alinaData.name,
            russian:     response.russian,
            translation: response.translation,
            portrait:    alinaData.portrait || null,
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
            npcId:       alinaData.id,
            npcName:     alinaData.name,
            russian:     'Чем могу помочь?',
            translation: 'How can I help you?',
            portrait:    alinaData.portrait || null,
            choices: [
              { choiceId: 'c1', text: 'Добрый день.',          translation: 'Good afternoon.' },
              { choiceId: 'c2', text: 'Я потерял документы.',  translation: 'I have lost my documents.' },
              { choiceId: 'c3', text: 'Я просто зашёл.',       translation: 'I just stopped by.' },
            ],
          },
        }));
        return;
      }

      // Choices phase: any of the three choices closes the dialogue
      if (this._scriptedPhase === 'choices' &&
          (choiceId === 'c1' || choiceId === 'c2' || choiceId === 'c3')) {
        this._scriptedPhase = 'done';
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       alinaData.id,
            npcName:     alinaData.name,
            russian:     '',
            translation: '',
            portrait:    alinaData.portrait || null,
            choices:     [],
          },
        }));
        this._scriptedCloseTimer = setTimeout(() => {
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
        }, 1500);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_CHOICE, this._onDialogueChoice);

    // -------------------------------------------------------
    // Dialogue-end listener → resume physics, save alina.met
    //   on first visit, then hand off to TutorAI for next visit.
    // -------------------------------------------------------
    this._onDialogueEnd = () => {
      this.physics.resume();
      const varId = this._activeVariation ? this._activeVariation.id : null;
      this._activeVariation = null;
      if (this._firstVisitScripted) {
        this._firstVisitScripted = false;
        getProgress().then((progress) => {
          if (!progress.npcRelationships.alina) progress.npcRelationships.alina = {};
          progress.npcRelationships.alina.met = true;
          if (varId) {
            if (!progress.npcRelationships.alina.seenVariations) {
              progress.npcRelationships.alina.seenVariations = [];
            }
            progress.npcRelationships.alina.seenVariations.push(varId);
          }
          saveProgress(progress);
        });
      } else if (varId) {
        getProgress().then((progress) => {
          if (!progress.npcRelationships.alina) progress.npcRelationships.alina = {};
          if (!progress.npcRelationships.alina.seenVariations) {
            progress.npcRelationships.alina.seenVariations = [];
          }
          progress.npcRelationships.alina.seenVariations.push(varId);
          saveProgress(progress);
        });
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // HUD
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Police Station' },
    }));

    // -------------------------------------------------------
    // First-visit: auto-trigger scripted opening with choices
    //   _firstVisitScripted blocks TutorAI takeover until
    //   the scripted exchange completes and alina.met is saved.
    //
    //   IMPORTANT: set _firstVisitScripted = true synchronously
    //   BEFORE the async getProgress() call so TutorAI cannot
    //   race in during the period when the promise is in-flight.
    //   The flag is downgraded back to false inside the callback
    //   only when it turns out this is NOT a first visit.
    // -------------------------------------------------------
    this._scriptedPhase = null;
    this._scriptedCloseTimer = null;
    this._firstVisitScripted = true;
    this._scriptedPhase = 'narration';
    getProgress().then((progress) => {
      const rel = progress.npcRelationships && progress.npcRelationships.alina;
      // cache for variation selector — avoids async in _onDialogueStart
      this._npcSeenVariations = (rel && rel.seenVariations) ? [...rel.seenVariations] : [];
      this._npcFlags = { alina_met: !!(rel && rel.met) };
      this._cachedNpcProgress = {
        npcRelationships: {
          alina: {
            seenVariations: this._npcSeenVariations,
          }
        }
      };
      const isFirstVisit = !progress.npcRelationships.alina || !progress.npcRelationships.alina.met;
      if (isFirstVisit) {
        this.time.delayedCall(350, () => {
          this.physics.pause();
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
            detail: {
              npcId:       alinaData.id,
              npcName:     alinaData.name,
              russian:     'Полицейский участок. За стойкой сидит офицер — Алина. Она смотрит на вас.',
              translation: 'The police station. Behind the desk sits an officer — Alina. She looks at you.',
              portrait:    alinaData.portrait || null,
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
    this._alina.checkInteraction(px, py, eDown);
    this._sergei.checkInteraction(px, py, eDown);

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
    if (this._scriptedCloseTimer !== null) {
      clearTimeout(this._scriptedCloseTimer);
      this._scriptedCloseTimer = null;
    }
    if (this._variationCloseTimer) {
      this._variationCloseTimer.remove(false);
      this._variationCloseTimer = null;
    }
    this._player.destroy();
  }
}
