/* ============================================
   NPC Entity — sprite, interaction radius, event firing
   ============================================ */

function _getTier(score) {
  if (score >= 3) { return 2; } // friend
  if (score >= 1) { return 1; } // acquaintance
  return 0; // stranger
}

const NPC_FRAMES = {
  galina:     { base: 0, clothing: 10, accessory: 20 },
  artyom:     { base: 54, clothing: 64 },
  tamara:     { base: 0, clothing: 7, accessory: 22 },
  lena:       { base: 108, clothing: 118 },
  boris:      { base: 0, clothing: 15, accessory: 19 },
  fatima:     { base: 108, clothing: 114, accessory: 24 },
  misha:      { base: 54, clothing: 60, accessory: 21 },
  styopan:    { base: 270, clothing: 276 },
  konstantin: { base: 0, clothing: 17, accessory: 26 },
  nadya:      { base: 324, clothing: 334 },
  alina:      { base: 378, clothing: 392 },
  sergei:     { base: 486, clothing: 492 },
  professor:  { base: 108, clothing: 122, accessory: 129 },
};

class NPC {
  constructor(scene, x, y, config) {
    this._scene = scene;
    this._id    = config.id;
    this._name  = config.name;
    this.interactionRadius = GAME_CONFIG.INTERACTION_RADIUS;

    const tileSize    = config.tileSize;
    const displaySize = tileSize - 4;
    const frames      = NPC_FRAMES[config.id] || { base: 0 };

    const totalFrames = scene.textures.get('chars').frameTotal;
    const safeFrame = (f) => (f !== undefined && f < totalFrames ? f : 0);

    this._sprite = scene.physics.add.staticImage(x, y, 'chars', safeFrame(frames.base));
    this._sprite.setDisplaySize(displaySize, displaySize);

    this._clothingLayer = null;
    if (frames.clothing !== undefined) {
      this._clothingLayer = scene.add.image(x, y, 'chars', safeFrame(frames.clothing));
      this._clothingLayer.setDisplaySize(displaySize, displaySize);
    }

    this._accessoryLayer = null;
    if (frames.accessory !== undefined) {
      this._accessoryLayer = scene.add.image(x, y, 'chars', safeFrame(frames.accessory));
      this._accessoryLayer.setDisplaySize(displaySize, displaySize);
    }

    // Detect mobile: pointer is coarse (touch) or no fine pointer available
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const hintText = isMobile ? 'tap' : '[E]';

    const _hintStyle = getComputedStyle(document.documentElement);
    const hintFontSize = _hintStyle.getPropertyValue('--hint-font-size').trim();
    const hintColor    = _hintStyle.getPropertyValue('--hint-color').trim();
    const hintBg       = _hintStyle.getPropertyValue('--hint-bg').trim();
    const hintPadX     = parseInt(_hintStyle.getPropertyValue('--hint-padding-x').trim());
    const hintPadY     = parseInt(_hintStyle.getPropertyValue('--hint-padding-y').trim());

    this._interactionHint = scene.add.text(x, y - tileSize * 0.85, hintText, {
      fontFamily:      'Kenney Mini',
      fontSize:        hintFontSize,
      color:           hintColor,
      backgroundColor: hintBg,
      padding:         { left: hintPadX, right: hintPadX, top: hintPadY, bottom: hintPadY },
      resolution:      2,
    });
    this._interactionHint.setOrigin(0.5, 1.0);
    this._interactionHint.setAlpha(0.92);
    this._interactionHint.setVisible(false);
    this._interactionHint.setDepth(10);

    // _inRange: true when player is within interaction radius
    this._inRange = false;

    // _dialogueOpen: true while any dialogue is showing — hide hint regardless of range
    this._dialogueOpen = false;

    // Guard: prevents firing DIALOGUE_START while a dialogue is already open
    this._interacting = false;

    this._onDialogueStart = () => {
      this._dialogueOpen = true;
      this._updateHint(this._inRange);
    };

    this._onDialogueEnd = async () => {
      const wasInteracting = this._interacting;
      this._interacting  = false;
      this._dialogueOpen = false;
      this._updateHint(this._inRange);

      // Increment relationship score (fire-and-forget, flags already reset above)
      if (wasInteracting) {
        try {
          const progress = await getProgress();
          if (!progress.npcRelationships) { progress.npcRelationships = {}; }
          const current = progress.npcRelationships[this._id] || 0;
          progress.npcRelationships[this._id] = current + 1;
          await saveProgress(progress);
        } catch { /* silent */ }
      }
    };

    window.addEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.addEventListener(EVENTS.DIALOGUE_END,   this._onDialogueEnd);
  }

  // ---------------------------------------------------------------
  // Public accessors
  // ---------------------------------------------------------------

  get gameObject() {
    return this._sprite;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  // ---------------------------------------------------------------
  // Public — called each frame from scene update()
  // ---------------------------------------------------------------

  checkInteraction(playerX, playerY, eKeyJustDown) {
    const dx   = playerX - this._sprite.x;
    const dy   = playerY - this._sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const inRange = dist <= this.interactionRadius;

    if (inRange !== this._inRange) {
      this._inRange = inRange;
      this._updateHint(inRange);
    }

    if (inRange && eKeyJustDown && !this._interacting) {
      this._interacting = true;
      this._scene.physics.pause();
      this._startDialogue();
    }
  }

  // ---------------------------------------------------------------
  // Private — read tier from storage and dispatch DIALOGUE_START
  // ---------------------------------------------------------------

  async _startDialogue() {
    let tier = 0;
    try {
      const progress = await getProgress();
      const score = (progress.npcRelationships && progress.npcRelationships[this._id]) || 0;
      tier = _getTier(score);
    } catch { /* silent — use default tier 0 */ }

    const portrait = `assets/portraits/${this._id}.png`;

    // Show the dialogue box immediately with a localised loading message and
    // the goodbye choice so the player can always exit — never zero choices.
    window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
      detail: {
        npcId: this._id,
        npcName: this._name,
        russian: `${this._name} думает...`,
        translation: `${this._name} is thinking...`,
        choices: [
          { id: 'end', russian: 'До свидания', translation: 'Goodbye', isFinal: true },
        ],
        portrait,
        loading: true,
        tier,
      },
    }));

    // Start the TutorAI conversation — when the API responds it dispatches
    // DIALOGUE_UPDATE which replaces the loading state with real content.
    TutorAI.startConversation({
      id: this._id,
      name: this._name,
      persona: '',
      tutorVocabulary: [],
      portrait,
    });
  }

  // ---------------------------------------------------------------
  // Private — show/hide hint based on proximity and dialogue state
  // ---------------------------------------------------------------

  _updateHint(inRange) {
    const shouldShow = inRange && !this._dialogueOpen;
    this._interactionHint.setVisible(shouldShow);
  }

  // ---------------------------------------------------------------
  // Public — cleanup
  // ---------------------------------------------------------------

  destroy() {
    window.removeEventListener(EVENTS.DIALOGUE_START, this._onDialogueStart);
    window.removeEventListener(EVENTS.DIALOGUE_END,   this._onDialogueEnd);
    this._inRange      = false;
    this._dialogueOpen = false;
    this._interacting  = false;
    this._interactionHint.destroy();
    if (this._clothingLayer)  { this._clothingLayer.destroy(); }
    if (this._accessoryLayer) { this._accessoryLayer.destroy(); }
    this._sprite.destroy();
  }
}
