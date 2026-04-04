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
    this._transitioning = false;
    this._sceneH = roomH;
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
    //    NOTE: _firstVisitScripted is initialised in section 11 before
    //    the async getProgress() call, so it is always set before this
    //    listener can fire.
    // -------------------------------------------------------
    this._firstVisitScripted = false; // placeholder; overwritten synchronously in section 11
    this._galinaTier = 0; // cached from getProgress() in section 11; used by _onDialogueStart
    this._activeVariation = null;
    this._scriptedCloseTimer = null;
    this._dialogueEndTimer = null;
    this._firstVisitTimer = null;
    this._npcSeenVariations = [];
    this._npcFlags = { galina_met: false };
    this._cachedNpcProgress = { npcRelationships: { galina: { tier: 0, seenVariations: [] } } };

    this._onDialogueStart = (e) => {
      const detail = e.detail || {};
      if (detail.npcId === npcData.id && detail.loading === true && !TutorAI.isActive() && !this._firstVisitScripted) {
        const variation = selectVariation(
          APARTMENT_DIALOGUE.VARIATIONS,
          this._npcFlags,
          this._cachedNpcProgress,
          npcData.id
        );
        if (variation) {
          this._activeVariation = variation;
          this._firstVisitScripted = true;   // reuse flag to block TutorAI
          this._scriptedPhase = 'variation';
          const firstLine = variation.lines[0];
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
            detail: {
              npcId:       npcData.id,
              npcName:     npcData.name,
              russian:     firstLine.russian,
              translation: firstLine.translation,
              portrait:    npcData.portrait || null,
              choices:     firstLine.choices || [],
            },
          }));
          return;
        }
        // No variation matched → fall through to TutorAI (existing persona logic)
        const errorCorrectionNote = ' When the student makes a grammar error, naturally model the correct form in your reply without labelling it as an error (recast correction). For example: if the student says "Я хочу идти", you reply using "пойти" naturally in your response.';
        const tierNote =
          this._galinaTier === 0 ? '' :
          this._galinaTier === 1
            ? ' You have spoken with this student several times. Address them with ты (informal you) instead of вы. Reference that you have met before.'
            : ' This student is a friend now. Use ты, initiate small talk, ask how their studies are going, and reference your past conversations.';
        const persona = npcData.persona + errorCorrectionNote + tierNote;
        getVocabulary().then((vocab) => {
          const knownWords = (vocab.words || []).slice(-20);
          TutorAI.startConversation(Object.assign({}, npcData, { persona, knownWords }));
        }).catch(() => {
          TutorAI.startConversation(Object.assign({}, npcData, { persona, knownWords: [] }));
        });
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

      if (this._firstVisitScripted && this._scriptedPhase === 'variation' && this._activeVariation) {
        const response = this._activeVariation.lines.find((l) => l.choiceId === choiceId);
        if (!response) { return; }
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       npcData.id,
            npcName:     npcData.name,
            russian:     response.russian,
            translation: response.translation,
            portrait:    npcData.portrait || null,
            choices:     response.isFinal ? [] : (response.choices || []),
          },
        }));
        if (response.isFinal) {
          this._scriptedCloseTimer = this.time.delayedCall(1500, () => {
            this._scriptedCloseTimer = null;
            window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
          });
        }
        return;  // don't fall through to first-visit choice handler
      }

      // Narration phase: player tapped to advance past the context line
      if (this._scriptedPhase === 'narration' && choiceId === '__advance__') {
        this._scriptedPhase = 'choices';
        const opening = APARTMENT_DIALOGUE.VARIATIONS[0];
        const firstLine = opening.lines[0];
        window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
          detail: {
            npcId:       npcData.id,
            npcName:     npcData.name,
            russian:     firstLine.russian,
            translation: firstLine.translation,
            portrait:    npcData.portrait || null,
            choices:     firstLine.choices,
          },
        }));
        return;
      }

      const opening = APARTMENT_DIALOGUE.VARIATIONS[0];
      const response = opening.lines.find((l) => l.choiceId === choiceId);
      if (!response) { return; }

      // Show Galina's response text. When response is final, show no choices so
      // the advance hint appears. After 1 500ms (enough to read), fire DIALOGUE_END
      // so the dialogue closes automatically without a manual dismiss click.
      window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_UPDATE, {
        detail: {
          npcId:       npcData.id,
          npcName:     npcData.name,
          russian:     response.russian,
          translation: response.translation,
          portrait:    npcData.portrait || null,
          choices:     response.isFinal ? [] : [
            { id: 'dismiss', russian: 'Хорошо.', translation: 'Okay.', isFinal: true },
          ],
        },
      }));

      if (response.isFinal) {
        this._dialogueEndTimer = this.time.delayedCall(1500, () => {
          this._dialogueEndTimer = null;
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_END));
        });
      }
    };
    window.addEventListener(EVENTS.DIALOGUE_CHOICE, this._onDialogueChoice);

    // -------------------------------------------------------
    // 8. Dialogue-end listener → resume physics, save galina.met,
    //    and call updateGalinaTier() to increment visitCount / promote tier.
    //    Runs on every visit (first and return).
    // -------------------------------------------------------
    this._onDialogueEnd = () => {
      this.physics.resume();
      const wasFirstVisitScripted = this._firstVisitScripted;
      if (this._firstVisitScripted) {
        this._firstVisitScripted = false;
      }
      if (wasFirstVisitScripted) {
        const seedWords = npcData.tutorVocabulary.slice(0, 5).map((w) => ({
          cyrillic: w.russian,
          transliteration: null,
          meaning: w.translation,
          gender: null,
          exampleCyrillic: '',
          exampleMeaning: '',
        }));
        addVocabulary(seedWords, 'apartment').then((vocab) => {
          window.dispatchEvent(new CustomEvent(EVENTS.VOCABULARY_NEW, {
            detail: { count: seedWords.length },
          }));
        });
      }
      const varId = this._activeVariation ? this._activeVariation.id : null;
      this._activeVariation = null;
      getProgress().then((progress) => {
        // Old saves may have { met: true } with no tier/visitCount —
        // backfill before calling updateGalinaTier so visitCount += 1 is valid.
        const rel = progress.npcRelationships && progress.npcRelationships.galina;
        if (rel && rel.met === true && rel.tier === undefined) {
          rel.tier = 0;
          rel.visitCount = 0;
        }
        APARTMENT_DIALOGUE.updateGalinaTier(progress);
        progress.npcRelationships.galina.met = true;
        if (varId) {
          if (!progress.npcRelationships.galina.seenVariations) {
            progress.npcRelationships.galina.seenVariations = [];
          }
          progress.npcRelationships.galina.seenVariations.push(varId);
        }
        saveProgress(progress);
      });
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
        window.dispatchEvent(new CustomEvent(EVENTS.HUD_TOAST, {
          detail: { message: 'The park is now open!', duration: 4000 },
        }));
      }
    });

    // -------------------------------------------------------
    // 11. First-visit: auto-trigger scripted opening with choices
    //     Uses the 'opening' variation from APARTMENT_DIALOGUE.
    //     _firstVisitScripted blocks TutorAI takeover until
    //     the scripted exchange completes and galina_met is saved.
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
      // Hydration guard: old saves have { met: true } with no tier/visitCount.
      // Backfill so tier-based variation selection and updateGalinaTier are safe.
      const existingRel = progress.npcRelationships && progress.npcRelationships.galina;
      if (existingRel && existingRel.met === true && existingRel.tier === undefined) {
        existingRel.tier = 0;
        existingRel.visitCount = 0;
        saveProgress(progress);
      }

      // Cache current tier so _onDialogueStart can inject it into TutorAI persona.
      const rel = progress.npcRelationships && progress.npcRelationships.galina;
      this._galinaTier = rel ? (rel.tier || 0) : 0;
      // cache for variation selector — avoids async in _onDialogueStart
      this._npcSeenVariations = (rel && rel.seenVariations) ? [...rel.seenVariations] : [];
      this._npcFlags = { galina_met: !!(rel && rel.met) };
      this._cachedNpcProgress = {
        npcRelationships: {
          galina: {
            tier: this._galinaTier,
            seenVariations: this._npcSeenVariations,
          }
        }
      };

      const isFirstVisit = progress.npcRelationships.galina === undefined;
      if (isFirstVisit) {
        this._firstVisitTimer = this.time.delayedCall(350, () => {
          this.physics.pause();
          // Show a narration line first so the player knows what is happening
          // before being presented with Russian response choices.
          window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
            detail: {
              npcId:       npcData.id,
              npcName:     npcData.name,
              russian:     'Ваша соседка стучит в дверь и говорит по-русски.',
              translation: 'Your neighbor knocks on the door and speaks to you in Russian.',
              portrait:    npcData.portrait || null,
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

    this._player.update(this._cursors, this._wasd);
    this._npc.checkInteraction(px, py, Phaser.Input.Keyboard.JustDown(this._eKey));

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
    if (this._scriptedCloseTimer) {
      this._scriptedCloseTimer.remove(false);
      this._scriptedCloseTimer = null;
    }
    if (this._dialogueEndTimer) {
      this._dialogueEndTimer.remove(false);
      this._dialogueEndTimer = null;
    }
    if (this._firstVisitTimer) {
      this._firstVisitTimer.remove(false);
      this._firstVisitTimer = null;
    }
    this._player.destroy();
  }
}
