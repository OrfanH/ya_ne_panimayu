/* ============================================
   Phaser Game Configuration and Scene Registry
   ============================================ */

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_CONFIG.GAME_WIDTH,
  height: GAME_CONFIG.GAME_HEIGHT,
  pixelArt: true,
  scale: {
    mode: GAME_CONFIG.SCALE_MODE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [BootScene, WorldScene, ApartmentScene, ParkScene, CafeScene, MarketScene, StationScene, PoliceScene, TestScene],
};

const game = new Phaser.Game(gameConfig);

// Test seam — exposes minimal game state for Playwright assertions.
// Read-only. No test-only behaviour. Safe in production.
window.__GAME__ = game;
