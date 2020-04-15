import randNum from './utils/randomNum';
import posCalc from './utils/percentageCalc';

export default class BonusHandler {
  constructor(scene) {
    this.context = scene;
    this.spX = this.context.spawnPoint.x;
    this.spLowestY = this.context.playerSpawn.y - 70;
    this.spHighestY = posCalc(15, this.context.game.config.height);
    this.player = this.context.player;
    this.lowChance = 0;
    this.highChance = 100;
    this.eventPoint = randNum(10, 20);

    this.sprite = this.context.physics.add
      .sprite(this.spX, this.randomSPY(), 'sushi')
      .setDisplaySize(50, 40);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setCircle(140, 0, 0);

    this.context.physics.add.overlap(this.sprite, this.context.catcher, (sushi, body) => {
      this.setEventPoint();
      sushi.setPosition(this.spX, this.randomSPY());
    });

    this.context.physics.add.overlap(this.sprite, this.player.sprite, (sushi, body) => {
      this.setEventPoint();
      sushi.setPosition(this.spX, this.randomSPY());
      this.player.setBonus();
    });
  }

  randomSPY() {
    return randNum(this.spLowestY, this.spHighestY);
  }

  setEventPoint() {
    const { progress } = this.context;
    this.eventPoint = Math.floor(progress + randNum(this.lowChance, this.highChance));
  }

  update() {
    const { progress, speed } = this.context;
    if (progress > this.eventPoint) {
      this.sprite.x -= speed;
    }
  }
}
