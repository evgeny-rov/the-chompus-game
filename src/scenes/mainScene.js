import Phaser from 'phaser';

import spriteImporter from '../utils/spriteImporter';
import ObstacleHandler from '../ObstacleHandler';
import Player from '../player';
import posCalc from '../utils/percentageCalc';

import stage1 from '../stages/stage1';
import stage2 from '../stages/stage2';
import stageMax from '../stages/stageMax';

// let highscore = 0;

const settings = {
  maxStage: 800,
  stageTick: 400,
};

const textStyle = {
  fontFamily: 'Lucida Console',
  fontSize: '72px',
  color: '#fff',
  align: 'center',
};

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('mainScene');
    this.highscore = 0;
    this.progress = 401;
    this.speed = 1;
  }

  incScore(num) {
    this.score += num;
  }

  preload() {
    spriteImporter(this);
  }

  create() {
    console.log(this)
    this.score = 0;
    const { width, height } = this.game.config;
    this.spawnPoint = { x: width + 200, y: posCalc(50, height) };
    this.playerSpawn = { x: posCalc(25, width), y: posCalc(50, height) };

    const centerX = posCalc(50, width);
    const prlxBGY = posCalc(27, height);
    const prlxBGSizeY = posCalc(50, height);

    this.bg4 = this.add.tileSprite(centerX, prlxBGY, width, height, 'fourth');
    this.bg3 = this.add.tileSprite(centerX, prlxBGY, width, prlxBGSizeY, 'third').setScale(1.5);
    this.bg2 = this.add.tileSprite(centerX, prlxBGY, width, prlxBGSizeY, 'second').setScale(1.5);
    this.bg1 = this.add.tileSprite(centerX, prlxBGY, width, prlxBGSizeY, 'first').setScale(1.5);

    this.groundBg = this.add.tileSprite(centerX, posCalc(71, height), 1024, 709, 'newground').setScale(1, 0.6);

    this.ground = this.add.rectangle(width, posCalc(65, height), width + 1000, 10).setAlpha(0);
    this.physics.add.existing(this.ground, true);

    this.scoreCheck = this.add.rectangle(this.playerSpawn.x - 100, this.playerSpawn.y, 10, height).setAlpha(0);
    this.physics.add.existing(this.scoreCheck, true);

    this.catcher = this.add.rectangle(50, height / 2, 10, height).setAlpha(0);
    this.physics.add.existing(this.catcher, true);

    this.keys = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;

    // experimentation zone
    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, this.keys, this.pointer);
    this.physics.add.collider(this.ground, this.player.sprite);
    this.obstacles = new ObstacleHandler(this);
    this.physics.add.collider(this.ground, this.obstacles.getObstacles());
    
    this.progressText = this.add.text(posCalc(3, width), posCalc(7, height), `DevProgress: ${this.progress}`);

    this.scoreText = this.add.text(centerX, posCalc(10, height), this.score, textStyle)
      .setOrigin(0.5, 0)
      .setAlpha(0.9);
    // the end of experimentation zone, you are clear mister!
  }

  update() {
    const stages = {
      1: (context) => stage1(context),
      2: (context) => stage2(context),
      max: (context) => stageMax(context),
    };
    const stage = this.progress >= settings.maxStage ? 'max' : Math.ceil(this.progress / settings.stageTick);
    stages[stage](this);

    this.scoreText.setText(`${this.score}`);

    this.obstacles.update();
    this.player.update();

    this.bg3.tilePositionX += 0.3;
    this.bg2.tilePositionX += 0.5;
    this.bg1.tilePositionX += 0.8;

    if (this.keys.down.isDown) {
      this.progress += 10;
      this.scene.restart();
    }

    if (this.keys.up.isDown) {
      this.scene.pause();
    }
  }
}
