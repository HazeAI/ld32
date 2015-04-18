/* global module, require */

'use strict';


const { StraightForward } = require('weapon');


class Game {
  constructor() {
    this.player = null;
  }

  create() {
    const x = this.game.width / 2;
    const y = this.game.height / 2;

    this.player = this.add.sprite(x, y, 'player');
    this.player.weapon = new StraightForward(this, 'basic_bullet');
    this.player.anchor.setTo(0.5, 0.5);
    this.input.onDown.add(this.onInputDown, this);
  }

  update() {
    this.player.position.x = this.input.position.x;
    this.player.position.y = this.input.position.y;
  }

  onInputDown() {
    this.player.weapon.fire(this.player);
  }

}


module.exports = Game;
