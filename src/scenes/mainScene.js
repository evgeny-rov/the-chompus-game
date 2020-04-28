import Phaser from 'phaser';

import jumpSound from '../assets/testjump.wav';
import stompSound from '../assets/stomp.wav';
import toadJumpSound from '../assets/toadjumps.wav';
import toadQuackSound from '../assets/frogquack.mp3';
import getBonusSound from '../assets/exit.wav';

import spriteImporter from '../utils/spriteImporter';
import posCalc from '../utils/percentageCalc';
import shapeCreatorST from '../utils/shapeCreatorST';

import ObstacleHandler from '../ObstacleHandler';
import Player from '../player';
import BonusHandler from '../BonusHandler';

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
    this.stages = {
      3: () => this.stageHandler(8, 2, true, true),
      10: () => this.stageHandler(9, 2, true, true),
      20: () => this.stageHandler(10, 3, true, true),
      50: () => this.stageHandler(12, 3, true, true),
      70: () => this.stageHandler(15, 3, true, true),
    };
    this.stagesList = Object.keys(this.stages);
  }

  preload() {
    spriteImporter(this);
    this.load.audio('jumpSound', jumpSound);
    this.load.audio('stompSound', stompSound);
    this.load.audio('toadJumpSound', toadJumpSound);
    this.load.audio('toadQuackSound', toadQuackSound);
    this.load.audio('getBonusSound', getBonusSound);
  }

  create() {
    // setup
    this.targetSpeed = 7;
    this.speed = 1;
    this.score = 0;

    const { width, height } = this.game.config;
    const centerX = posCalc(50, width);
    const prlxBGY = posCalc(35, height);

    this.spawnPoint = { x: width + 200, y: Math.floor(height / 1.2 - 50) };
    this.playerSpawn = { x: posCalc(20, width), y: Math.floor(height / 1.2 - 50) };

    // backgrounds
    this.bg4 = this.add.tileSprite(centerX, prlxBGY, 480, 272, 'fourth').setDisplaySize(width, height);
    this.bg3 = this.add.tileSprite(centerX, prlxBGY, 592, 272, 'third').setDisplaySize(width, height);
    this.bg2 = this.add.tileSprite(centerX, prlxBGY, 592, 272, 'second').setDisplaySize(width, height);
    this.bg1 = this.add.tileSprite(centerX, prlxBGY, 700, 272, 'first').setDisplaySize(width, height);
    this.groundBg = this.add.tileSprite(centerX, posCalc(90, height), 1024, 288, 'newground').setScale(1, 0.5);

    // static bodies
    this.ground = shapeCreatorST(this, centerX, height / 1.2, width + 3000, 10, null, 0);
    this.scoreCheck = shapeCreatorST(this, this.playerSpawn.x - 100, height / 2, 10, height, null, 0);
    this.catcher = shapeCreatorST(this, -200, height / 2, 10, height, null, 0);
    this.stompCatcher = shapeCreatorST(this, centerX, posCalc(130, height), width + 3000, 10, null, 0);
    this.courseEntrance = shapeCreatorST(this, width, height / 2, 10, height, null, 0);

    // text content
    this.scoreText = this.add.text(centerX, posCalc(10, height), this.score, textStyle).setOrigin(0.5, 0).setAlpha(0.9);
    this.highscoreText = this.add.text(centerX, posCalc(1, height), this.highscore, { fontSize: '24px', color: '#ff9ba2' }).setOrigin(0.5, 0).setAlpha(0.9);

    // elements
    this.obstacles = new ObstacleHandler(this);
    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y);
    this.sushi = new BonusHandler(this);
    this.obstacles.incObstacles(1);
  }

  incScore() {
    const { stages, stagesList } = this;
    this.score += 1;
    this.scoreText.setText(`${this.score}`);
    const hasStage = stagesList.includes(this.score.toString());
    if (hasStage) stages[this.score](this.score);
  }

  stageHandler(speed, obsAmnt, canJump, bonus) {
    this.targetSpeed = speed;
    this.obstacles.incObstacles(obsAmnt);
    this.obstacles.setJumping(canJump);
    this.sushi.setSpawning(bonus);
  }

  setHighscore(num) {
    this.highscore = num;
  }

  update() {
    if (this.speed < this.targetSpeed) this.speed += 0.03;

    this.groundBg.tilePositionX += this.speed;
    this.obstacles.getObstacles().incX(-this.speed);

    this.bg3.tilePositionX += 0.3;
    this.bg2.tilePositionX += 0.5;
    this.bg1.tilePositionX += 0.8;

    this.player.update();
    this.sushi.update();
  }
}
