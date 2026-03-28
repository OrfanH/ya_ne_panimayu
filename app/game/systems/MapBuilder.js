/* ============================================
   MapBuilder — programmatic tile textures + collision map
   ============================================ */

const MapBuilder = {
  /**
   * Extract one 16x16 frame from the 'urban' spritesheet and scale it up to T×T.
   * Skips silently if the dest texture already exists.
   * @param {Phaser.Scene} scene
   * @param {number}       frameIndex  — linear frame index (N % 27 = col, N / 27 = row)
   * @param {string}       destKey     — texture key to register
   * @param {number}       T           — output tile size in pixels
   */
  _extractUrbanTile(scene, frameIndex, destKey, T) {
    if (scene.textures.exists(destKey)) { return; }
    const COLS       = 27;
    const FRAME_SIZE = 16;
    const col = frameIndex % COLS;
    const row = Math.floor(frameIndex / COLS);
    const canvas = scene.textures.createCanvas(destKey, T, T);
    const ctx    = canvas.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      scene.textures.get('urban').getSourceImage(),
      col * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE,
      0, 0, T, T
    );
    canvas.refresh();
  },

  /**
   * Build a Uint8Array collision map.
   * Value 1 = solid (wall/building), 0 = passable.
   * @param {number} cols
   * @param {number} rows
   * @param {Array}  zones  — array of { col, row, cols, rows } building zone objects
   * @returns {Uint8Array}
   */
  buildCollisionUint8(cols, rows, zones) {
    const map = new Uint8Array(cols * rows);

    for (const zone of zones) {
      // Mark a 1-tile-thick border around each building as solid wall.
      // The interior of the building is also solid (player cannot walk through buildings).
      // Leave a 1-tile gap at the bottom-centre of each zone as a doorway.
      const doorCol = zone.col + Math.floor(zone.cols / 2);

      for (let r = zone.row; r < zone.row + zone.rows; r++) {
        for (let c = zone.col; c < zone.col + zone.cols; c++) {
          // Bottom edge door opening: last row, centre column is passable
          const isBottomEdge = (r === zone.row + zone.rows - 1);
          const isDoorTile   = (c === doorCol);

          if (isBottomEdge && isDoorTile) {
            // door — passable
            continue;
          }

          if (
            r >= 0 && r < rows &&
            c >= 0 && c < cols
          ) {
            map[r * cols + c] = 1;
          }
        }
      }
    }

    return map;
  },

  /**
   * Draw grass / path / wall tile textures onto RenderTextures.
   * Each texture is TILE_SIZE × TILE_SIZE pixels.
   * Returns an object of texture keys that are registered in the scene's texture manager.
   * @param {Phaser.Scene} scene
   * @returns {{ grass: string, grassDark: string, path: string, wall: string }}
   */
  createTileTextures(scene) {
    const T = GAME_CONFIG.TILE_SIZE;

    if (scene.textures.exists('urban')) {
      // Kenney RPG Urban Pack — extract frames at 2× scale (16 → 32 px)
      // Frame indices: col = N % 27, row = floor(N / 27), pixel = col×16, row×16
      this._extractUrbanTile(scene,  0, 'tile_grass',      T); // row 0 col 0  — bright green
      this._extractUrbanTile(scene, 27, 'tile_grass_dark', T); // row 1 col 0  — darker green
      this._extractUrbanTile(scene, 81, 'tile_path',       T); // row 3 col 0  — grey sidewalk
      this._extractUrbanTile(scene, 16, 'tile_wall',       T); // row 0 col 16 — brick
    } else {
      // Fallback: programmatic colored rectangles
      const grassGfx = scene.make.graphics({ x: 0, y: 0, add: false });
      grassGfx.fillStyle(0x6AAF4E);
      grassGfx.fillRect(0, 0, T, T);
      grassGfx.generateTexture('tile_grass', T, T);
      grassGfx.destroy();

      const grassDarkGfx = scene.make.graphics({ x: 0, y: 0, add: false });
      grassDarkGfx.fillStyle(0x5A9C40);
      grassDarkGfx.fillRect(0, 0, T, T);
      grassDarkGfx.generateTexture('tile_grass_dark', T, T);
      grassDarkGfx.destroy();

      const pathGfx = scene.make.graphics({ x: 0, y: 0, add: false });
      pathGfx.fillStyle(0xC8A96E);
      pathGfx.fillRect(0, 0, T, T);
      pathGfx.fillStyle(0xB89558);
      pathGfx.fillRect(0, 0, T, 2);
      pathGfx.fillRect(0, T - 2, T, 2);
      pathGfx.generateTexture('tile_path', T, T);
      pathGfx.destroy();

      const wallGfx = scene.make.graphics({ x: 0, y: 0, add: false });
      wallGfx.fillStyle(0x8B6343);
      wallGfx.fillRect(0, 0, T, T);
      wallGfx.generateTexture('tile_wall', T, T);
      wallGfx.destroy();
    }

    return {
      grass:     'tile_grass',
      grassDark: 'tile_grass_dark',
      path:      'tile_path',
      wall:      'tile_wall',
    };
  },
};
