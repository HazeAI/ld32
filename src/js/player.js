'use strict';

const { Phaser } = global;

class Player extends Phaser.Group {
  constructor(x, y, sprite_name, game) {
    super(game);
    
    this.game = game;
    
    this.vis = this.game.add.sprite(x, y, sprite_name);
    this.vis.anchor.setTo(0.5, 0.5);
    this.vis.scale.x = 0.25;
    this.vis.scale.y = 0.25;
    this.game.physics.arcade.enable(this.vis);
    this.vis.body.collideWorldBounds = true;

    this.add(this.vis);
      
    this.score = 0;
    this.lives = 3;
    
    this.weapon = null;

    this.movement_direction = new Phaser.Point();
    this.movement_direction.x = 0.0;
    this.movement_direction.y = 0.0;
    this.movement_speed = 5.0;

    this.setupKeyboard();
    this.setupGamepad();

    this.game.root.add(this);
  }

  getPosition() {
    return this.vis.position;
  }

  warpTo(x, y) {
    this.vis.position.x = x;
    this.vis.position.y = y;
  }

  fire() {
    if (this.weapon) {
      this.weapon.fire(this.vis);
    }
  }

  bomb() {
    // maybe
  }

  setWeapon(weapon) {
    if (this.weapon) {
      this.remove(this.weapon);
    }
    this.weapon = weapon;
    this.add(weapon);
  }

  update() {
    const dpad_up = 12;
    const dpad_down = 13;
    const dpad_left = 14;
    const dpad_right = 15;
    const dpad_fire = 0;
    const dpad_pause = 9;
    
    // vertical motion
    let vertical_movement = this.pad.axis(1);
    if(this.up_key.isDown || this.pad.isDown(dpad_up)) {
      vertical_movement += -1.0;
    }
    if (this.down_key.isDown || this.pad.isDown(dpad_down)) {
      vertical_movement +=  1.0;
    }

    // horizontal motion
    let horizontal_movement = this.pad.axis(0);
    if (this.left_key.isDown || this.pad.isDown(dpad_left)) {
      horizontal_movement += -1.0;
    }
    if (this.right_key.isDown || this.pad.isDown(dpad_right)) {
      horizontal_movement +=  1.0;
    }

    // update movement vector
    this.movement_direction.x = (horizontal_movement * this.movement_speed);
    this.movement_direction.y = (vertical_movement * this.movement_speed);

    // Update sprite position
    this.vis.position.x = this.vis.position.x + this.movement_direction.x;
    this.vis.position.y = this.vis.position.y + this.movement_direction.y;

    // firearm discharge
    if (this.fire_key.isDown || this.pad.isDown(dpad_fire)) {
      this.fire();
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // Input

  setupGamepad() {
    this.pad = this.game.input.gamepad.pad1;
  }

  setupKeyboard() {
    this.up_key    = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.down_key  = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.left_key  = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.fire_key  = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  // Input
  ////////////////////////////////////////////////////////////////////////
}

module.exports = Player;
