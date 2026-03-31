/* ============================================
   WorldScene — Tiled overworld, 6 buildings, collision, locked locations
   ============================================ */

const COLS = 50;
const ROWS = 37;
const PLAYER_SPAWN_COL = 10;
const PLAYER_SPAWN_ROW = 18;

const BUILDING_ZONES = [
  { id: 'apartment', name: 'Apartment Building', col: 5,  row: 3,  cols: 6, rows: 5, chapter: 1, locked: false },
  { id: 'park',      name: 'Park',               col: 14, row: 2,  cols: 5, rows: 4, chapter: 2, locked: true  },
  { id: 'cafe',      name: 'Café',               col: 22, row: 8,  cols: 5, rows: 4, chapter: 3, locked: true  },
  { id: 'market',    name: 'Market',             col: 4,  row: 14, cols: 6, rows: 5, chapter: 4, locked: true  },
  { id: 'station',   name: 'Train Station',      col: 20, row: 20, cols: 6, rows: 4, chapter: 5, locked: true  },
  { id: 'police',    name: 'Police Station',     col: 11, row: 25, cols: 5, rows: 4, chapter: 6, locked: true  },
];

/*
 * CITY TILESET INDEX MAP (roguelike-city.png)
 * Frame formula: N = row × 34 + col  (34 tiles per row, 0-indexed)
 * Sheet size: 592px wide / 17px per cell = 34 columns, 26 rows, max index 883
 * Spritesheet key: 'city'  |  16×16 px tiles  |  1px spacing
 *
 * Ground:
 *   grass_a  = 816  (r24c0  solid mid-green grass)
 *   grass_b  = 850  (r25c0  same green, slight dapple — checker pair)
 * Paths:
 *   path_a   = 784  (r23c2  grey cobblestone plaza)
 *   path_b   = 785  (r23c3  same cobblestone, slight shade shift)
 * Buildings:
 *   apartment — wall=205 roof=102 door=377
 *   park      — wall=816 roof=370 door=817
 *   cafe      — wall=213 roof=182 door=384
 *   market    — wall=247 roof=268 door=384
 *   station   — wall=284 roof=118 door=386
 *   police    — wall=174 roof=110 door=378
 * Locked overlay hatch:
 *   hatch_a  = 627  (r18c15 white diagonal dashes on light grey)
 *   hatch_b  = 628  (r18c16 same pattern, slight variation)
 */
const CITY_TILES = {
  grass_a: 816,   // r24c0  solid mid-green grass
  grass_b: 850,   // r25c0  same green, slight dapple — checker pair
  path_a:  784,   // r23c2  grey cobblestone plaza
  path_b:  785,   // r23c3  same cobblestone, slight shade shift
  buildings: {
    apartment: { wall: 205, roof: 102, door: 377 },
    park:      { wall: 816, roof: 370, door: 817 },
    cafe:      { wall: 213, roof: 182, door: 384 },
    market:    { wall: 247, roof: 268, door: 384 },
    station:   { wall: 284, roof: 118, door: 386 },
    police:    { wall: 174, roof: 110, door: 378 },
  },
};

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
      const result = this._drawBuilding(zone, T);
      this._buildingGraphics.push({ zone, gfx: result.gfx, overlay: result.overlay });
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

    this._player = new Player(this, spawnX, spawnY, T);

    // -------------------------------------------------------
    // 6. Collision between player and solid tiles
    // -------------------------------------------------------
    this.physics.add.collider(this._player.gameObject, this.collisionGroup);

    // -------------------------------------------------------
    // 5b. Controls hint — show once per session
    // -------------------------------------------------------
    this._showControlsHint();

    // -------------------------------------------------------
    // 7. World bounds
    // -------------------------------------------------------
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // -------------------------------------------------------
    // 8. Camera
    // -------------------------------------------------------
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this._player.gameObject, true, GAME_CONFIG.CAMERA_LERP, GAME_CONFIG.CAMERA_LERP);
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
    // 10. Unlock locations based on progress
    // -------------------------------------------------------
    this._checkUnlocks();

    // -------------------------------------------------------
    // 11. Building zone interaction tracking
    // -------------------------------------------------------
    this._currentZoneId      = null;
    this._lastZoneEnterEmit  = null;
    this._proximityOutlines  = this._createProximityOutlines(T);
    this._transitioning      = false;

    // -------------------------------------------------------
    // 12. Scene transitions via ZONE_ENTER
    // -------------------------------------------------------
    const ZONE_SCENE_MAP = {
      apartment: 'Apartment',
      park:      'Park',
      cafe:      'Cafe',
      market:    'Market',
      station:   'Station',
      police:    'Police',
    };

    this._onZoneEnter = ({ id }) => {
      if (ZONE_SCENE_MAP[id]) {
        this._autoWalking = false;
        this._transitionTo(ZONE_SCENE_MAP[id]);
      }
    };
    this.game.events.on(EVENTS.ZONE_ENTER, this._onZoneEnter);

    // -------------------------------------------------------
    // 13. Intro done — auto-walk player to apartment door
    // -------------------------------------------------------
    this._autoWalking = false;
    this._onIntroDone = () => {
      // Only auto-walk on first play (intro overlay was shown).
      // Returning players dispatch INTRO_DONE immediately — skip the walk.
      getProgress().then((progress) => {
        if (!progress.hasSeenIntro) { return; }
        // hasSeenIntro was JUST set by markIntroSeen() — check if this is
        // the first time (npcRelationships.galina absent means never visited).
        if (progress.npcRelationships && progress.npcRelationships.galina !== undefined) {
          return;
        }

        const T = GAME_CONFIG.TILE_SIZE;
        const targetX = 8 * T + T / 2;
        const targetY = 7 * T + T / 2;
        const dx = targetX - this._player.gameObject.x;
        const dy = targetY - this._player.gameObject.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const duration = (dist / GAME_CONFIG.PLAYER_SPEED) * 1000;

        this._autoWalking = true;
        this.tweens.add({
          targets: this._player.gameObject,
          x: targetX,
          y: targetY,
          duration,
          ease: 'Linear',
        });
      });
    };
    window.addEventListener(EVENTS.INTRO_DONE, this._onIntroDone);
  }

  update() {
    if (!this._autoWalking) {
      this._player.update(this._cursors, this._wasd);
    }
    this._checkZoneProximity();
  }

  shutdown() {
    window.removeEventListener(EVENTS.INTRO_DONE, this._onIntroDone);
    this.game.events.off(EVENTS.ZONE_ENTER, this._onZoneEnter);
    this._player.destroy();
    this._transitioning = false;
  }

  // ---------------------------------------------------------------
  // Private — fade-out then start target scene
  // ---------------------------------------------------------------
  _transitionTo(sceneKey) {
    if (this._transitioning) { return; }
    this._transitioning = true;
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(sceneKey);
    });
  }

  // ---------------------------------------------------------------
  // Private — unlock check based on progress
  // ---------------------------------------------------------------
  _checkUnlocks() {
    // Park unlocks after player has visited apartment (chapter >= 2 or park in unlockedLocations)
    getProgress().then((progress) => {
      const unlocked = progress.unlockedLocations || [];
      for (const zone of BUILDING_ZONES) {
        if (zone.locked && unlocked.includes(zone.id)) {
          zone.locked = false;
        }
      }
      // Always unlock park after first apartment visit
      if (unlocked.includes('apartment') || progress.chapter >= 2) {
        const park = BUILDING_ZONES.find((z) => z.id === 'park');
        if (park) { park.locked = false; }
      }
    });
  }

  // ---------------------------------------------------------------
  // Private — ground
  // ---------------------------------------------------------------
  _drawGround(T, worldW, worldH) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const frame = (row + col) % 2 === 1 ? CITY_TILES.grass_b : CITY_TILES.grass_a;
        this.add.image(col * T + T / 2, row * T + T / 2, 'city', frame);
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

    for (const seg of pathSegments) {
      for (let r = seg.row; r < seg.row + seg.rows; r++) {
        for (let c = seg.col; c < seg.col + seg.cols; c++) {
          const frame = (r + c) % 2 === 0 ? CITY_TILES.path_a : CITY_TILES.path_b;
          this.add.image(c * T + T / 2, r * T + T / 2, 'city', frame);
        }
      }
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

    const tiles = this.add.container(0, 0);
    const spec = CITY_TILES.buildings[zone.id];

    // Wall fill (all rows)
    for (let r = zone.row; r < zone.row + zone.rows; r++) {
      for (let c = zone.col; c < zone.col + zone.cols; c++) {
        tiles.add(this.add.image(c * T + T / 2, r * T + T / 2, 'city', spec.wall));
      }
    }

    // Roof overdraw (top row)
    for (let c = zone.col; c < zone.col + zone.cols; c++) {
      tiles.add(this.add.image(c * T + T / 2, zone.row * T + T / 2, 'city', spec.roof));
    }

    // Door (bottom centre, 1 tile)
    const doorCol = zone.col + Math.floor(zone.cols / 2);
    const doorRow = zone.row + zone.rows - 1;
    tiles.add(this.add.image(doorCol * T + T / 2, doorRow * T + T / 2, 'city', spec.door));

    // Locked visual treatment — hatch tile overlay over building footprint
    let overlay = null;
    if (zone.locked) {
      overlay = this.add.container(0, 0);
      for (let r = zone.row; r < zone.row + zone.rows; r++) {
        for (let c = zone.col; c < zone.col + zone.cols; c++) {
          const hatchFrame = (r + c) % 2 === 0 ? 627 : 628;
          const hatchTile = this.add.image(c * T + T / 2, r * T + T / 2, 'city', hatchFrame);
          hatchTile.setAlpha(0.65);
          overlay.add(hatchTile);
        }
      }
      tiles.setAlpha(0.6);
    }

    // Label
    const labelY = y - 4;
    const labelColor = zone.locked ? '#AAAACC' : '#F7F7F5';
    const label = this.add.text(x + w / 2, labelY, zone.name, {
      fontFamily: 'Kenney Pixel',
      fontSize: '13px',
      color: labelColor,
      shadow: { x: 1, y: 1, color: '#00000066', fill: true },
    });
    label.setOrigin(0.5, 1);

    // Return container as 'gfx' so existing code that calls gfx.setAlpha still works
    return { gfx: tiles, overlay };
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
  // Private — controls hint (first WorldScene visit per session)
  // ---------------------------------------------------------------
  _showControlsHint() {
    if (sessionStorage.getItem('controls-hint-shown')) { return; }
    sessionStorage.setItem('controls-hint-shown', '1');

    const isMobile = window.matchMedia('(pointer: coarse)').matches ||
                     window.innerWidth <= 600;
    const message = isMobile
      ? 'Use joystick to move, tap NPC to talk'
      : 'WASD / \u2191\u2193\u2190\u2192 to move, E to talk';
    const DURATION = 5000;

    // Delay slightly so the scene fade-in completes first
    const showTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENTS.HUD_TOAST, {
        detail: { message, duration: DURATION },
      }));
    }, 400);

    // Dismiss early on first player movement
    const _onMove = () => {
      clearTimeout(showTimer);
      window.dispatchEvent(new CustomEvent(EVENTS.HUD_TOAST, {
        detail: { message: '', duration: 1 },
      }));
      this.input.keyboard.off('keydown', _onMove);
      this.input.off('pointermove', _onMove);
    };
    this.input.keyboard.once('keydown', _onMove);
    this.input.once('pointermove', _onMove);
  }

  // ---------------------------------------------------------------
  // Private — zone proximity / enter / exit / ZONE_ENTER
  // ---------------------------------------------------------------
  _checkZoneProximity() {
    const T   = GAME_CONFIG.TILE_SIZE;
    const px  = this._player.gameObject.x;
    const py  = this._player.gameObject.y;

    // Player's current tile position
    const playerCol = Math.floor(px / T);
    const playerRow = Math.floor(py / T);

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

        // Alpha pulse for locked zones — animate the overlay rectangle
        if (zone.locked) {
          const bldgEntry = this._buildingGraphics.find(b => b.zone.id === zone.id);
          if (bldgEntry && bldgEntry.overlay && !zone._pulseTween) {
            zone._pulseTween = this.tweens.add({
              targets: bldgEntry.overlay,
              alpha: { from: 0.5, to: 0.3 },
              duration: 200,
              yoyo: true,
              repeat: -1,
            });
          }
        }

        // ZONE_ENTER: fire when player steps onto the door tile of an unlocked zone
        if (!zone.locked) {
          const doorCol = zone.col + Math.floor(zone.cols / 2);
          const doorRow = zone.row + zone.rows - 1;

          if (playerCol === doorCol && playerRow === doorRow) {
            const enterKey = zone.id + ':' + doorCol + ':' + doorRow;
            if (this._lastZoneEnterEmit !== enterKey) {
              this._lastZoneEnterEmit = enterKey;
              this.game.events.emit(EVENTS.ZONE_ENTER, {
                id:   zone.id,
                name: zone.name,
              });
            }
          } else {
            // Reset guard when player leaves the door tile
            const enterKey = zone.id + ':' + doorCol + ':' + doorRow;
            if (this._lastZoneEnterEmit === enterKey) {
              this._lastZoneEnterEmit = null;
            }
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
          if (bldgEntry && bldgEntry.overlay) {
            bldgEntry.overlay.setAlpha(0.5);
          }
        }
      }
    }

    const newId = entered ? entered.id : null;

    if (newId !== this._currentZoneId) {
      if (this._currentZoneId !== null) {
        // Exit previous zone
        window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_EXIT, {
          detail: { id: this._currentZoneId },
        }));
      }

      this._currentZoneId = newId;

      if (newId !== null) {
        // Enter new zone
        window.dispatchEvent(new CustomEvent(EVENTS.LOCATION_ENTER, {
          detail: {
            id:     entered.id,
            name:   entered.name,
            locked: entered.locked,
          },
        }));
      }
    }
  }
}
