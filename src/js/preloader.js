'use strict';

/*
TODO: Replace preloader, player, and minecraftia assets
*/

class Preloader {

  constructor() {
    this.asset = null;
    this.ready = false;
  }
  preload() {
    this.asset = this.add.sprite(
      this.game.width * 0.5 - 110,
      this.game.height * 0.5 - 10,
      'preloader');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    this.loadResources();
  }
  loadResources() {
    this.load.image('player', 'assets/player.png');
    this.load.image('melee_enemy', 'assets/melee_enemy.png');
      
    this.load.image('basic_bullet', 'assets/basic_bullet.png');
    this.load.image('basic_bullet_2', 'assets/basic_bullet_2.png');
    this.load.image('house', 'assets/house.png');
    this.load.image('monster', 'assets/avery_monster.png');
    this.load.image('super', 'assets/super.png');
    this.load.image('eyeball', 'assets/eyeball.png');
    this.load.image('shroom', 'assets/shroom.png');
    this.load.image('glasses', 'assets/silly_glasses.png');
    this.load.image('pie', 'assets/pie.png');
    this.load.image('fireball', 'assets/fire_ball.png');
    this.load.image('balloon', 'assets/balloon.png');
      
    this.load.bitmapFont(
      'minecraftia',
      'assets/minecraftia.png',
      'assets/minecraftia.xml');

    this.load.tilemap('garbage',
      'assets/tiles/garbage.json',
      null,
      Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/tiles/img/tiles.png');
  }
  create() {
    this.asset.cropEnabled = false;
  }
  update() {
    if (this.ready) {
      this.game.state.start('menu');
    }
  }
  onLoadComplete() {
    this.ready = true;
  }
}

module.exports = Preloader;
