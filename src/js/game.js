/* global module */

'use strict';

const { StraightForward, Spread, BackAndForth } = require('weapon');

class Game {
  constructor() {
    this.player = null;
  }

  create() {
    var x = this.game.width / 2
      , y = this.game.height / 2;

    this.player = this.add.sprite(x, y, "player");
    this.player.weapons = []
    this.player.weapons.push(new StraightForward(this, 'basic_bullet'));
    this.player.weapons.push(new Spread(this, 'basic_bullet'));
    this.player.weapons.push(new BackAndForth(this, 'basic_bullet'));
    this.player.weaponIndex = 0;
    this.player.weapon = this.player.weapons[this.player.weaponIndex];
    this.player.anchor.setTo(0.5, 0.5);
    this.input.onHold.add(this.onInputDown, this);
  }

  update() {
      
    this.player.position.x = this.input.position.x;
    this.player.position.y = this.input.position.y;
      
    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { 
      this.player.weapon.fire(this.player);
    }
      
    if (this.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
      this.player.weaponIndex++;
      if (this.player.weaponIndex >= this.player.weapons.length) {
        this.player.weaponIndex = 0;
      }
      this.player.weapon = this.player.weapons[this.player.weaponIndex];
      
    }
      
  }

  onInputDown() {
    this.player.weapon.fire(this.player);
  }

}

module.exports = Game;