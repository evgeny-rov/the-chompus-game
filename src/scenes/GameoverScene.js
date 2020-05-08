import Phaser from 'phaser';

export default class GameoverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameoverScene', active: true });
  }

  init() {
    this.scene.sleep();
  }

  preload() {
  }

  create() {
    const { width, height } = this.game.config;
    const gameScene = this.scene.get('gameScene');
    const butt = this.add.rectangle(width / 2, height / 2, 150, 150, 0x000000).setInteractive();
    butt.on('pointerup', () => {
      gameScene.resetGame();
      this.scene.wake('menuScene');
      this.scene.sleep();
    });
  }
}
