import { Scene } from 'phaser';

import text from '../translations';
import { getHiscore } from '../utils/highscoreHandler';
import tinyBitmap from '../utils/tinyBitmapText';

const fontKey = 'pixfnt';

export default class GameoverScene extends Scene {
  constructor() {
    super({ key: 'gameoverScene', active: false });
  }

  init() {
    this.scene.sleep();
  }

  wake() {
    this.cardContainer.setVisible(true);
    this.tweens.add({
      targets: [this.cardContainer],
      y: 0,
      duration: 1000,
      ease: 'Bounce',
      onComplete: () => this.button.setVisible(true),
    });
  }

  sleep(gameScene) {
    this.button.setVisible(false);
    gameScene.resetGame();
    this.tweens.add({
      targets: [this.cardContainer],
      y: -500,
      duration: 250,
      ease: 'Cubic',
      onComplete: () => {
        this.cardContainer.setVisible(false);
        this.scene.wake('menuScene');
        this.scene.sleep();
      },
    });
  }

  create() {
    const { width, height } = this.game.config;
    const gameScene = this.scene.get('gameScene');
    const midX = width / 2;

    const sceneBG = this.add.rectangle(midX, height / 2, width, height, 0x000000, 0.3);
    const card = this.add.image(midX, height / 2, 'textures', 'gameovercard');
    const cardHeaderTxt = tinyBitmap(this, midX, 130, fontKey, text.score, 20);
    const cardScoreTxt = tinyBitmap(this, midX, 210, fontKey, 0, 40);
    const cardHsTxt = tinyBitmap(this, midX, 280, fontKey, null, 16);
    const buttonTxt = tinyBitmap(this, midX, 330, fontKey, text.g_over_retry, 20).setAlpha(0.8);

    this.button = this.add.rectangle(width / 2, 330, 190, 50, null, 0).setInteractive();

    const cardElements = [
      this.button,
      sceneBG,
      card,
      buttonTxt,
      cardHeaderTxt,
      cardScoreTxt,
      cardHsTxt,
    ];

    this.cardContainer = this.add.container(0, -500, cardElements).setVisible(false);

    this.button.on('pointerup', () => this.sleep(gameScene));

    this.events.on('wake', () => {
      const newHighscore = getHiscore() || 0;
      cardScoreTxt.setText(gameScene.score);
      cardHsTxt.setText(`${text.hiscore}${newHighscore}`);
      this.wake();
    });

    this.scene.sleep();
  }
}
