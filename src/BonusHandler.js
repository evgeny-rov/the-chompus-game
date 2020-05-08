import randNum from './utils/randomNum';

export default class BonusHandler {
  constructor(scene) {
    this.ctx = scene;
    this.soundFX = scene.sound.add('getBonusSound', { volume: 0.4 });

    this.spX = scene.game.config.width + 200;
    this.spLoY = scene.game.config.height / 1.8;
    this.spHiY = scene.game.config.height / 6.7;

    this.player = scene.player;
    this.obstacles = scene.obstacles.getObstacles();

    this.interactive = false;
    this.loSpwnProb = 5000;
    this.hiSpwnProb = 11000;

    this.sprite = scene.physics.add
      .sprite(this.spX, randNum(this.spLoY, this.spHiY), 'sushi')
      .setDisplaySize(50, 40);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setCircle(140, 0, 0);
    this.sprite.setState('idle');

    scene.physics.add.overlap(this.sprite, scene.catcher, () => this.reset());

    scene.physics.add.overlap(this.sprite, this.player.sprite, () => {
      this.soundFX.play();
      this.reset();
      this.player.setBonus();
    });

    scene.physics.add.overlap(this.sprite, this.obstacles, () => {
      this.reset();
    });
  }

  reset() {
    const { sprite, spX, spLoY, spHiY } = this;
    sprite.setState('idle');
    sprite.setPosition(spX, randNum(spLoY, spHiY));
  }

  handleSpawn() {
    const { ctx, sprite, loSpwnProb, hiSpwnProb } = this;
    sprite.setState('pending');
    const nextSpawnTime = randNum(loSpwnProb, hiSpwnProb);
    ctx.time.delayedCall(nextSpawnTime, () => sprite.setState('active'));
  }

  setInteractive(interact) {
    this.interactive = interact;
  }

  update() {
    const { interactive, sprite } = this;
    if (interactive && sprite.state === 'idle') this.handleSpawn();
    if (interactive && sprite.state === 'active') sprite.x -= this.ctx.speed;
  }
}
