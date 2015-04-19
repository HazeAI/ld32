/* global module, require */

'use strict';

/*
TODO: Collision
TODO: Enemies Group
TODO: Implement Score, Lives, Health
*/

const Player = require('player');
const {
  Drone,
  RangedDrone,
  Chaser,
  RangedChaser
} = require('enemy');
const { randomize } = require('weapon');

class Game {
  constructor() {
    this.player = null;
  }

  create() {
    const x = this.game.width / 2;
    const y = this.game.height / 2;

    this.map = this.game.add.tilemap('garbage');
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.backgroundlayer = this.map.createLayer('testLayer');
    this.backgroundlayer.resizeWorld();

    this.player = new Player(x, y, 'player', this);
    this.enemy = new Drone(this.game.width, y, 'melee_enemy', this);
    this.otherEnemy = new RangedDrone(this.game.width, y, 'melee_enemy', this);

    this.rndWeapon();

    this.setupKeyboard();
    this.setupGamepad();
  }

  update() {
    // FIXME: what is this '9' mean?
    this.camera.x += (this.time.elapsedMS / 9);
    this.player.update();
    this.enemy.update();
    this.otherEnemy.update();
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
    let random_weapon = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
    random_weapon.onDown.add(this.rndWeapon, this);
  }

  // Input
  ////////////////////////////////////////////////////////////////////////

}


module.exports = Game;
