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
              bulletSpeed=600, scaleSpeed=0,
              bulletBankScale=1) {

    super(game, game.world, 'Straight Forward', 
          false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;

    for (var i = 0; i < 64*bulletBankScale; i++) {
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

    for (var i = 0; i < (48*numBullets*bulletBankScale); i++) {
      this.add(new Bullet(game, spriteName, spriteScale, scaleSpeed));
    }

  }

  fire(source, angle=0) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x;
    var y = source.y;

    //Convert degrees to radians
    //cos and sin in javascript expect radians
    var increment = (2.0*Math.PI)/this.numBullets;
    console.log(increment);

    for (var i = 0; i < this.numBullets; i++) {
        var thisAngle = increment*i;
        this.getFirstExists(false)
          .fire(x+(this.radius*Math.cos(thisAngle)),
                y+(this.radius*Math.sin(thisAngle)),
                angle, this.bulletSpeed);
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

    for (var i = 0; i < (this.numBullets*64*bulletBankScale); i++) {
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

    for (var i = 0; i < 128*bulletBankScale; i++) {
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

var bulletClasses = [StraightForward,
                     Spread,
                     BackAndForth,
                     Circle];

var spriteNames = ['basic_bullet',
                   'basic_bullet_2'];

var options = [];
//Big slow moving bullets
options.push({'fireRate':20,
              'spriteScale':5,
              'bulletSpeed':300,
              'scaleSpeed':0,
              'bulletBankScale':3});
//Growing bullets
options.push({'fireRate':20,
              'spriteScale':1,
              'bulletSpeed':600,
              'scaleSpeed':3,
              'bulletBankScale':1});
//High rate of fire
options.push({'fireRate':40,
              'spriteScale':3,
              'bulletSpeed':600,
              'scaleSpeed':0,
              'bulletBankScale':3});

function randomize(game) {
 
  var Klass = bulletClasses[game.rnd.between(0, bulletClasses.length-1)];
  var thisSprite = spriteNames[game.rnd.between(0, spriteNames.length-1)];
  var thisOptions = options[game.rnd.between(0, options.length-1)];
    
  return new Klass(game, thisSprite, thisOptions.fireRate,
               thisOptions.spriteScale, thisOptions.bulletSpeed,
               thisOptions.scaleSpeed,
               thisOptions.bulletBankScale);
    
}

module.exports = {StraightForward: StraightForward,
                  Spread: Spread, BackAndForth: BackAndForth,
                  Circle: Circle, randomize: randomize};
