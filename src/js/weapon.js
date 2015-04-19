'use strict';

/*
TODO: Refactor - make Weapon base class
TODO: Mechanism to make bullet type a dict rather
      than just sprite name. Includes sprite, tracking 
      option, and new free rotation option.
      Pass all three options through weapon to bullet
TODO: Lob bullet pattern
*/

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
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.tracking = true;
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
      
    if (this.game.isOnCamera(this) == false) {
      this.kill();   
    }
  }

}

class StraightForward extends Phaser.Group {

  constructor(game, spriteName, fireRate=100, spriteScale=5,
              bulletSpeed=600, scaleSpeed=0,
              bulletBankScale=1) {

    super(game, game.world, 'Straight Forward', 
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;

    for (var i = 0; i < 24*bulletBankScale; i++) {
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

  constructor(game, spriteName, fireRate=350, spriteScale=1,
              bulletSpeed=600, scaleSpeed=0, 
              bulletBankScale=1, radius=50.0, numBullets=12.0) {

    super(game, game.world, 'Circle', 
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.radius = radius;
    this.numBullets = numBullets;

    for (var i = 0; i < (24*numBullets*bulletBankScale); i++) {
      this.add(new Bullet(game, spriteName, spriteScale, scaleSpeed));
    }

  }

  fire(source, angle=0) {

    if (this.game.time.time < this.nextFire) { return; }

    const { x, y } = source;

    // Convert degrees to radians
    // cos and sin in javascript expect radians
    var increment = (2.0 * Math.PI) / this.numBullets;

    for (let i = 0; i < this.numBullets; i++) {
      const thisAngle = increment * i;
      try {
        this.getFirstExists(false).fire(x+(this.radius*Math.cos(thisAngle)),
          y + (this.radius*Math.sin(thisAngle)),
          angle, this.bulletSpeed);
      } catch (err) {
        console.error(err.message);
      }
    }

    this.nextFire = this.game.time.time + this.fireRate;

  }

}
class Spread extends Phaser.Group {
 
  constructor(game, spriteName, fireRate=100, spriteScale=5,
              bulletSpeed=600, scaleSpeed=0, 
              bulletBankScale=1, spread=60, numBullets=5) {

    super(game, game.world, 'Spread',
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.spread = spread;
    this.numBullets = numBullets;

    for (var i = 0; i < (this.numBullets*22*bulletBankScale); i++) {
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
        this.getFirstExists(false)
          .fire(x, y, startAngle+(bulletIncrement*i),
                this.bulletSpeed);

      }

      this.nextFire = this.game.time.time + this.fireRate;

  }

}

class BackAndForth extends Phaser.Group {

  constructor(game, spriteName, fireRate=20, spriteScale=5,
              bulletSpeed=600, scaleSpeed=0, 
              bulletBankScale=1) {

    super(game, game.world, 'BackAndForth',
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.pattern = this.pattern.concat(
        Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

    this.patternIndex = 0;

    for (var i = 0; i < 42*bulletBankScale; i++) {
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

const bulletClasses = [StraightForward,
                       Spread,
                       BackAndForth,
                       Circle];

const spriteNames = ['basic_bullet',
                     'basic_bullet_2',
                     'super',
                     'eyeball',
                     'shroom',
                     'glasses',
                     'pie',
                     'fireball',
                     'balloon',
                     'house',
                     'monster'];

//var options = [];
const options = [
  //Big slow moving bullets
  {'fireRate':150,
   'spriteScale':2,
   'bulletSpeed':600,
   'scaleSpeed':0,
   'bulletBankScale':3},
  
  //Growing bullets
  {'fireRate':150,
   'spriteScale':1,
   'bulletSpeed':900,
   'scaleSpeed':10,
   'bulletBankScale':1},
  
  //High rate of fire
  {'fireRate':300,
   'spriteScale':0.5,
   'bulletSpeed':900,
   'scaleSpeed':0,
   'bulletBankScale':3}
];

function randomize(game) {
  let Klass = bulletClasses[game.rnd.between(0, bulletClasses.length-1)];
  let thisSprite = spriteNames[game.rnd.between(0, spriteNames.length-1)];
  let thisOptions = options[game.rnd.between(0, options.length-1)];
  
  return new Klass(game, thisSprite, thisOptions.fireRate,
                   thisOptions.spriteScale, thisOptions.bulletSpeed,
                   thisOptions.scaleSpeed,
                   thisOptions.bulletBankScale);
}

module.exports = {StraightForward: StraightForward,
                  Spread: Spread, BackAndForth: BackAndForth,
                  Circle: Circle, randomize: randomize};
