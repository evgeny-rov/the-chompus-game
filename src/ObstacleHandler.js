import randNum from './utils/randomNum';

export default class ObstacleHandler {
  constructor(scene) {
    this.ctx = scene;
    this.obstacles = scene.physics.add.group();
    this.preEventSFX = scene.sound.add('toadQuackSound');
    this.eventSFX = scene.sound.add('toadJumpSound');

    this.spX = scene.game.config.width + 200;
    this.spY = scene.game.config.height / 1.4;

    this.eventTimer = scene.time.addEvent({ delay: 3000, paused: true, loop: true, callback: this.handleEvent.bind(this) });

    this.groundCollider = scene.physics.add.collider(this.obstacles, scene.ground);

    this.scoreCollider = scene.physics.add.collider(this.obstacles, scene.scoreCheck, (s, toad) => {
      if (toad.state === 'active') {
        scene.incScore();
        toad.setState('inactive');
      }
    });

    this.bounds = scene.physics.add.collider(this.obstacles, scene.catcher, (ctch, toad) => {
      this.cycle(toad);
    });

    this.spreader = scene.physics.add.overlap(this.obstacles, this.obstacles, (toad) => {
      const { spX } = this;
      toad.setX(randNum(spX, spX + 550));
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
          scene.incScore();
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

  cycle(toad) {
    const { spX, spY } = this;
    const newSprite = randNum(0, 12);
    const newScale = randNum(50, 80) / 100;
    const xPos = randNum(spX, spX + 550);
    const target = toad || this.ctx.physics.add.sprite(xPos, spY, 'toadsdev');
    target.setScale(newScale);
    target.setFrame(newSprite);
    target.setState('active');

    if (!toad) {
      target.body.setSize(90, 55);
      target.body.setOffset(15, 50);
    } else {
      target.setPosition(xPos, spY);
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
    this.preEventSFX.play();
    this.ctx.time.delayedCall(1000, () => {
      if (!this.eventTimer.paused) {
        this.eventSFX.play();
        this.obstacles.setVelocityY(-800);
        this.eventTimer.delay = randNum(5000, 7000);
      }
    });
  }

  kill() {
    this.obstacles.setVelocityY(-400);
    this.eventTimer.paused = true;
    this.groundCollider.active = false;
    this.scoreCollider.active = false;
    this.bounds.active = false;
  }
}
