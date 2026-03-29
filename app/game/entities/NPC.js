/* ============================================
   NPC Entity — sprite, interaction radius, event firing
   ============================================ */

const NPC_FRAMES = {
  galina:     { base: 32, clothing: 48, accessory: 16 },
  artyom:     { base:  1, clothing:  9 },
  tamara:     { base: 33, clothing: 49, accessory: 17 },
  lena:       { base: 34, clothing: 58 },
  boris:      { base:  2, clothing: 10, accessory: 18 },
  fatima:     { base: 35, clothing: 59, accessory: 19 },
  misha:      { base:  3, clothing: 11, accessory: 20 },
  styopan:    { base:  4, clothing: 12 },
  konstantin: { base:  5, clothing: 13, accessory: 21 },
  nadya:      { base: 36, clothing: 60, accessory: 22 },
  alina:      { base: 37, clothing: 61, accessory: 23 },
  sergei:     { base:  6, clothing: 14 },
  professor:  { base:  7, clothing: 15, accessory: 24 },
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

    this._indicator = scene.add.text(x, y - tileSize * 0.75, '[E]', {
      fontFamily: 'monospace',
      fontSize:   '12px',
      color:      '#FFFFFF',
    });
    this._indicator.setOrigin(0.5, 0.5);
    this._indicator.setVisible(false);
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
    this._indicator.setVisible(inRange);

    if (inRange && eKeyJustDown) {
      window.dispatchEvent(new CustomEvent(EVENTS.DIALOGUE_START, {
        detail: {
          npcId: this._id,
          npcName: this._name,
          russian: '...',
          translation: '',
          choices: [],
          portrait: `assets/portraits/${this._id}.png`,
        },
      }));
      this._scene.physics.pause();
    }
  }

  // ---------------------------------------------------------------
  // Public — cleanup
  // ---------------------------------------------------------------

  destroy() {
    this._indicator.destroy();
    if (this._clothingLayer)  { this._clothingLayer.destroy(); }
    if (this._accessoryLayer) { this._accessoryLayer.destroy(); }
    this._sprite.destroy();
  }
}
