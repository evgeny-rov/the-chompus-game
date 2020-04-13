import Phaser from 'phaser';
import mainScene from './scenes/mainScene';

//const portable = /Mobi|Android/i.test(navigator.userAgent);
//const scaleMode = portable ? 'RESIZE' : 'NONE';

const config = {
  type: Phaser.CANVAS,
  width: 1024,
  height: 576,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autocenter: Phaser.Scale.CENTER_BOTH,
  },
  // pixelArt: true,
  scene: mainScene,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
