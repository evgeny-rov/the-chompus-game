import Phaser from 'phaser';

import spriteImporter from '../utils/spriteImporter';
import ObstacleHandler from '../ObstacleHandler';
import Player from '../player';
import posCalc from '../utils/percentageCalc';
import BonusHandler from '../BonusHandler';

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
  }

  preload() {
    spriteImporter(this);
  }

  create() {
    this.speed = 1;
    this.score = 0;
    this.progress = 0;

    const { width, height } = this.game.config;
    const centerX = posCalc(50, width);
    const prlxBGY = posCalc(35, height);

    this.spawnPoint = { x: width + 200, y: Math.floor(height / 1.2 - 50) };
    this.playerSpawn = { x: posCalc(20, width), y: Math.floor(height / 1.2 - 50) };

    this.bg4 = this.add.tileSprite(centerX, prlxBGY, 480, 272, 'fourth').setDisplaySize(width, height);
    this.bg3 = this.add.tileSprite(centerX, prlxBGY, 592, 272, 'third').setDisplaySize(width, height);
    this.bg2 = this.add.tileSprite(centerX, prlxBGY, 592, 272, 'second').setDisplaySize(width, height);
    this.bg1 = this.add.tileSprite(centerX, prlxBGY, 700, 272, 'first').setDisplaySize(width, height);

    this.groundBg = this.add.tileSprite(centerX, posCalc(90, height), 1024, 288, 'newground').setScale(1, 0.5);

    this.ground = this.add.rectangle(centerX, height / 1.2, width + 3000, 10).setAlpha(0);
    this.physics.add.existing(this.ground, true);

    this.scoreCheck = this.add.rectangle(this.playerSpawn.x - 70, height / 2, 10, height)
      .setAlpha(0);
    this.physics.add.existing(this.scoreCheck, true);

    this.catcher = this.add.rectangle(-200, height / 2, 10, height).setAlpha(0);
    this.physics.add.existing(this.catcher, true);

    this.keys = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;

    // experimentation zone
    this.obstacles = new ObstacleHandler(this);
    this.obstacleCollider = this.physics.add.collider(this.ground, this.obstacles.getObstacles());
    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, this.keys, this.pointer);
    this.physics.add.collider(this.ground, this.player.sprite);

    this.progressText = this.add.text(posCalc(3, width), posCalc(7, height), `DevProgress: ${this.progress}`);

    this.scoreText = this.add.text(centerX, posCalc(10, height), this.score, textStyle)
      .setOrigin(0.5, 0)
      .setAlpha(0.9);

    this.highscoreText = this.add.text(centerX, posCalc(1, height), this.highscore, { fontSize: '24px', color: '#ff9ba2' })
      .setOrigin(0.5, 0)
      .setAlpha(0.9);


    this.sushi = new BonusHandler(this);
    this.camera = this.cameras.main;
    // the end of experimentation zone, you are clear mister!
  }

  incScore(num) {
    this.score += num;
  }

  setHighscore(num) {
    this.highscore = num;
  }

  update() {
    const stages = {
      1: (context) => stage1(context),
      2: (context) => stage2(context),
      max: (context) => stageMax(context),
    };
    //const stage = this.progress >= settings.maxStage ? 'max' : Math.ceil(this.progress / settings.stageTick);
    stages[2](this);

    this.progress += 0.05;
    this.progressText.setText(`DevProgress: ${Math.floor(this.progress)}`);

    this.obstacles.update();
    this.player.update();
    this.sushi.update();

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

    if (this.keys.right.isDown) {
      this.camera.shake(300, 0.02);
    }
  }
}
