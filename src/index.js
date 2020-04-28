import Phaser from 'phaser';
import mainScene from './scenes/mainScene';

const config = {
  type: Phaser.WEBGL,
  width: 1024,
  height: 450,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autocenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 2,
    touch: {
      target: null,
      capture: false,
    },
  },
  // pixelArt: true,
  scene: mainScene,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1700 },
      //debug: true,
    },
  },
};

const game = new Phaser.Game(config);
