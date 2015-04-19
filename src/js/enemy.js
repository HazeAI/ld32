'use strict';

const {Phaser} = global;

class Enemy {
  constructor(x, y, sprite_name, game) {
    this.game = game;
      
    this.vis = this.game.add.sprite(x, y, sprite_name);
    this.vis.anchor.setTo(0.5, 0.5);
    this.vis.scale.x = 0.25;
    this.vis.scale.y = 0.25;
      
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

class MeleeChaser extends Enemy{
  constructor(x, y, sprite_name, game) {
    super(x, y, sprite_name, game);  
  }
    
  update() {
    var playerX = this.game.player.getPosX();
    var playerY = this.game.player.getPosY();
    var x = this.getPosX();
    var y = this.getPosY();
    var dt = this.game.time.elapsed;
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

module.exports = MeleeChaser;
