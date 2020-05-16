import randNum from './utils/randomNum';

export default class ObstacleHandler {
  constructor(scene) {
    this.ctx = scene;
    this.obstacles = scene.physics.add.group();
    this.preactionSnd = scene.sound.add('obstacle-preaction', { volume: 0.5 });
    this.actionSnd = scene.sound.add('obstacle-action', { volume: 0.5 });

    this.spX = scene.game.config.width + 200;
    this.spY = scene.game.config.height / 1.4;

    this.paused = false;

    this.eventTimer = scene.time.addEvent({ delay: 3000, paused: true, loop: true, callback: this.handleEvent.bind(this) });

    this.groundCollider = scene.physics.add.collider(this.obstacles, scene.ground);

    this.scoreCollider = scene.physics.add.collider(this.obstacles, scene.scoreCheck, (s, toad) => {
      if (toad.state !== 'inactive') {
        scene.incProgress();
        toad.setState('inactive');
      }
    });

    this.bounds = scene.physics.add.collider(this.obstacles, scene.catcher, (ctch, toad) => {
      this.cycle(toad);
    });

    this.spreader = scene.physics.add.overlap(this.obstacles, this.obstacles, (toad) => {
      const { spX } = this;
      toad.setX(randNum(spX, spX + 650));
    });

    scene.physics.add.collider(this.obstacles, scene.stompCatcher, (ctch, toad) => {
      toad.setState('killed');
      const allKilled = this.obstacles.getChildren().every((o) => o.state === 'killed');
      if (allKilled) {
        this.groundCollider.active = true;
        this.scoreCollider.active = true;
        this.bounds.active = true;
        this.obstacles.getChildren().forEach((o) => {
          this.cycle(o);
        });
        this.eventTimer.paused = false;
        scene.player.unsetInvincible();
      }
    });
  }

  getObstacles() {
    return this.obstacles;
  }

  reset() {
    this.obstacles.clear(true, true);
  }

  setPlaying(toPlay) {
    const pause = !toPlay;
    this.eventTimer.paused = pause;
  }

  setPause(pause) {
    this.paused = pause;
  }

  cycle(obs) {
    const { spX, spY } = this;
    const newSprite = randNum(0, 12);
    const newScale = randNum(50, 80) / 100;
    const nextState = newSprite === 0 ? 'special' : 'active';
    const xPos = randNum(spX, spX + 650);
    const target = obs || this.ctx.physics.add.sprite(xPos, spY, 'toadsdev');
    target.setScale(newScale);
    target.setFrame(newSprite);
    target.setState(nextState);

    if (!obs) {
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
        this.eventTimer.delay = randNum(5000, 7000);
      }
    }, null, this);
  }

  kill() {
    this.obstacles.setVelocityY(-400);
    this.eventTimer.paused = true;
    this.groundCollider.active = false;
    this.scoreCollider.active = false;
    this.bounds.active = false;
  }

  update() {
    const { speed } = this.ctx;
    return !this.paused && this.obstacles.incX(-speed);
  }
}
