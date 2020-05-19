import randNum from './utils/randomNum';
import getRandomFrame from './utils/getRandomFrame';

const texturePrefix = 'obs';

export default class ObstacleHandler {
  constructor(scene) {
    this.ctx = scene;
    this.obstacles = scene.physics.add.group();
    this.preactionSnd = scene.sound.add('obstacle-preaction', { volume: 0.4 });
    this.actionSnd = scene.sound.add('obstacle-action', { volume: 0.3 });

    this.spX = scene.game.config.width + 200;
    this.spY = scene.game.config.height / 1.4;
    this.moving = true;
    this.eventTimer = scene.time.addEvent({ delay: 3000, paused: true, loop: true, callback: this.handleEvent.bind(this) });

    this.groundCollider = scene.physics.add.collider(this.obstacles, scene.ground);

    this.scoreCollider = scene.physics.add.collider(this.obstacles, scene.scoreCheck, (s, obst) => {
      if (obst.state !== 'processed') {
        scene.incProgress();
        obst.setState('processed');
      }
    });

    this.bounds = scene.physics.add.collider(this.obstacles, scene.catcher, (ctch, obst) => {
      this.cycle(obst);
    });

    this.spreader = scene.physics.add.overlap(this.obstacles, this.obstacles, (obst) => {
      const { spX } = this;
      obst.setX(randNum(spX, spX + 650));
    });

    scene.physics.add.collider(this.obstacles, scene.stompCatcher, (ctch, obst) => {
      obst.setState('killed');
      const allKilled = this.obstacles.getChildren().every((o) => o.state === 'killed');
      if (allKilled && this.moving) {
        this.toggleColliders(true);
        scene.player.unsetInvincible();
        this.obstacles.getChildren().forEach((o) => this.cycle(o));
        this.setActive(true);
      }
    });

    scene.events.on('secret', () => {
      this.kill();
      this.moving = false;
    });
    scene.events.on('secretover', () => {
      this.moving = true;
    });
  }

  toggleColliders(active) {
    this.groundCollider.active = active;
    this.scoreCollider.active = active;
    this.bounds.active = active;
  }

  getObstacles() {
    return this.obstacles;
  }

  reset() {
    this.obstacles.clear(true, true);
  }

  setActive(active) {
    this.eventTimer.paused = !active;
  }

  cycle(obst) {
    const { spX, spY } = this;
    const xPos = randNum(spX, spX + 650);
    const target = obst || this.ctx.physics.add.sprite(xPos, spY, 'textures');
    const newSprite = getRandomFrame(texturePrefix, 0, 16);
    const newScale = randNum(50, 80) / 100;
    target.setScale(newScale);
    target.setFrame(newSprite);
    target.setState('default');

    if (!obst) {
      target.body.setSize(90, 55);
      target.body.setOffset(15, 50);
    } else {
      target.setPosition(xPos, spY);
      target.setVelocityY(0);
    }
    return target;
  }

  setObstacles(n) {
    const length = this.obstacles.getLength();
    const amountToAdd = n - length;
    for (let i = amountToAdd; i > 0; i -= 1) {
      this.obstacles.add(this.cycle());
    }
  }

  handleEvent() {
    this.preactionSnd.play();
    this.ctx.time.delayedCall(1000, () => {
      if (!this.eventTimer.paused) {
        this.actionSnd.play();
        this.obstacles.getChildren()
          .forEach((obs) => obs.body.x < this.spX && obs.setVelocityY(-800));
        this.eventTimer.delay = randNum(5000, 8000);
      }
    }, null, this);
  }

  kill() {
    this.obstacles.setVelocityY(-400);
    this.setActive(false);
    this.toggleColliders(false);
  }

  update() {
    const { speed } = this.ctx;
    return this.moving && this.obstacles.incX(-speed);
  }
}
