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
    this.scoreText = null;
    this.lifeText = null;
  }

  create() {
    const x = this.game.width / 2;
    const y = this.game.height / 2;
    
    this.game.world.setBounds(0, 0, this.game.width, this.game.height);

    this.map = this.game.add.tilemap('garbage');
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.backgroundlayer = this.map.createLayer('testLayer');
    this.backgroundlayer.resizeWorld();
      
    this.enemies = new Phaser.Group(this.game, this.game.world,
                                    'Enemies', false, true,
                                    Phaser.Physics.ARCADE);
    for (var i = 0 ; i < 3 ; i++) {
      this.enemies.add(new RangedDrone('melee_enemy', this));   
    }

    this.root = this.add.group();
    this.root.fixedToCamera = true;

    this.player = new Player(x, y, 'player', this);
      
    this.scoreText = this.add.bitmapText(10, 10, 'minecraftia', 'SCORE: '+this.player.score);
    this.scoreText.fixedToCamera = true;
    this.lifeText = this.add.bitmapText(10, 45, 'minecraftia', 'LIVES: '+this.player.lives);
    this.lifeText.fixedToCamera = true;

    //////////////////////////////////////////////////
    
    this.rndWeapon();

    this.setupKeyboard();
    this.setupGamepad();
  }

  update() {
    const dpad_rando_wep = 2;

    // value to adjust the delta by for the background scroll speed.
    const scrollScaleFactor = 0.1;
    this.camera.x += (this.time.elapsedMS * scrollScaleFactor);
    
    this.player.update();
    this.enemies.update();
    this.physics.arcade.overlap(this.player.weapon, this.enemies, this.enemyHit, null, this);
    this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
      
    this.enemies.forEach(function(enemy){
      if (enemy.exists === false) {
        enemy.reset(this.game.width+this.game.camera.x,
                   this.game.rnd.between(0, this.game.height));
      }
    }, this);
      
    if (this.player.lives <= 0) {
      console.log('GAME OVER');   
    }
      
    this.scoreText.text = 'SCORE: '+this.player.score;
    this.lifeText.text = 'LIVES: '+this.player.lives;

    if (this.pad.justPressed(dpad_rando_wep)) {
      this.rndWeapon();
    }
  }
    
  enemyHit(bullet, enemy){
    bullet.kill();
    enemy.kill();
    this.player.score += 1;
  }
    
  playerHit(player, enemy){
    enemy.kill();
    player.kill();
    if (this.player.lives > 0){
        player.reset(this.game.width/2,
                     this.game.height/2);
        this.player.lives = this.player.lives -1;
    }
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
    this.pad = this.input.gamepad.pad1;
  }

  setupKeyboard() {
    let random_weapon = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
    random_weapon.onDown.add(this.rndWeapon, this);
  }

  // Input
  ////////////////////////////////////////////////////////////////////////

}


module.exports = Game;
