import randNum from './utils/randomNum';
import getRandomFrame from './utils/getRandomFrame';

const texturePrefix = 'obs';

export default class ObstacleHandler {
  constructor(scene) {
    this.scene = scene;
    this.obstacles = scene.physics.add.group();
    this.preactionSnd = scene.sound.add('obstacle-preaction', { volume: scene.masterVolume * 2.7 });
    this.actionSnd = scene.sound.add('obstacle-action', { volume: scene.masterVolume * 13, detune: 1200 });

    this.spX = scene.game.config.width + 200;
    this.spY = scene.game.config.height / 1.4;
    this.farthestSpX = this.spX + 850;
    this.moving = true;
    this.eventTimer = scene.time.addEvent({
      delay: 3000,
      paused: true,
      loop: true,
      callback: this.handleEvent.bind(this),
    });

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
      const { spX, farthestSpX } = this;
      obst.setX(randNum(spX, farthestSpX));
    });

    scene.physics.add.collider(this.obstacles, scene.stompCatcher, (ctch, obst) => {
      const { obstacles } = this;
      obst.setState('killed');
      const allKilled = obstacles.getChildren().every((o) => o.state === 'killed');
      if (allKilled && this.moving) {
        const { obsActive } = scene.getCurrentStage();
        this.toggleColliders(true);
        scene.player.unsetInvincible();
        obstacles.getChildren().forEach((o) => this.cycle(o));
        if (obsActive) this.setActive(true);
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
    const { spX, spY, farthestSpX } = this;
    const xPos = randNum(spX, farthestSpX);
    const target = obst || this.scene.physics.add.sprite(xPos, spY, 'textures');
    const newFrame = getRandomFrame(texturePrefix, 0, 16);
    const newScale = randNum(60, 73) / 100;
    target.setScale(newScale);
    target.setFrame(newFrame);
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
    const { obstacles } = this;
    const length = obstacles.getLength();
    const amountToAdd = n - length;
    for (let i = amountToAdd; i > 0; i -= 1) {
      obstacles.add(this.cycle());
    }
  }

  handleEvent() {
    const {
      preactionSnd,
      scene,
      actionSnd,
      obstacles,
      spX,
    } = this;

    preactionSnd.play();
    scene.time.delayedCall(1000, () => {
      if (!this.eventTimer.paused) {
        actionSnd.play();
        obstacles.getChildren()
          .forEach((obs) => obs.body.x < spX && obs.setVelocityY(-800));
        this.eventTimer.delay = randNum(5000, 8000);
      }
    }, null, this);
  }

  kill() {
    const { obstacles } = this;
    obstacles.setVelocityY(-400);
    this.setActive(false);
    this.toggleColliders(false);
  }

  update() {
    const { moving, obstacles, scene } = this;
    return moving && obstacles.incX(-scene.speed);
  }
}
