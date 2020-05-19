import { Scene } from 'phaser';

import getTranslation from '../textContent';

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

    const sceneBG = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.3);
    const card = this.add.image(width / 2, height / 2, 'textures', 'gameovercard');
    const cardHeaderTxt = this.add.bitmapText(width / 2, 130, 'pixfnt', 'score', 20, 1).setOrigin(0.5);
    const cardScoreTxt = this.add.bitmapText(width / 2, 210, 'pixfnt', 0, 40, 1).setOrigin(0.5);
    const cardHsTxt = this.add.bitmapText(width / 2, 280, 'pixfnt', 'highscore', 16, 1).setOrigin(0.5);
    const buttonTxt = this.add.bitmapText(width / 2, 330, 'pixfnt', 'заново', 24, 1)
      .setOrigin(0.5)
      .setAlpha(0.8);

    this.button = this.add.rectangle(width / 2, 330, 190, 50, null, 0).setInteractive();

    const cardElements = [this.button, sceneBG, card, buttonTxt, cardHeaderTxt, cardScoreTxt, cardHsTxt];
    this.cardContainer = this.add.container(0, -500, cardElements).setVisible(false);

    this.button.on('pointerup', () => this.sleep(gameScene));

    this.events.on('wake', () => {
      const newHighscore = localStorage.getItem('chompusHiscore') || 0;
      cardScoreTxt.setText(gameScene.score);
      cardHsTxt.setText(`highscore ${newHighscore}`);
      this.wake();
    });
  }
}
