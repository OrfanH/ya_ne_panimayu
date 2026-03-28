/* ============================================
   Player — 4-direction walk, directional textures, camera follows
   ============================================ */

const PLAYER_GOLD        = 0xFFD700;
const PLAYER_GOLD_BORDER = 0xB89B00;
const PLAYER_GOLD_DARK   = 0x7A6000;

class Player {
  constructor(scene, x, y, tileSize) {
    this._scene     = scene;
    this._direction = 'down';
    this._alphaTime = 0;
    this._moving    = false;

    this._createDirectionalTextures(scene, tileSize);

    this._sprite = scene.physics.add.image(x, y, 'player-down');
    this._sprite.setCollideWorldBounds(true);
    this._sprite.setDisplaySize(tileSize - 4, tileSize - 4);
  }

  // ---------------------------------------------------------------
  // Public accessors
  // ---------------------------------------------------------------

  get gameObject() {
    return this._sprite;
  }

  get direction() {
    return this._direction;
  }

  // ---------------------------------------------------------------
  // Public — called each frame from WorldScene.update()
  // ---------------------------------------------------------------

  update(cursors, wasd) {
    const speed = GAME_CONFIG.PLAYER_SPEED;

    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown  || wasd.left.isDown)  { vx = -speed; }
    if (cursors.right.isDown || wasd.right.isDown)  { vx =  speed; }
    if (cursors.up.isDown    || wasd.up.isDown)     { vy = -speed; }
    if (cursors.down.isDown  || wasd.down.isDown)   { vy =  speed; }

    // Normalise diagonal movement
    if (vx !== 0 && vy !== 0) {
      const factor = 1 / Math.SQRT2;
      vx *= factor;
      vy *= factor;
    }

    this._sprite.body.setVelocity(vx, vy);

    this._moving = vx !== 0 || vy !== 0;

    if (this._moving) {
      // Resolve facing direction — vertical wins if both axes active
      let newDir = this._direction;
      if      (vy < 0) { newDir = 'up'; }
      else if (vy > 0) { newDir = 'down'; }
      else if (vx < 0) { newDir = 'left'; }
      else if (vx > 0) { newDir = 'right'; }

      if (newDir !== this._direction) {
        this._direction = newDir;
        this._sprite.setTexture('player-' + this._direction);
      }

      // Alpha oscillation: 0.85–1.0 ~250ms sine cycle
      this._alphaTime += this._scene.game.loop.delta;
      const alpha = 0.925 + 0.075 * Math.sin(this._alphaTime / 250 * Math.PI * 2);
      this._sprite.setAlpha(alpha);
    } else {
      // Stopped — reset alpha, keep last texture
      this._sprite.setAlpha(1);
      this._alphaTime = 0;
    }
  }

  // ---------------------------------------------------------------
  // Private — texture generation
  // ---------------------------------------------------------------

  _createDirectionalTextures(scene, tileSize) {
    const SIZE = tileSize - 4; // 28 when tileSize === 32

    const directions = {
      'player-down':  { ax: 14, ay: 23, bx: 8,  by: 7,  cx: 20, cy: 7  },
      'player-up':    { ax: 14, ay: 5,  bx: 8,  by: 21, cx: 20, cy: 21 },
      'player-left':  { ax: 5,  ay: 14, bx: 21, by: 8,  cx: 21, cy: 20 },
      'player-right': { ax: 23, ay: 14, bx: 7,  by: 8,  cx: 7,  cy: 20 },
    };

    for (const [key, tri] of Object.entries(directions)) {
      if (scene.textures.exists(key)) { continue; }

      const texture = scene.textures.createCanvas(key, SIZE, SIZE);
      const ctx     = texture.getContext();

      // Body fill — gold rectangle
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Inner border — 1px inset
      ctx.strokeStyle = '#B89B00';
      ctx.lineWidth   = 1;
      ctx.strokeRect(0.5, 0.5, SIZE - 1, SIZE - 1);

      // Direction triangle
      ctx.fillStyle = '#7A6000';
      ctx.beginPath();
      ctx.moveTo(tri.ax, tri.ay);
      ctx.lineTo(tri.bx, tri.by);
      ctx.lineTo(tri.cx, tri.cy);
      ctx.closePath();
      ctx.fill();

      texture.refresh();
    }
  }
}
