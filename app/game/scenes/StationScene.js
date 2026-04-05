/* ============================================
   StationScene — Train station with Konstantin + Nadya NPCs.
   Unlocked after market visit.
   ============================================ */

// TILE INDEX (roguelike-indoors, 27-col sheet, N = row*27+col)
// floor_a: 216, floor_b: 217, wall: 268, furniture: [125, 239, 341]

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

    const COLS = STATION_COLS;
    const ROWS = STATION_ROWS;
    const FLOOR_A = 216;
    const FLOOR_B = 217;
    const WALL_FRAME = 268;

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

    // Furniture (near corners, avoiding player spawn col 8 row 8, Konstantin col 3 row 5, Nadya col 12 row 4)
    this.add.image(14 * T + T / 2, 1 * T + T / 2, 'indoors', 125); // top-right area
    this.add.image(1 * T + T / 2,  1 * T + T / 2, 'indoors', 239); // top-left area
    this.add.image(14 * T + T / 2, 8 * T + T / 2, 'indoors', 341); // bottom-right area

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
    this._transitioning = false;
    this._sceneH = stH;
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

    // -------------------------------------------------------
    // Dialogue-start listener → init TutorAI with NPC data.
    //   Skipped during first-visit scripted mode (_firstVisitScripted flag).
    //   NOTE: _firstVisitScripted is initialised synchronously below (section
    //   "First-visit") BEFORE the async getProgress() call, so it is always
    //   set before this listener can fire.
    // -------------------------------------------------------
    this._firstVisitScripted = false; // placeholder; overwritten synchronously below
    this._konstantinTier = 0; // cached from getProgress() below
    this._scriptedPhase = null;
    this._scriptedCloseTimer = null;
    this._activeVariation = null;
    this._variationCloseTimer = null;
    this._npcSeenVariations = [];
    this._npcFlags = { konstantin_met: false };
    this._cachedNpcProgress = { npcRelationships: { konstantin: { tier: 0, seenVariations: [] } } };

    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (TutorAI.isActive()) { return; }
      if (this._firstVisitScripted) { return; }
      if (detail.npcId === konstantinData.id && detail.loading === true) {
        const variation = selectVariation(
          STATION_DIALOGUE.KONSTANTIN.VARIATIONS,
          this._npcFlags,
          this._cachedNpcProgress,
          konstantinData.id
        );
        if (variation) {
          this._activeVariation = variation;
          this._firstVisitScripted = true;
          this._scriptedPhase = 'variation';
          const firstLine = variation.lines[0];
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
            detail: {
              npcId:       konstantinData.id,
              npcName:     konstantinData.name,
              russian:     firstLine.russian,
              translation: firstLine.translation,
              portrait:    konstantinData.portrait || null,
              choices:     firstLine.choices || [],
            },
          }));
          return;
        }
      }
      if (detail.npcId === konstantinData.id) {
        const tierNote =
          this._konstantinTier === 0 ? '' :
          this._konstantinTier === 1
            ? ' You have seen this person before. Acknowledge it briefly. Remain formal (вы) but allow a small warmth in tone.'
            : ' This person is a regular. You remember their name. Remain formal (вы), but you are no longer strangers.';
        TutorAI.startConversation(Object.assign({}, konstantinData, { persona: konstantinData.persona + tierNote }));
      } else if (detail.npcId === nadyaData.id) {
        TutorAI.startConversation(nadyaData);
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);

    // -------------------------------------------------------
    // Dialogue-choice handler for first-visit scripted responses.
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
            npcId:       konstantinData.id,
            npcName:     konstantinData.name,
            russian:     response.russian,
            translation: response.translation,
            portrait:    konstantinData.portrait || null,
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

      if (this._scriptedPhase === 'narration' && choiceId === '__advance__') {
        this._scriptedPhase = 'choices';
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       konstantinData.id,
            npcName:     konstantinData.name,
            russian:     'Ваш билет, пожалуйста.',
            translation: 'Your ticket, please.',
            portrait:    konstantinData.portrait || null,
            choices: [
              { choiceId: 'c1', text: 'Вот мой билет.',           translation: 'Here is my ticket.' },
              { choiceId: 'c2', text: 'Я только смотрю.',         translation: 'I am just looking around.' },
              { choiceId: 'c3', text: 'Куда идёт этот поезд?',    translation: 'Where does this train go?' },
            ],
          },
        }));
        return;
      }

      if (this._scriptedPhase === 'choices') {
        this._scriptedPhase = 'done';
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       konstantinData.id,
            npcName:     konstantinData.name,
            russian:     'Хорошо.',
            translation: 'All right.',
            portrait:    konstantinData.portrait || null,
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
    // Dialogue-end listener → resume physics, save konstantin.met
    //   on first visit, then hand off to TutorAI for next visit.
    // -------------------------------------------------------
    this._onDialogueEnd = () => {
      this.physics.resume();
      if (this._firstVisitScripted) { this._firstVisitScripted = false; }
      const varId = this._activeVariation ? this._activeVariation.id : null;
      this._activeVariation = null;
      getProgress().then((progress) => {
        // Hydration guard for old saves
        const rel = progress.npcRelationships && progress.npcRelationships.konstantin;
        if (rel && rel.met === true && rel.tier === undefined) {
          rel.tier = 0;
          rel.visitCount = 0;
        }
        STATION_DIALOGUE.updateKonstantinTier(progress);
        if (!progress.npcRelationships.konstantin) progress.npcRelationships.konstantin = {};
        progress.npcRelationships.konstantin.met = true;
        if (varId) {
          if (!progress.npcRelationships.konstantin.seenVariations) {
            progress.npcRelationships.konstantin.seenVariations = [];
          }
          progress.npcRelationships.konstantin.seenVariations.push(varId);
        }
        saveProgress(progress);
      });
    };
    window.addEventListener(EVENTS.DIALOGUE_END, this._onDialogueEnd);

    // HUD + unlock
    window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
      detail: { name: 'Train Station' },
    }));

    getProgress().then((progress) => {
      if (!progress.unlockedLocations.includes('police')) {
        progress.unlockedLocations.push('police');
        saveProgress(progress);
        window.dispatchEvent(new CustomEvent(EVENTS.HUD_TOAST, {
          detail: { message: 'The police station is now open!', duration: 4000 },
        }));
      }
    });

    // -------------------------------------------------------
    // First-visit: auto-trigger scripted opening with Konstantin.
    //   IMPORTANT: set _firstVisitScripted = true synchronously
    //   BEFORE the async getProgress() call so TutorAI cannot
    //   race in during the period when the promise is in-flight.
    //   The flag is downgraded back to false inside the callback
    //   only when it turns out this is NOT a first visit.
    // -------------------------------------------------------
    this._firstVisitScripted = true;
    this._scriptedPhase = 'narration';
    getProgress().then((progress) => {
      const rel = progress.npcRelationships && progress.npcRelationships.konstantin;
      // Hydration guard: old saves have { met: true } with no tier/visitCount.
      if (rel && rel.met === true && rel.tier === undefined) {
        rel.tier = 0;
        rel.visitCount = 0;
        saveProgress(progress);
      }
      // cache for variation selector — avoids async in _onDialogueStart
      this._konstantinTier = rel ? (rel.tier || 0) : 0;
      this._npcSeenVariations = (rel && rel.seenVariations) ? [...rel.seenVariations] : [];
      this._npcFlags = { konstantin_met: !!(rel && rel.met) };
      this._cachedNpcProgress = {
        npcRelationships: {
          konstantin: {
            tier: this._konstantinTier,
            seenVariations: this._npcSeenVariations,
          }
        }
      };
      const isFirstVisit = !progress.npcRelationships.konstantin?.met;
      if (isFirstVisit) {
        this.time.delayedCall(350, () => {
          this.physics.pause();
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
            detail: {
              npcId:       konstantinData.id,
              npcName:     konstantinData.name,
              russian:     'Станция. Мужчина в форме — Константин — проверяет билеты.',
              translation: 'The station. A man in uniform — Konstantin — checks tickets.',
              portrait:    konstantinData.portrait || null,
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
    this._konstantin.checkInteraction(px, py, eDown);
    this._nadya.checkInteraction(px, py, eDown);

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
