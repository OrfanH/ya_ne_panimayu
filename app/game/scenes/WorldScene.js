/* ============================================
   WorldScene — Tiled overworld, 6 buildings, collision, locked locations
   ============================================ */

const COLS = 50;
const ROWS = 37;
const PLAYER_SPAWN_COL = 10;
const PLAYER_SPAWN_ROW = 18;

const BUILDING_ZONES = [
  { id: 'apartment', name: 'Apartment Building', col: 5,  row: 3,  cols: 6, rows: 5, chapter: 1, locked: false,
    roofColor: 0xD95F3B, wallColor: 0xE8C99A, doorColor: 0x7B5533 },
  { id: 'park',      name: 'Park',               col: 14, row: 2,  cols: 5, rows: 4, chapter: 2, locked: true,
    roofColor: 0x4E9E55, wallColor: 0xB5D98A, doorColor: null },
  { id: 'cafe',      name: 'Café',               col: 22, row: 8,  cols: 5, rows: 4, chapter: 3, locked: true,
    roofColor: 0xC97C3A, wallColor: 0xF0DDB8, doorColor: 0x7B5533 },
  { id: 'market',    name: 'Market',             col: 4,  row: 14, cols: 6, rows: 5, chapter: 4, locked: true,
    roofColor: 0x3A7FC1, wallColor: 0xA8C8E8, doorColor: 0x3A5A8C },
  { id: 'station',   name: 'Train Station',      col: 20, row: 20, cols: 6, rows: 4, chapter: 5, locked: true,
    roofColor: 0x888888, wallColor: 0xC8C8C8, doorColor: 0x555555 },
  { id: 'police',    name: 'Police Station',     col: 11, row: 25, cols: 5, rows: 4, chapter: 6, locked: true,
    roofColor: 0x3D3A8C, wallColor: 0xD0D8F0, doorColor: 0x2A2870 },
];

class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'World' });
  }

  preload() {
    // Create all tile textures programmatically — no external assets needed.
    this._tileKeys = MapBuilder.createTileTextures(this);
  }

  create() {
    const T = GAME_CONFIG.TILE_SIZE;
    const worldW = COLS * T;
    const worldH = ROWS * T;

    // -------------------------------------------------------
    // 1. Draw ground layer (grass checker + paths)
    // -------------------------------------------------------
    this._drawGround(T, worldW, worldH);

    // -------------------------------------------------------
    // 2. Draw path network connecting building entrances
    // -------------------------------------------------------
    this._drawPaths(T);

    // -------------------------------------------------------
    // 3. Draw buildings
    // -------------------------------------------------------
    this._buildingGraphics = [];
    for (const zone of BUILDING_ZONES) {
      const gfx = this._drawBuilding(zone, T);
      this._buildingGraphics.push({ zone, gfx });
    }

    // -------------------------------------------------------
    // 4. Collision layer (invisible physics bodies)
    // -------------------------------------------------------
    const collisionMap = MapBuilder.buildCollisionUint8(COLS, ROWS, BUILDING_ZONES);

    this.collisionGroup = this.physics.add.staticGroup();

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (collisionMap[row * COLS + col] === 1) {
          const img = this.add.image(
            col * T + T / 2,
            row * T + T / 2,
            this._tileKeys.wall
          );
          img.setAlpha(0);  // invisible — physics body only
          this.collisionGroup.add(img);
        }
      }
    }

    this.collisionGroup.refresh();

    // -------------------------------------------------------
    // 5. Player
    // -------------------------------------------------------
    const spawnX = PLAYER_SPAWN_COL * T + T / 2;
    const spawnY = PLAYER_SPAWN_ROW * T + T / 2;

    this.player = this.add.rectangle(spawnX, spawnY, T - 4, T - 4, 0xFFD700);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // -------------------------------------------------------
    // 6. Collision between player and solid tiles
    // -------------------------------------------------------
    this.physics.add.collider(this.player, this.collisionGroup);

    // -------------------------------------------------------
    // 7. World bounds
    // -------------------------------------------------------
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // -------------------------------------------------------
    // 8. Camera
    // -------------------------------------------------------
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, GAME_CONFIG.CAMERA_LERP, GAME_CONFIG.CAMERA_LERP);
    this.cameras.main.fadeIn(300);

    // -------------------------------------------------------
    // 9. Input
    // -------------------------------------------------------
    this._cursors = this.input.keyboard.createCursorKeys();
    this._wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // -------------------------------------------------------
    // 10. Building zone interaction tracking
    // -------------------------------------------------------
    this._currentZoneId = null;
    this._proximityOutlines = this._createProximityOutlines(T);
  }

  update() {
    this._handleMovement();
    this._checkZoneProximity();
  }

  // ---------------------------------------------------------------
  // Private — ground
  // ---------------------------------------------------------------
  _drawGround(T, worldW, worldH) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isDark = (row + col) % 2 === 1;
        const key = isDark ? this._tileKeys.grassDark : this._tileKeys.grass;
        this.add.image(col * T + T / 2, row * T + T / 2, key);
      }
    }
  }

  // ---------------------------------------------------------------
  // Private — path network
  // ---------------------------------------------------------------
  _drawPaths(T) {
    // Vertical spine along col 10 connecting all building areas
    // Horizontal branches to each building entrance
    const pathSegments = this._computePathSegments();

    const gfx = this.add.graphics();
    gfx.fillStyle(0xC8A96E);

    for (const seg of pathSegments) {
      gfx.fillRect(seg.col * T, seg.row * T, seg.cols * T, seg.rows * T);
    }

    // Subtle edge lines
    gfx.fillStyle(0xB89558);
    for (const seg of pathSegments) {
      // Top edge
      gfx.fillRect(seg.col * T, seg.row * T, seg.cols * T, 2);
      // Bottom edge
      gfx.fillRect(seg.col * T, (seg.row + seg.rows) * T - 2, seg.cols * T, 2);
    }
  }

  _computePathSegments() {
    // Build a list of { col, row, cols, rows } rectangles for a path network.
    // Strategy: vertical spine at col 9-10, horizontal arms to each building door.
    const segments = [];

    // Vertical spine cols 9-10, rows 2-30
    segments.push({ col: 9, row: 2, cols: 2, rows: 29 });

    // Horizontal branch to each building (from door column of building to spine)
    for (const zone of BUILDING_ZONES) {
      const doorCol   = zone.col + Math.floor(zone.cols / 2);
      const doorRow   = zone.row + zone.rows - 1;  // bottom of building
      const spineCol  = 10;

      if (doorCol > spineCol) {
        // Branch goes right from spine to building
        segments.push({
          col:  spineCol,
          row:  doorRow,
          cols: doorCol - spineCol + 1,
          rows: 1,
        });
      } else if (doorCol < spineCol) {
        // Branch goes left from building to spine
        segments.push({
          col:  doorCol,
          row:  doorRow,
          cols: spineCol - doorCol + 1,
          rows: 1,
        });
      }
      // doorCol === spineCol: building is on the spine, no horizontal branch needed
    }

    return segments;
  }

  // ---------------------------------------------------------------
  // Private — building drawing
  // ---------------------------------------------------------------
  _drawBuilding(zone, T) {
    const x = zone.col * T;
    const y = zone.row * T;
    const w = zone.cols * T;
    const h = zone.rows * T;

    const gfx = this.add.graphics();

    // Wall fill
    gfx.fillStyle(zone.wallColor);
    gfx.fillRect(x, y, w, h);

    // Roof strip (top 1 tile height)
    gfx.fillStyle(zone.roofColor);
    gfx.fillRect(x, y, w, T);

    // Door (if applicable) — bottom centre, 1 tile wide, 1.5 tiles tall
    if (zone.doorColor !== null) {
      const doorCol   = zone.col + Math.floor(zone.cols / 2);
      const doorX     = doorCol * T + T * 0.2;
      const doorW     = T * 0.6;
      const doorH     = T * 1.2;
      const doorY     = y + h - doorH;
      gfx.fillStyle(zone.doorColor);
      gfx.fillRect(doorX, doorY, doorW, doorH);
    }

    // Locked visual treatment
    if (zone.locked) {
      gfx.setTint(0x555577);
      gfx.setAlpha(0.6);

      // Padlock glyph at the centre of the building (drawn after tint so it sits on top)
      const cx = x + w / 2;
      const cy = y + h / 2;
      this._drawPadlock(cx, cy);
    }

    // Label
    const labelY = y - 4;
    const labelColor = zone.locked ? '#AAAACC' : '#F7F7F5';
    const label = this.add.text(x + w / 2, labelY, zone.name, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: labelColor,
      shadow: { x: 1, y: 1, color: '#00000066', fill: true },
    });
    label.setOrigin(0.5, 1);

    return gfx;
  }

  _drawPadlock(cx, cy) {
    const gfx = this.add.graphics();
    gfx.setAlpha(0.7);

    // Shackle (arc top)
    gfx.lineStyle(3, 0xAAAACC);
    gfx.strokeCircle(cx, cy - 8, 7);

    // Body (rectangle)
    gfx.fillStyle(0xAAAACC);
    gfx.fillRect(cx - 7, cy - 4, 14, 10);

    // Keyhole
    gfx.fillStyle(0x555577);
    gfx.fillCircle(cx, cy, 2);
    gfx.fillRect(cx - 1, cy, 2, 4);
  }

  // ---------------------------------------------------------------
  // Private — proximity outlines for unlocked zones
  // ---------------------------------------------------------------
  _createProximityOutlines(T) {
    const outlines = {};
    for (const zone of BUILDING_ZONES) {
      if (!zone.locked) {
        const x = zone.col * T;
        const y = zone.row * T;
        const w = zone.cols * T;
        const h = zone.rows * T;

        const outline = this.add.graphics();
        outline.lineStyle(2, 0xFFFFFF, 1);
        outline.strokeRect(x, y, w, h);
        outline.setVisible(false);
        outlines[zone.id] = outline;
      }
    }
    return outlines;
  }

  // ---------------------------------------------------------------
  // Private — movement
  // ---------------------------------------------------------------
  _handleMovement() {
    const speed = GAME_CONFIG.PLAYER_SPEED;
    const body  = this.player.body;

    let vx = 0;
    let vy = 0;

    if (this._cursors.left.isDown  || this._wasd.left.isDown)  { vx = -speed; }
    if (this._cursors.right.isDown || this._wasd.right.isDown) { vx =  speed; }
    if (this._cursors.up.isDown    || this._wasd.up.isDown)    { vy = -speed; }
    if (this._cursors.down.isDown  || this._wasd.down.isDown)  { vy =  speed; }

    // Normalise diagonal movement
    if (vx !== 0 && vy !== 0) {
      const factor = 1 / Math.SQRT2;
      vx *= factor;
      vy *= factor;
    }

    body.setVelocity(vx, vy);
  }

  // ---------------------------------------------------------------
  // Private — zone proximity / enter / exit
  // ---------------------------------------------------------------
  _checkZoneProximity() {
    const T   = GAME_CONFIG.TILE_SIZE;
    const px  = this.player.x;
    const py  = this.player.y;

    let entered = null;

    for (const zone of BUILDING_ZONES) {
      const zx1 = zone.col * T;
      const zy1 = zone.row * T;
      const zx2 = zx1 + zone.cols * T;
      const zy2 = zy1 + zone.rows * T;

      // Expand proximity check by INTERACTION_RADIUS
      const r = GAME_CONFIG.INTERACTION_RADIUS;
      const near = px >= zx1 - r && px <= zx2 + r &&
                   py >= zy1 - r && py <= zy2 + r;

      if (near) {
        entered = zone;

        // Show proximity outline for unlocked zones
        if (!zone.locked && this._proximityOutlines[zone.id]) {
          this._proximityOutlines[zone.id].setVisible(true);
        }

        // Alpha pulse for locked zones
        if (zone.locked) {
          const bldgEntry = this._buildingGraphics.find(b => b.zone.id === zone.id);
          if (bldgEntry && !zone._pulseTween) {
            zone._pulseTween = this.tweens.add({
              targets: bldgEntry.gfx,
              alpha: { from: 0.6, to: 0.8 },
              duration: 200,
              yoyo: true,
              repeat: -1,
            });
          }
        }
      } else {
        // Hide proximity outline when player leaves area
        if (!zone.locked && this._proximityOutlines[zone.id]) {
          this._proximityOutlines[zone.id].setVisible(false);
        }

        // Stop pulse tween when player leaves locked zone proximity
        if (zone.locked && zone._pulseTween) {
          zone._pulseTween.stop();
          zone._pulseTween = null;
          const bldgEntry = this._buildingGraphics.find(b => b.zone.id === zone.id);
          if (bldgEntry) {
            bldgEntry.gfx.setAlpha(0.6);
          }
        }
      }
    }

    const newId = entered ? entered.id : null;

    if (newId !== this._currentZoneId) {
      if (this._currentZoneId !== null) {
        // Exit previous zone
        this.game.events.emit(EVENTS.LOCATION_EXIT, { id: this._currentZoneId });
      }

      this._currentZoneId = newId;

      if (newId !== null) {
        // Enter new zone
        this.game.events.emit(EVENTS.LOCATION_ENTER, {
          id:     entered.id,
          name:   entered.name,
          locked: entered.locked,
        });
      }
    }
  }
}
