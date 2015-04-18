/* global module */

'use strict';

class Bullet extends Phaser.Sprite {
    
  constructor(game, spriteName, spriteScale=1, scaleSpeed=0) {

    super(game, 0, 0, spriteName);
      
    this.spriteScale = spriteScale;
    this.scaleSpeed = scaleSpeed;
            
    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
      
    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

  }

  fire(x, y, angle, speed, gx=0, gy=0) {

    this.reset(x, y);
    console.log(this.spriteScale);
    this.scale.set(this.spriteScale);
      
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
      
    this.angle = angle;
      
    this.body.gravity.set(gx, gy);
      
  }
    
  update() {
      
    if (this.tracking) {
      this.rotation = Math.atan2(this.body.velocity.y,
                                 this.body.velocity.x);
    }
      
    if (this.scaleSpeed > 0) {
      this.scale.x += this.scaleSpeed;
      this.scale.y += this.scaleSpeed;
    }
      
  }

}

class StraightForward extends Phaser.Group {
    
  constructor(game, spriteName, fireRate=100, spriteScale=1,
              bulletSpeed=600, scaleSpeed=0) {
            
    super(game, game.world, 'Straight Forward', 
          false, true, Phaser.Physics.ARCADE);
      
    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
      
    for (var i = 0; i < 64; i++) {
      this.add(new Bullet(game, spriteName, spriteScale, scaleSpeed));
    }
      
  }
    
  fire(source) {
      
    if (this.game.time.time < this.nextFire) { return; }
      
    var x = source.x + 10;
    var y = source.y + 10;
      
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed);
    
    this.nextFire = this.game.time.time + this.fireRate;
      
  }
    
}

module.exports = {StraightForward: StraightForward};
