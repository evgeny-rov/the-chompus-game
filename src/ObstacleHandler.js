import randNum from './utils/randomNum';

export default class ObstacleHandler {
  constructor(scene) {
    this.context = scene;
    this.toadQuackSFX = scene.sound.add('toadQuackSound');
    this.toadjumpSFX = scene.sound.add('toadJumpSound');
    this.spawnPoint = scene.spawnPoint;
    this.obstacles = scene.physics.add.group();
    this.jumping = false;
    this.timer = null;

    this.groundCollider = scene.physics.add.collider(this.obstacles, scene.ground);

    this.scoreCollider = scene.physics.add.overlap(this.obstacles, scene.scoreCheck, (s, toad) => {
      if (toad.state === 'active') {
        scene.incScore();
        toad.setState('inactive');
      }
    });

    this.bounds = scene.physics.add.overlap(this.obstacles, scene.catcher, (ctch, toad) => {
      this.toadUpdate(toad);
    });

    this.spreader = scene.physics.add.overlap(this.obstacles, this.obstacles, (toad) => {
      const { x } = this.spawnPoint;
      toad.setX(randNum(x, x + 550));
    });

    scene.physics.add.overlap(this.obstacles, scene.stompCatcher, (ctch, toad) => {
      scene.incScore();
      this.toadUpdate(toad);
      scene.player.unsetInvincible();
      this.groundCollider.active = true;
      this.scoreCollider.active = true;
      this.bounds.active = true;
    });
  }

  getObstacles() {
    return this.obstacles;
  }

  toadUpdate(toad) {
    const { x, y } = this.spawnPoint;
    const newSprite = randNum(0, 12);
    const newScale = randNum(50, 80) / 100;
    const xPos = randNum(x, x + 550);
    const target = toad || this.context.physics.add.sprite(xPos, y, 'toadsdev');
    target.setScale(newScale);
    target.setFrame(newSprite);
    target.setState('active');

    if (!toad) {
      target.body.setSize(90, 55);
      target.body.setOffset(15, 50);
    } else {
      target.body.reset(xPos, y);
    }
    return target;
  }

  incObstacles(n) {
    const length = this.obstacles.getLength();
    const amountToAdd = n - length;
    for (let i = amountToAdd; i > 0; i -= 1) {
      this.obstacles.add(this.toadUpdate());
    }
  }

  setJumping(toJump) {
    const { jumping } = this;
    this.jumping = toJump;
    if (toJump && !jumping) this.handleJumping();
  }

  stomp() {
    this.obstacles.setVelocityY(-400);
    this.groundCollider.active = false;
    this.scoreCollider.active = false;
    this.bounds.active = false;
    if (this.timer) this.timer.remove();
  }

  randomJump() {
    const firstChild = this.obstacles.getFirst(true);
    const onGround = firstChild.body.touching.down;
    if (onGround) {
      this.toadQuackSFX.play();
      this.timer = this.context.time.delayedCall(1000, () => {
        this.toadjumpSFX.play();
        this.obstacles.setVelocityY(-750);
        this.timer = null;
      });
    }
  }

  handleJumping() {
    if (!this.jumping) {
      return;
    }
    this.context.time.delayedCall(randNum(3000, 6000), () => {
      this.randomJump();
      this.handleJumping();
    });
  }
}
