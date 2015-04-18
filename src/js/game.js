/* global module, require */

'use strict';

const {StraightForward, Spread, BackAndForth,
       Circle} = require('weapon');

class Game {
  constructor() {
    this.player = null;
  }

  create() {
    const x = this.game.width / 2;
    const y = this.game.height / 2;

    this.player = this.add.sprite(x, y, "player");
    this.player.weapons = [];
    this.player.weapons.push(new StraightForward(this, 'basic_bullet'));
    this.player.weapons.push(new Spread(this, 'basic_bullet'));
    this.player.weapons.push(new BackAndForth(this, 'basic_bullet'));
    this.player.weapons.push(new Circle(this, 'basic_bullet'));
    this.player.weaponIndex = 0;
    this.player.weapon = this.player.weapons[this.player.weaponIndex];
    this.player.anchor.setTo(0.5, 0.5);

    this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    let weaponChangeButton = this.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    weaponChangeButton.onDown.add(this.nextWeapon, this);
  }

  update() {
      
    this.player.position.x = this.input.position.x;
    this.player.position.y = this.input.position.y;
      
    if (this.fireButton.isDown) { 
      this.player.weapon.fire(this.player);
    }
      
  }

  nextWeapon() {

    this.player.weaponIndex++;
    if (this.player.weaponIndex >= this.player.weapons.length) {
      this.player.weaponIndex = 0;
    }
      this.player.weapon = this.player.weapons[this.player.weaponIndex];

  }

}


module.exports = Game;
