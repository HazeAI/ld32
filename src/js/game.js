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
    
    this.game.world.setBounds(0, 0, 
                              this.game.width, this.game.height);

    this.map = this.game.add.tilemap('garbage');
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.backgroundlayer = this.map.createLayer('testLayer');
    this.backgroundlayer.resizeWorld();

    this.player = new Player(x, y, 'player', this);
    this.enemy = new Drone('melee_enemy', this);
    this.otherEnemy = new RangedDrone('melee_enemy', this);
    this.enemy.reset(this.game.width, y);
    this.otherEnemy.reset(this.game.width, y);

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
    this.physics.arcade.overlap(this.player.weapon, this.enemy, this.enemyHit, null, this);
    this.physics.arcade.overlap(this.player.weapon, this.otherEnemy, this.enemyHit, null, this);
    if (this.enemy.exists == false) {
      this.enemy.reset(this.game.width+this.game.camera.x,
                       this.game.rnd.between(0, this.game.height));   
    }
    if (this.otherEnemy.exists == false) {
      this.otherEnemy.reset(this.game.width+this.game.camera.x,
                      this.game.rnd.between(0, this.game.height));
    }
  }
    
  enemyHit(bullet, enemy){
    console.log('hit');
    bullet.kill();
    enemy.kill();
  }
  
  rndWeapon() {
    this.player.setWeapon(randomize(this));
  }
    
  isOnCamera(thing) {
    if (thing.body.x < this.camera.x-200 || 
        thing.body.x > this.camera.x+this.camera.width+200) {
      return false;   
    }
    return true;
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
