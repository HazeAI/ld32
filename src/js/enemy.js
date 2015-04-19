'use strict';

/*
TODO: Add more enemy types
      - With gravity
      - Sine wave
*/

const {Phaser} = global;
const {randomize} = require('weapon');

class Enemy extends Phaser.Sprite {
  constructor(spriteName, game) {
    super(game, 0, 0, spriteName);
      
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = 0.25;
    this.scale.y = 0.25;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
      
    this.weapon = null;
      
    this.speed = 5;
      
    this.should_fire = false;
  }
    
  getPosX() {
    return this.position.x;   
  }
    
  getPosY() {
    return this.position.y;   
  }
    
  warpTo(x, y) {
    this.position.x = x;
    this.position.y = y;
  }
    
  moveX(factor) {
    this.position.x += (factor * this.speed);   
  }
    
  moveY(factor) {
    this.position.y += (factor * this.speed);   
  }
    
  setWeapon(weapon) {
    this.weapon = weapon; 
  }
    
  update() {
    if (this.exists) {
      if (this.game.isOnCamera(this) == false) {
        this.kill();   
      }
    }
  }
}

class Drone extends Enemy{
  update() {
    if (this.exists) {
      super.update();
      this.moveX(-1);
    }
  }
}

class RangedDrone extends Drone{
  constructor(spriteName, game, trackPlayer=false){
    super(spriteName, game);
    this.setWeapon(randomize(game));
    this.trackPlayer = trackPlayer;
  }
    
  update() {
    if (this.exists) {
      super.update();
      if (this.trackPlayer == true){
        var xDiff = this.game.player.getPosX() - this.getPosX();
        var yDiff = this.game.player.getPosY() - this.getPosY(); 
        var angle =  Math.atan2(yDiff, xDiff)*(180 / Math.PI);
        this.weapon.fire(this, angle);         
      }else{
        this.weapon.fire(this, 180);
      }
    }
  }
}

class Chaser extends Enemy{
  update() {
    if (this.exists) {
      super.update();
      var playerX = this.game.player.getPosX();
      var playerY = this.game.player.getPosY();
      var x = this.getPosX();
      var y = this.getPosY();
      if (x > playerX){
        this.moveX(-1*(Math.min(20, x-playerX)/20));
      }else{
        this.moveX(1*(Math.min(20, playerX-x)/20));
      }
      if (y > playerY) {
        this.moveY(-1*(Math.min(20, y-playerY)/20));   
      }else{
        this.moveY(1*(Math.min(20, playerY-y)/20));
      }
    }
  }
}
    
class RangedChaser extends Chaser {
  constructor(spriteName, game, trackPlayer=false) {
    super(spriteName, game);
    this.setWeapon(randomize(game));
    this.trackPlayer = trackPlayer;
  }
    
  update() {
    if (this.exists) {
      super.update();
      if (this.trackPlayer == true) {
        var xDiff = this.game.player.getPosX() - this.getPosX();
        var yDiff = this.game.player.getPosY() - this.getPosY(); 
        var angle =  Math.atan2(yDiff, xDiff)*(180 / Math.PI);
        this.weapon.fire(this, angle);
      }else{
        this.weapon.fire(this, 180);
      }
    }
  }
}

module.exports = {Chaser, RangedChaser,
                  Drone, RangedDrone};
