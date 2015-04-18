/* global module, require */

'use strict';

const {StraightForward, Spread, BackAndForth,
       Circle, randomize} = require('weapon');

class Game {
  constructor() {
    this.player = null;
  }

  create() {
    const x = this.game.width / 2;
    const y = this.game.height / 2;

    this.player = this.add.sprite(x, y, "player");
    this.player.anchor.setTo(0.5, 0.5);

    this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    let randomWeaponButton = this.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    randomWeaponButton.onDown.add(this.rndWeapon, this);
    
    this.rndWeapon();
  }

  update() {
      
    this.player.position.x = this.input.position.x;
    this.player.position.y = this.input.position.y;
      
    if (this.fireButton.isDown) { 
      this.player.weapon.fire(this.player);
    }
      
  }
    
  rndWeapon() {
   
    this.player.weapon = randomize(this);
      
  }

}


module.exports = Game;
