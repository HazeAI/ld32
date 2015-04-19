'use strict';

const { Phaser } = global;

class Player {
  constructor(x, y, sprite_name, game) {
    this.game = game;
    
    this.vis = this.game.add.sprite(x, y, sprite_name);
    this.vis.anchor.setTo(0.5, 0.5);
    this.vis.scale.x = 0.25;
    this.vis.scale.y = 0.25;
    
    this.weapon = null;

    this.speed = 10;

    this.should_fire = false;
  }

  // TODO: properties?
  getPosX() {
    return this.vis.position.x;
  }

  // TODO: properties?
  getPosY() {
    return this.vis.position.y;
  }

  warpTo(x, y) {
    this.vis.position.x = x;
    this.vis.position.y = y;
  }

  // TODO: frame delta!
  moveX(factor) {
    this.vis.position.x += (factor * this.speed);
  }

  // TODO: frame delta!
  moveY(factor) {
    this.vis.position.y += (factor * this.speed);
  }

  fire() {
    this.should_fire = true;
  }

  ceaseFire() {
    this.should_fire = false;
  }

  setWeapon(weapon) {
    this.weapon = weapon;
  }

  update() {
    console.debug('player update');
    // TODO: rather than move instantly, have the move functions update state that
    //       then get applied here when the update function is called from the game.

    // FIXME: Probably want to update the movement of the player to use fixedToCamera
    // http://phaser.io/docs/2.3.0/Phaser.Sprite.html#fixedToCamera
    this.vis.position.x = this.game.input.position.x + this.vis.deltaX;
    this.vis.position.y = this.game.input.position.y;

    if (this.should_fire) {
      this.weapon.fire(this.vis);
    }
  }
}

module.exports = Player;
