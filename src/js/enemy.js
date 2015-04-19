'use strict';

/*
TODO: Add more enemy types
      - With gravity
      - Sine wave
*/

const {Phaser} = global;
const {randomize} = require('weapon');

class Enemy {
  constructor(x, y, sprite_name, game) {
    this.game = game;
      
    this.vis = this.game.add.sprite(x, y, sprite_name);
    this.vis.anchor.setTo(0.5, 0.5);
    this.vis.scale.x = 0.25;
    this.vis.scale.y = 0.25;
    this.game.physics.enable(this.vis, Phaser.Physics.ARCADE);
      
    this.weapon = null;
      
    this.speed = 5;
      
    this.should_fire = false;
  }
    
  getPosX() {
    return this.vis.position.x;   
  }
    
  getPosY() {
    return this.vis.position.y;   
  }
    
  warpTo(x, y) {
    this.vis.position.x = x;
    this.vis.position.y = y;
  }
    
  moveX(factor) {
    this.vis.position.x += (factor * this.speed);   
  }
    
  moveY(factor) {
    this.vis.position.y += (factor * this.speed);   
  }
    
  setWeapon(weapon) {
    this.weapon = weapon; 
  }
}

class Drone extends Enemy{
  update() {
    this.moveX(-1);   
  }
}

class RangedDrone extends Drone{
  constructor(x, y, sprite_name, game, trackPlayer=false){
    super(x, y, sprite_name, game);
    this.setWeapon(randomize(game));
    this.trackPlayer = trackPlayer;
  }
    
  update() {
    super.update();
    if (this.trackPlayer == true){
      var xDiff = this.game.player.getPosX() - this.getPosX();
      var yDiff = this.game.player.getPosY() - this.getPosY(); 
      var angle =  Math.atan2(yDiff, xDiff)*(180 / Math.PI);
      this.weapon.fire(this.vis, angle);         
    }else{
      this.weapon.fire(this.vis, 180);
    }
  }
}

class Chaser extends Enemy{
  update() {
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
    
class RangedChaser extends Chaser {
  constructor(x, y, sprite_name, game, trackPlayer=false) {
    super(x, y, sprite_name, game);
    this.setWeapon(randomize(game));
    this.trackPlayer = trackPlayer;
  }
    
  update() {
    super.update();
    if (this.trackPlayer == true) {
      var xDiff = this.game.player.getPosX() - this.getPosX();
      var yDiff = this.game.player.getPosY() - this.getPosY(); 
      var angle =  Math.atan2(yDiff, xDiff)*(180 / Math.PI);
      this.weapon.fire(this.vis, angle);
    }else{
      this.weapon.fire(this.vis, 180);
    }
  }
}

module.exports = {Chaser, RangedChaser,
                  Drone, RangedDrone};
