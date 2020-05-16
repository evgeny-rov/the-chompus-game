import Phaser from 'phaser';
import titleScreen from '../assets/titlescreen.png';

import fontTexture from '../assets/font.png';
import fontXML from '../assets/font.fnt';
import getTranslation from '../textContent';

import atlasTextures from '../assets/atlas.png';
import atlasJSON from '../assets/atlas.json';

const text = getTranslation(navigator.language);

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menuScene' });
  }

  preload() {
    this.load.image('titlescreen', titleScreen);
    this.load.bitmapFont('pixfnt', fontTexture, fontXML);
    // this.load.atlas('textures', atlasTextures, atlasJSON);
    this.scene.launch('gameScene');
  }

  setInteractive(interactive) {
    this.mainBtn.setVisible(interactive);
    this.helpBtn.setVisible(interactive);
  }

  fadeIn(duration, gameObject) {
    gameObject.setAlpha(0);
    gameObject.setVisible(true);
    this.tweens.add({
      targets: [gameObject],
      alpha: { from: 0, to: 1 },
      duration,
      onComplete: () => this.setInteractive(true),
    });
  }

  fadeOut(duration, gameObject, cb = null) {
    this.setInteractive(false);
    this.tweens.add({
      targets: [gameObject],
      alpha: { from: 1, to: 0 },
      duration,
      onComplete: () => {
        gameObject.setVisible(false);
        cb && cb();
      },
    });
  }

  swap(duration, gameObject1, gameObject2) {
    this.fadeOut(duration, gameObject1, () => {
      this.fadeIn(duration, gameObject2);
    });
  }

  startGame(gameScene) {
    this.fadeOut(500, this.titleContainer, () => {
      gameScene.startGame();
      this.scene.sleep();
    });
  }

  reset() {
    this.setInteractive(false);
    this.helpContainer.setVisible(false);
    this.titleContainer.setVisible(false);
    this.fadeIn(1000, this.titleContainer);
  }

  create() {
    const { width, height } = this.game.config;
    const gameScene = this.scene.get('gameScene');
    const { desktop } = this.sys.game.device.os;
    const actionTxtByDevice = desktop ? text.help_action_kb : text.help_action_ts;
    const useBonusTxtByDevice = desktop ? text.help_use_bonus_kb : text.help_use_bonus_ts;

    this.mainBtn = this.add.rectangle(width / 2, 200, width, 250, null, 0).setInteractive();
    this.helpBtn = this.add.rectangle(width / 2, 370, width / 4, 50, null, 0).setInteractive();

    const titleBanner = this.add.image(width / 2, 100, 'titlescreen').setScale(0.5);
    const titlePlayTxt = this.add.bitmapText(width / 2, height / 2, 'pixfnt', text.title_play, 24, 1).setOrigin(0.5);
    const titleHelpTxt = this.add.bitmapText(width / 2, 370, 'pixfnt', text.title_help, 16, 1).setOrigin(0.5);

    const helpBG = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);
    const helpGetBonusTxt = this.add.bitmapText(width / 2, 150, 'pixfnt', text.help_bonus, 10, 1).setOrigin(0.5);
    const helpActionTxt = this.add.bitmapText(width - 150, 300, 'pixfnt', actionTxtByDevice, 10, 1).setOrigin(0.5);
    const helpUseBonusTxt = this.add.bitmapText(150, 300, 'pixfnt', useBonusTxtByDevice, 10, 1).setOrigin(0.5);
    const helpFS = this.add.bitmapText(width - 50, 70, 'pixfnt', text.help_fullscreen, 10, 1).setOrigin(0.5);

    const titleElements = [titleBanner, titlePlayTxt, titleHelpTxt];
    const helpElements = [helpBG, helpGetBonusTxt, helpActionTxt, helpUseBonusTxt, helpFS];

    this.titleContainer = this.add.container(null, null, titleElements);
    this.helpContainer = this.add.container(null, null, helpElements).setVisible(false);

    this.mainBtn.on('pointerup', () => {
      const readyToPlay = !this.helpContainer.visible;
      return readyToPlay
        ? this.startGame(gameScene)
        : this.swap(500, this.helpContainer, this.titleContainer);
    });

    this.helpBtn.on('pointerup', () => {
      const ishelpHidden = !this.helpContainer.visible;
      return ishelpHidden
        ? this.swap(500, this.titleContainer, this.helpContainer)
        : this.swap(500, this.helpContainer, this.titleContainer);
    });

    this.events.on('wake', () => this.reset());
    this.reset();
  }
}
