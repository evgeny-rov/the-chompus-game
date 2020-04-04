import Phaser from "Phaser";
import mainScene from "./scenes/mainScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  //pixelArt: true,
  scene: mainScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1500 },
      //debug: true,
    }
  }
};

const game = new Phaser.Game(config);