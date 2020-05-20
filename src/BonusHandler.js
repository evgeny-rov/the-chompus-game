import randNum from './utils/randomNum';

const bonusTexture = 'bonus';

export default class BonusHandler {
  constructor(scene) {
    this.scene = scene;
    this.bonusSnd = scene.sound.add('bonus', { volume: 0.3, rate: 2 });

    this.spX = scene.game.config.width + 200;
    this.spLoY = scene.game.config.height / 1.8;
    this.spHiY = scene.game.config.height / 6.7;

    this.player = scene.player;
    this.obstacles = scene.obstacles.getObstacles();

    this.eventTimer = scene.time.addEvent({
      delay: 5000,
      paused: true,
      loop: true,
      callback: this.handleEvent.bind(this),
    });

    this.loSpwnProb = 7000;
    this.hiSpwnProb = 11000;

    this.sprite = scene.physics.add
      .sprite(this.spX, randNum(this.spLoY, this.spHiY), 'textures', bonusTexture)
      .setDisplaySize(55, 45);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setCircle(80, 0, 0);
    this.sprite.setState('idle');

    scene.physics.add.overlap(this.sprite, scene.catcher, () => this.reset(true));

    scene.physics.add.overlap(this.sprite, this.player.sprite, () => {
      this.bonusSnd.play();
      this.reset(true);
      this.player.setBonus();
    });

    scene.physics.add.overlap(this.sprite, this.obstacles, () => {
      if (this.sprite.state === 'active') this.reset(true);
    });
  }

  reset(replay = false) {
    const {
      spX,
      spLoY,
      spHiY,
      sprite,
      loSpwnProb,
      hiSpwnProb,
    } = this;

    sprite.setPosition(spX, randNum(spLoY, spHiY));
    sprite.setState('idle');
    this.eventTimer.delay = randNum(loSpwnProb, hiSpwnProb);
    if (replay) this.eventTimer.paused = false;
  }

  handleEvent() {
    const { sprite } = this;
    if (!this.eventTimer.paused) {
      sprite.setState('active');
      this.eventTimer.paused = true;
    }
  }

  setInteractive(interact) {
    const pause = !interact;
    this.eventTimer.paused = pause;
  }

  update() {
    const { sprite, scene } = this;
    if (sprite.state === 'active') sprite.x -= scene.speed;
  }
}
