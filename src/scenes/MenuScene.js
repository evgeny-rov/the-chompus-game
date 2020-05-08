import Phaser from 'phaser';
import titleScreen from '../assets/titlescreen.png';
import addRectST from '../utils/rectCreatorST';

import fontTexture from '../assets/font.png';
import fontXML from '../assets/font.fnt';


const fadeOut = (ctx, gameObject, cb) => (
  ctx.tweens.add({
    targets: [gameObject],
    alpha: { from: 1, to: 0 },
    duration: 400,
    onComplete: cb,
  }));

const fadeIn = (ctx, gameObject) => (
  ctx.tweens.add({
    targets: [gameObject],
    alpha: { from: 0, to: 1 },
    duration: 1000,
  }));

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menuScene' });
  }

  preload() {
    this.load.image('titlescreen', titleScreen);
    this.load.bitmapFont('customText', fontTexture, fontXML);
  }

  create() {
    const { width, height } = this.game.config;
    const gameScene = this.scene.get('gameScene');

    const startArea = addRectST(this, width / 2, 200, width, 250, null, 0).setInteractive();
    const controlsArea = addRectST(this, width / 2, 370, width / 4, 50, null, 0).setInteractive();
    const hud = this.add.image(width / 2, height / 2, 'titlescreen').setScale(0.4);
    const titleContainer = this.add.container(null, null, [startArea, controlsArea, hud]).setAlpha(0);

    startArea.on('pointerup', () => fadeOut(this, titleContainer, () => {
      titleContainer.setVisible(false);
      gameScene.startGame();
    }));
    controlsArea.on('pointerup', () => console.log('show controls'));

    fadeIn(this, titleContainer);
    this.events.on('wake', () => {
      titleContainer.setVisible(true);
      titleContainer.setAlpha(0);
      fadeIn(this, titleContainer);
    });

    //const text = this.add.bitmapText(width / 2, height / 2, 'customText', ['hello', 'man'], 32, 1).setOrigin(0.5, 0.5);
  }
}
