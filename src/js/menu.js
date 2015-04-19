'use strict';

const {Phaser} = global;

class Menu {

  constructor() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  create() {
    let x = this.game.width / 2;
    let y = this.game.height / 2;


    this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Example Game' );
    this.titleTxt.align = 'center';
    this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;

    y = y + this.titleTxt.height + 5;

    this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'START');
    this.startTxt.align = 'center';
    this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;

    this.start_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pad = this.game.input.gamepad.pad1;
  }

  update() {
    if (this.start_key.isDown || this.pad.isDown(9) || this.pad.isDown(0)) {
      this.game.state.start('game');
    }
  }
}

module.exports = Menu;
