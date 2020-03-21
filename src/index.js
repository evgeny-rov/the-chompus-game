import Phaser from "phaser";
import Level1 from "./levels/level1.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  //pixelArt: true,
  scene: Level1,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debut: true,
    }
  }
};

const game = new Phaser.Game(config);