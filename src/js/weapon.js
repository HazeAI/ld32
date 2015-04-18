'use strict';

const { Phaser, PIXI } = global;

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
    this.scale.set(this.spriteScale);

    this.game.physics.arcade.velocityFromAngle(
      angle,
      speed,
      this.body.velocity);
      
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

  constructor(game, spriteName, fireRate=100, spriteScale=5,
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

  fire(source, angle=0) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed);

    this.nextFire = this.game.time.time + this.fireRate;

  }

}

class Circle extends Phaser.Group {

  constructor(game, spriteName, fireRate=350, spriteScale=3,
              bulletSpeed=600, scaleSpeed=0, radius=50) {

    super(game, game.world, 'Circle', 
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.radius = radius;

    for (var i = 0; i < 128; i++) {
      this.add(new Bullet(game, spriteName, spriteScale, scaleSpeed));
    }

  }

  fire(source, angle=0) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x;
    var y = source.y;

    this.getFirstExists(false).fire(x+this.radius, y, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x-this.radius, y, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x, y+this.radius, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x, y-this.radius, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x+this.radius, y, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x+this.radius*0.7, y+this.radius*0.7, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x-this.radius*0.7, y-this.radius*0.7, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x-this.radius*0.7, y+this.radius*0.7, angle, this.bulletSpeed);
    this.getFirstExists(false).fire(x+this.radius*0.7, y-this.radius*0.7, angle, this.bulletSpeed);

    this.nextFire = this.game.time.time + this.fireRate;

  }

}
class Spread extends Phaser.Group {
 
  constructor(game, spriteName, fireRate=100, spriteScale=5,
              bulletSpeed=600, scaleSpeed=0, spread=60, numBullets=5) {

    super(game, game.world, 'Spread',
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.spread = spread;
    this.numBullets = numBullets;

    for (var i = 0; i < (this.numBullets*48); i++) {
      this.add(new Bullet(game, spriteName, spriteScale, scaleSpeed));  
    }

  }

  fire(source, angle=0) {

      if (this.game.time.time < this.nextFire) { return; }

      var x = source.x + 10;
      var y = source.y + 10;

      var bulletIncrement = this.spread/this.numBullets;
      var startAngle = angle - this.spread/2 + bulletIncrement/2;

      for (var i = 0; i < this.numBullets; i++) {
        this.getFirstExists(false).fire(x, y, startAngle+(bulletIncrement*i), this.bulletSpeed);

      }

      this.nextFire = this.game.time.time + this.fireRate;

  }

}

class BackAndForth extends Phaser.Group {

  constructor(game, spriteName, fireRate=20, spriteScale=5,
              bulletSpeed=600, scaleSpeed=0) {

    super(game, game.world, 'BackAndForth',
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

    this.patternIndex = 0;

    for (var i = 0; i < 128; i++) {
      this.add(new Bullet(game, spriteName, spriteScale, scaleSpeed));  
    }

  }

  fire(source, angle=0) {
    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0,
                                   this.pattern[this.patternIndex]);

    this.patternIndex++;

    if (this.patternIndex === this.pattern.length) {
      this.patternIndex = 0;   
    }

    this.nextFire = this.game.time.time + this.fireRate;
  }


}

module.exports = {StraightForward: StraightForward,
                  Spread: Spread, BackAndForth: BackAndForth,
                  Circle: Circle};
