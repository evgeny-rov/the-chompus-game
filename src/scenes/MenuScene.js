import { Scene } from 'phaser';

import text from '../translations';
import { getHiscore } from '../utils/highscoreHandler';
import tinyBitmap from '../utils/tinyBitmapText';

const titleScreenTexture = 'titlescreen';
const fntKey = 'pixfnt';
const bonusTexture = 'bonus';
const playerJumpTexture = 'pd02';
const playerSpecTexture = 'ps03';

export default class MenuScene extends Scene {
  constructor() {
    super({ key: 'menuScene', active: false });
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
        return cb && cb();
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
    const hiscore = getHiscore();
    this.setInteractive(false);
    this.helpContainer.setVisible(false);
    this.titleContainer.setVisible(false);
    this.fadeIn(1000, this.titleContainer);
    return hiscore && this.titleHsTxt.setText(`${text.hiscore}${hiscore}`);
  }

  create() {
    const { width, height } = this.game.config;
    const { desktop } = this.sys.game.device.os;
    const midX = width / 2;
    const gameScene = this.scene.get('gameScene');
    const actionTxtByDevice = desktop ? text.help_action_kb : text.help_action_ts;
    const useBonusTxtByDevice = desktop ? text.help_use_bonus_kb : text.help_use_bonus_ts;

    this.mainBtn = this.add.rectangle(midX, 200, width, 250, null, 0).setInteractive();
    this.helpBtn = this.add.rectangle(midX, 370, width / 4, 50, null, 0).setInteractive();

    const titleBanner = this.add.image(midX, 100, 'textures', titleScreenTexture).setScale(0.6);
    const titlePlayTxt = tinyBitmap(this, midX, height / 2, fntKey, text.title_play, 20);
    const titleHelpTxt = tinyBitmap(this, midX, 370, fntKey, text.title_help, 15);
    this.titleHsTxt = tinyBitmap(this, midX, 150, fntKey, null, 12).setAlpha(0.7);

    const helpBG = this.add.rectangle(midX, height / 2, width, height, 0x000000, 0.5);
    const helpGetBonusTxt = tinyBitmap(this, midX, 150, fntKey, text.help_bonus, 10);
    const helpActionTxt = tinyBitmap(this, width - 150, 300, fntKey, actionTxtByDevice, 10);
    const helpUseBonusTxt = tinyBitmap(this, 150, 300, fntKey, useBonusTxtByDevice, 10);
    const helpFS = tinyBitmap(this, width - 50, 70, fntKey, text.help_fullscreen, 10);

    const bonusImg = this.add.image(midX, 100, 'textures', bonusTexture).setScale(0.3);
    const playerJumpImg = this.add.image(width - 150, 250, 'textures', playerJumpTexture).setScale(0.5);
    const playerActionImg = this.add.image(150, 250, 'textures', playerSpecTexture).setScale(0.5);

    const titleElements = [titleBanner, titlePlayTxt, titleHelpTxt, this.titleHsTxt];
    const helpElements = [
      helpBG,
      helpGetBonusTxt,
      helpActionTxt,
      helpUseBonusTxt,
      helpFS,
      bonusImg,
      playerJumpImg,
      playerActionImg,
    ];

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
