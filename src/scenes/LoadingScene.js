import { Scene } from 'phaser';
import textureAtlas from '../assets/textureatlas.png';
import textureAtlasJSON from '../assets/textureatlas.json';

import fontTexture from '../assets/font.png';
import fontXML from '../assets/font.fnt';

import playerJump from '../assets/audio/player-jump.mp3';
import playerAttack from '../assets/audio/player-attack.mp3';
import obstaclePreaction from '../assets/audio/obstacle-preaction.mp3';
import obstacleAction from '../assets/audio/obstacle-action.mp3';
import bonus from '../assets/audio/bonus.mp3';
import gOver from '../assets/audio/gover.mp3';
import positive from '../assets/audio/positive.mp3';
import negative from '../assets/audio/negative.mp3';
import notSecret from '../assets/audio/notsecret.mp3';

import getRandomFrame from '../utils/getRandomFrame';

export default class MenuScene extends Scene {
  constructor() {
    super({ key: 'loadingScene' });
  }

  preload() {
    this.load.atlas('textures', textureAtlas, textureAtlasJSON);
  }

  create() {
    const { width, height } = this.game.config;
    const texturePrefix = 'obs';
    const spinner = this.physics.add.sprite(width / 2, height / 2, 'textures', getRandomFrame(texturePrefix, 1, 16));
    spinner.setAlpha(0.5);
    spinner.body.setAllowGravity(false);
    spinner.body.setAngularVelocity(300);

    this.load.audio('player-jump', playerJump);
    this.load.audio('player-attack', playerAttack);
    this.load.audio('obstacle-preaction', obstaclePreaction);
    this.load.audio('obstacle-action', obstacleAction);
    this.load.audio('bonus', bonus);
    this.load.audio('g-over', gOver);
    this.load.audio('positive', positive);
    this.load.audio('negative', negative);
    this.load.audio('not-secret', notSecret);

    this.load.bitmapFont('pixfnt', fontTexture, fontXML);
    this.load.on('complete', () => {
      this.scene.launch('menuScene');
      this.scene.launch('gameScene');
      this.scene.launch('gameoverScene');
      this.scene.stop();
    });

    this.load.start();
  }
}
