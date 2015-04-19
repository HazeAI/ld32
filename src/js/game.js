/* global module, require */

'use strict';

const Player = require('player');
const MeleeChaser = require('enemy');
const {randomize} = require('weapon');

class Game {
  constructor() {
    this.player = null;
  }

  create() {
    const x = this.game.width / 2;
    const y = this.game.height / 2;

    this.player = new Player(x, y, 'player', this);
    this.enemy = new MeleeChaser(x, y, 'melee_enemy', this);

    this.rndWeapon();

    this.setupKeyboard();
    this.setupGamepad();
  }

  update() {
    this.player.update();
    this.enemy.update();
  }
  
  rndWeapon() {
    this.player.setWeapon(randomize(this));
  }

  ////////////////////////////////////////////////////////////////////////
  // Input

  setupGamepad() {
    // TODO
  }

  setupKeyboard() {
    // TODO: arrow keys!
    
    let fire = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fire.onDown.add(this.player.fire, this.player);
    fire.onUp.add(this.player.ceaseFire, this.player);
    
    let next_weapon = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
    next_weapon.onDown.add(this.rndWeapon, this);
  }

  // Input
  ////////////////////////////////////////////////////////////////////////

}


module.exports = Game;
