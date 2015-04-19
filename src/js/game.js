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
      
    this.enemies = new Phaser.Group(this.game, this.game.world,
                                    'Enemies', false, true,
                                    Phaser.Physics.ARCADE);
    for (var i = 0 ; i < 3 ; i++) {
      this.enemies.add(new RangedDrone('melee_enemy', this));   
    }

    this.rndWeapon();

    this.setupKeyboard();
    this.setupGamepad();
  }

  update() {
    // FIXME: what is this '9' mean?
    this.camera.x += (this.time.elapsedMS / 9);
    this.player.update();
    this.enemies.update();
    
    this.physics.arcade.overlap(this.player.weapon, this.enemies, this.enemyHit, null, this);
      
    this.enemies.forEach(function(enemy){
      if (enemy.exists == false) {
        enemy.reset(this.game.width+this.game.camera.x,
                   this.game.rnd.between(0, this.game.height));
      }
    }, this);

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
