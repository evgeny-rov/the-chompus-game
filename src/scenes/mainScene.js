import Phaser from 'phaser';

import spriteImporter from '../utils/spriteImporter';
import posCalc from '../utils/percentageCalc';
import shapeCreatorST from '../utils/shapeCreatorST';

import ObstacleHandler from '../ObstacleHandler';
import Player from '../player';
import BonusHandler from '../BonusHandler';

import stage1 from '../stages/stage1';
import stage2 from '../stages/stage2';
import stageMax from '../stages/stageMax';

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
    // setup
    this.speed = 1;
    this.score = 0;
    this.progress = 0;
    this.timeline = new Phaser.Time.Clock(this);
    this.timeline.timeScale = 0.1;
    this.timeline.start()

    const { width, height } = this.game.config;
    const centerX = posCalc(50, width);
    const prlxBGY = posCalc(35, height);

    this.spawnPoint = { x: width + 200, y: Math.floor(height / 1.2 - 50) };
    this.playerSpawn = { x: posCalc(20, width), y: Math.floor(height / 1.2 - 50) };
    this.input.enabled = true;

    // backgrounds
    this.bg4 = this.add.tileSprite(centerX, prlxBGY, 480, 272, 'fourth').setDisplaySize(width, height);
    this.bg3 = this.add.tileSprite(centerX, prlxBGY, 592, 272, 'third').setDisplaySize(width, height);
    this.bg2 = this.add.tileSprite(centerX, prlxBGY, 592, 272, 'second').setDisplaySize(width, height);
    this.bg1 = this.add.tileSprite(centerX, prlxBGY, 700, 272, 'first').setDisplaySize(width, height);
    this.groundBg = this.add.tileSprite(centerX, posCalc(90, height), 1024, 288, 'newground').setScale(1, 0.5);

    // static bodies
    this.ground = shapeCreatorST(this, centerX, height / 1.2, width + 3000, 10, null, 0);
    this.scoreCheck = shapeCreatorST(this, this.playerSpawn.x - 70, height / 2, 10, height, null, 0);
    this.catcher = shapeCreatorST(this, -200, height / 2, 10, height, null, 0);
    this.stompCatcher = shapeCreatorST(this, centerX, posCalc(100, height), width + 3000, 10, null, 0);

    // controlls

    // text content
    this.progressText = this.add.text(posCalc(3, width), posCalc(7, height), `DevProgress: ${this.progress}`);

    this.scoreText = this.add.text(centerX, posCalc(10, height), this.score, textStyle).setOrigin(0.5, 0).setAlpha(0.9);
    this.highscoreText = this.add.text(centerX, posCalc(1, height), this.highscore, { fontSize: '24px', color: '#ff9ba2' }).setOrigin(0.5, 0).setAlpha(0.9);

    // experimentation zone
    /*
    this.immersive = this.add.rectangle(posCalc(95, width), posCalc(5, height), 35, 35, 0xff0000)
      .setInteractive().on('pointerup', () => {
        toggleFullScreen();
      });
      */
    
    // elements
    this.obstacles = new ObstacleHandler(this);
    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y);
    this.sushi = new BonusHandler(this);
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
    // const stage = this.progress >= settings.maxStage ? 'max' : Math.ceil(this.progress / settings.stageTick);
    stages[2](this);

    this.progress += 0.05;
    this.progressText.setText(`DevProgress: ${Math.floor(this.progress)}`);

    this.bg3.tilePositionX += 0.3;
    this.bg2.tilePositionX += 0.5;
    this.bg1.tilePositionX += 0.8;

    this.obstacles.update();
    this.player.update();
    this.sushi.update();
  }
}
