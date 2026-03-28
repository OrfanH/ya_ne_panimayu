/* ============================================
   Boot Scene — Asset preloading
   Currently unused — Town loads directly.
   Will be re-enabled when sprite/map assets exist.
   ============================================ */

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    /* Assets will be loaded here once they exist */
  }

  create() {
    this.scene.start('Town');
  }
}
