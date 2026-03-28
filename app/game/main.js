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
  scene: [WorldScene, ApartmentScene],
};

const game = new Phaser.Game(gameConfig);
