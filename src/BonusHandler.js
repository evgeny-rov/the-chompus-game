import randNum from './utils/randomNum';
import posCalc from './utils/percentageCalc';

export default class BonusHandler {
  constructor(scene) {
    this.context = scene;
    this.bonusSFX = scene.sound.add('getBonusSound', { volume: 0.4 });
    this.spX = scene.spawnPoint.x;
    this.spLowY = scene.playerSpawn.y - 70;
    this.spHighY = posCalc(15, scene.game.config.height);
    this.player = scene.player;
    this.obstacles = scene.obstacles.getObstacles();

    this.allowSpawning = false;
    this.lowChanceSpawn = 5000;
    this.highChanceSpawn = 11000;

    this.sprite = scene.physics.add
      .sprite(this.spX, randNum(this.spLowY, this.spHighY), 'sushi')
      .setDisplaySize(50, 40);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setCircle(140, 0, 0);
    this.sprite.setState('idle');

    scene.physics.add.overlap(this.sprite, scene.catcher, () => this.bonusReset());

    scene.physics.add.overlap(this.sprite, this.player.sprite, () => {
      this.bonusSFX.play();
      this.bonusReset();
      this.player.setBonus();
    });

    scene.physics.add.overlap(this.sprite, this.obstacles, () => {
      this.bonusReset();
    });
  }

  bonusReset() {
    const { sprite, spX, spLowY, spHighY } = this;
    sprite.setState('idle');
    sprite.setPosition(spX, randNum(spLowY, spHighY));
  }

  handleSpawn() {
    const { sprite, lowChanceSpawn, highChanceSpawn } = this;
    sprite.setState('pending');
    const nextSpawnTime = randNum(lowChanceSpawn, highChanceSpawn);
    this.context.time.delayedCall(nextSpawnTime, () => sprite.setState('active'));
  }

  setSpawning(bool) {
    this.allowSpawning = bool;
  }

  update() {
    const { allowSpawning, sprite } = this;
    if (allowSpawning && sprite.state === 'idle') this.handleSpawn();
    if (sprite.state === 'active') sprite.x -= this.context.speed;
  }
}
