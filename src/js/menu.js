'use strict';

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

    this.input.onDown.add(this.onDown, this);
  }

  update() {}

  onDown() {
    this.game.state.start('game');
  }
}

module.exports = Menu;
