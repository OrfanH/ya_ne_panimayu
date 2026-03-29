/* ============================================
   NPC Entity — sprite, interaction radius, event firing
   ============================================ */

class NPC {
  constructor(scene, x, y, config) {
    this._scene = scene;
    this._id    = config.id;
    this._name  = config.name;
    this.interactionRadius = GAME_CONFIG.INTERACTION_RADIUS;

    const tileSize = config.tileSize;

    this._createTexture(scene, tileSize);

    this._sprite = scene.physics.add.staticImage(x, y, 'npc-default');
    this._sprite.setDisplaySize(tileSize - 4, tileSize - 4);

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
    this._sprite.destroy();
  }

  // ---------------------------------------------------------------
  // Private — texture generation
  // ---------------------------------------------------------------

  _createTexture(scene, tileSize) {
    const KEY  = 'npc-default';
    if (scene.textures.exists(KEY)) { return; }

    const SIZE = tileSize - 4;

    if (scene.textures.exists('urban')) {
      // Frame 131 — row 4, col 23 of the urban tileset (second character design)
      const FRAME      = 131;
      const COLS       = 27;
      const FRAME_SIZE = 16;
      const col = FRAME % COLS;
      const row = Math.floor(FRAME / COLS);
      const canvas = scene.textures.createCanvas(KEY, SIZE, SIZE);
      const ctx    = canvas.getContext();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        scene.textures.get('urban').getSourceImage(),
        col * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
        0, 0, SIZE, SIZE
      );
      canvas.refresh();
      return;
    }

    // Fallback: programmatic blue rectangle + circle head
    const texture = scene.textures.createCanvas(KEY, SIZE, SIZE);
    const ctx     = texture.getContext();

    ctx.fillStyle = '#5588CC';
    ctx.fillRect(SIZE * 0.2, SIZE * 0.42, SIZE * 0.6, SIZE * 0.58);

    const headR  = SIZE * 0.22;
    const headCx = SIZE / 2;
    const headCy = SIZE * 0.28;
    ctx.beginPath();
    ctx.arc(headCx, headCy, headR, 0, Math.PI * 2);
    ctx.fillStyle = '#7AAAEE';
    ctx.fill();

    ctx.strokeStyle = '#3366AA';
    ctx.lineWidth   = 1;
    ctx.strokeRect(0.5, 0.5, SIZE - 1, SIZE - 1);

    texture.refresh();
  }
}
