'use strict';

const { Phaser } = global;

class Boot {
  preload() {
    this.load.image('preloader', 'assets/preloader.gif');
  }

  create() {
    this.game.input.maxPointers = 1;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.forceOrientation(true);
    this.game.scale.setScreenSize(true);
    this.game.state.start('preloader');
  }
}


module.exports = Boot;
