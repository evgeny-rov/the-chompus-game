import { Scene } from 'phaser';

import gameScenePreloader from '../utils/gameScenePreloader';
import addRectST from '../utils/rectCreatorST';

import ObstacleHandler from '../ObstacleHandler';
import Player from '../player';
import BonusHandler from '../BonusHandler';

const toggleFullscreen = () => (
  !document.fullscreenElement
    ? document.documentElement.requestFullscreen()
    : document.exitFullscreen()
);

const highscoreHandler = (score, highscore) => (score > highscore && localStorage.setItem('highscore', score));

export default class GameScene extends Scene {
  constructor() {
    super({ key: 'gameScene', active: true });
    this.highscore = 0;
    this.stages = {
      3: () => this.stageHandler(8, 2, false, false),
      10: () => this.stageHandler(9, 2),
      20: () => this.stageHandler(10, 3),
      50: () => this.stageHandler(12, 3),
      70: () => this.stageHandler(15, 3),
    };
    this.stagesList = Object.keys(this.stages);
  }

  preload() {
    gameScenePreloader(this);
  }

  init() {
    this.physics.pause();
    this.scene.sendToBack();
  }

  create() {
    // setup
    this.targetSpeed = 7;
    this.speed = 2;
    this.score = 0;
    this.paused = false;

    const { width, height } = this.game.config;
    const midX = width / 2;
    const prlxBGY = height / 2.8;

    this.spawnPoint = { x: width + 200, y: height / 1.4 };
    this.playerSpawn = { x: width / 5, y: height / 1.4 };

    // backgrounds
    this.bg4 = this.add.tileSprite(midX, prlxBGY, 480, 272, 'fourth').setDisplaySize(width, height);
    this.bg3 = this.add.tileSprite(midX, prlxBGY, 592, 272, 'third').setDisplaySize(width, height);
    this.bg2 = this.add.tileSprite(midX, prlxBGY, 592, 272, 'second').setDisplaySize(width, height);
    this.bg1 = this.add.tileSprite(midX, prlxBGY, 700, 272, 'first').setDisplaySize(width, height);
    this.groundBg = this.add.tileSprite(midX, height - height / 10, 1024, 288, 'newground').setScale(1, 0.5);

    // static bodies
    this.ground = addRectST(this, midX, height / 1.2, width + 3000, 1, null, 0);
    this.scoreCheck = addRectST(this, width / 10, height / 2, 1, height, null, 0);
    this.catcher = addRectST(this, -200, height / 2, 1, height, null, 0);
    this.stompCatcher = addRectST(this, midX, height + 200, width + 3000, 1, null, 0);

    // text content
    this.scoreText = this.add.bitmapText(midX, -50, 'pixfnt', this.score, 56, 1)
      .setOrigin(0.5)
      .setAlpha(0.8);

    // elements
    this.obstacles = new ObstacleHandler(this);
    this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y);
    this.bonus = new BonusHandler(this);

    const fsButton = this.add.image(width - 50, 25, 'uifs').setInteractive();
    fsButton.on('pointerup', () => toggleFullscreen());
  }

  incScore() {
    const { stages, stagesList } = this;
    this.score += 1;
    this.scoreText.setText(`${this.score}`);
    const hasStage = stagesList.includes(this.score.toString());
    if (hasStage) stages[this.score](this.score);
  }

  setHighscore(num) {
    this.highscore = num;
  }

  stageHandler(speed, amount, toPlay = true, bonusInteractive = true) {
    this.targetSpeed = speed;
    this.obstacles.setObstacles(amount);
    this.obstacles.setPlaying(toPlay);
    this.bonus.setInteractive(bonusInteractive);
  }

  startGame() {
    this.stageHandler(7, 1, false, false);
    this.paused = false;
    this.physics.resume();
    this.tweens.add({
      targets: this.scoreText,
      y: 100,
      duration: 700,
      ease: 'Bounce',
    });
  }

  gameOver() {
    if (!this.paused) {
      this.paused = true;
      this.obstacles.setPlaying(false);
      this.player.sprite.anims.pause();
      this.scoreText.setY(-50);
      highscoreHandler(this.score, localStorage.getItem('highscore'));

      this.sound.play('goverSound', { volume: 0.2 });
      this.player.sprite.setTexture('dead');
      this.player.sprite.setVelocityY(-1000);

      this.time.delayedCall(200, () => {
        this.physics.pause();
        this.scene.wake('gameoverScene');
      });
    }
  }

  resetGame() {
    this.score = 0;
    this.scoreText.setText(`${this.score}`);
    this.speed = 2;
    this.player.reset();
    this.obstacles.reset();
    this.bonus.reset();
  }

  update() {
    if (this.speed < this.targetSpeed) this.speed += 0.03;

    this.bg3.tilePositionX += 0.3;
    this.bg2.tilePositionX += 0.5;
    this.bg1.tilePositionX += 0.8;
    this.groundBg.tilePositionX += this.speed;

    if (!this.paused) {
      this.obstacles.getObstacles().incX(-this.speed);
      this.player.update();
      this.bonus.update();
    }
  }
}
