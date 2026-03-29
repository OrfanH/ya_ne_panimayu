/* ============================================
   Town Scene — DEPRECATED
   Superseded by WorldScene (key: 'World').
   Kept to avoid breaking index.html load order.
   Do not start this scene — nothing links to 'Town' anymore.
   ============================================ */

class TownScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Town' });
  }

  create() {
    /* Temporary: solid background colour until tilemap is built */
    this.cameras.main.setBackgroundColor('#7ec850');

    /* Create player as a simple rectangle placeholder */
    this.player = this.add.rectangle(
      GAME_CONFIG.GAME_WIDTH / 2,
      GAME_CONFIG.GAME_HEIGHT / 2,
      GAME_CONFIG.TILE_SIZE,
      GAME_CONFIG.TILE_SIZE * 1.5,
      0x3d3a8c
    );
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    /* Camera follows player with smooth lerp */
    this.cameras.main.startFollow(this.player, true, GAME_CONFIG.CAMERA_LERP, GAME_CONFIG.CAMERA_LERP);

    /* Input: WASD + arrow keys */
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    /* Placeholder buildings as coloured rectangles */
    this.createPlaceholderBuildings();

    /* Fire location enter event for HUD */
    this.game.events.emit(EVENTS.LOCATION_ENTER, { name: 'Town' });
  }

  createPlaceholderBuildings() {
    const buildings = [
      { x: 200, y: 150, w: 96, h: 80, color: 0xc4a882, label: 'Apartment' },
      { x: 500, y: 100, w: 80, h: 64, color: 0x4a8c3d, label: 'Park' },
      { x: 650, y: 250, w: 80, h: 64, color: 0x8c6a3d, label: 'Cafe' },
      { x: 150, y: 400, w: 96, h: 72, color: 0x8c3d3d, label: 'Market' },
      { x: 600, y: 450, w: 96, h: 64, color: 0x3d5a8c, label: 'Station' },
      { x: 400, y: 500, w: 80, h: 64, color: 0x5a5a5a, label: 'Police' },
    ];

    for (const b of buildings) {
      const rect = this.add.rectangle(b.x, b.y, b.w, b.h, b.color);
      this.add.text(b.x, b.y - b.h / 2 - 12, b.label, {
        fontSize: '10px',
        color: '#ffffff',
        fontFamily: 'Kenney Pixel',
      }).setOrigin(0.5);
    }
  }

  update() {
    const speed = GAME_CONFIG.PLAYER_SPEED;
    const body = this.player.body;

    body.setVelocity(0);

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    if (left) body.setVelocityX(-speed);
    else if (right) body.setVelocityX(speed);

    if (up) body.setVelocityY(-speed);
    else if (down) body.setVelocityY(speed);

    /* Normalize diagonal movement */
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.velocity.normalize().scale(speed);
    }
  }
}
