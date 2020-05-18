export default class Player {
  constructor(scene) {
    this.ctx = scene;
    this.camera = scene.cameras.main;
    this.input = scene.input;
    this.jumpSnd = scene.sound.add('player-jump', { volume: 0.5 });
    this.attackSnd = scene.sound.add('player-attack', { volume: 0.3 });

    this.xPos = scene.game.config.width / 5;

    this.obstacleHandler = scene.obstacles;
    this.obstacles = scene.obstacles.getObstacles();

    this.availableBonus = false;
    this.activatedBonus = false;

    const { anims } = scene;
    anims.create({
      key: 'default',
      frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 14,
      repeat: -1,
    });

    anims.create({
      key: 'special',
      frames: anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 14,
      repeat: -1,
    });

    this.sprite = scene.physics.add
      .sprite(this.xPos, -50, 'player', 0)
      .setScale(0.5);
    this.sprite.body.setAccelerationY(1600);
    this.sprite.body.setSize(105, 75);
    this.sprite.body.setOffset(50, 40);

    this.groundCollider = scene.physics.add.collider(scene.ground, this.sprite);

    this.obstacleCollider = scene.physics.add.overlap(this.sprite, this.obstacles, (p, o) => {
      if (o.state !== 'special') {
        o.disableBody();
        return scene.gameOver();
      }
      this.ctx.negativeSnd.play();
      this.ctx.setScore(1, false);
      this.obstacleHandler.cycle(o);
      return this.ctx.notSecretStage.try() && scene.events.emit('secret');
    });

    this.input.keyboard.on('keydown-SPACE', () => this.activateBonus());
    this.keys = this.input.keyboard.addKeys({
      up: 'up',
      w: 'W',
    });

    scene.events.on('secret', () => this.setInvincible());
  }

  setInvincible() {
    this.obstacleCollider.active = false;
  }

  unsetInvincible() {
    this.obstacleCollider.active = true;
  }

  setBonus() {
    this.availableBonus = true;
    this.sprite.setFrame(6);
  }

  unsetBonus() {
    this.availableBonus = false;
    this.activatedBonus = false;
  }

  jump() {
    const { jumpSnd, sprite, availableBonus } = this;
    const onGround = sprite.body.touching.down;
    const targetFrame = !availableBonus ? 2 : 6;
    if (onGround) {
      jumpSnd.play();
      sprite.setVelocityY(-1400);
      sprite.anims.stop();
      sprite.setFrame(targetFrame);
    }
  }

  attack() {
    const { obstacles } = this.ctx;
    this.attackSnd.play();
    this.unsetBonus();
    this.camera.shake(150, 0.03, true);
    obstacles.kill();
    this.ctx.incProgress();
  }

  activateBonus() {
    const { ctx, availableBonus, sprite } = this;
    if (availableBonus) {
      this.setInvincible();
      const onGround = sprite.body.touching.down;
      const velocity = onGround ? -700 : 500;
      sprite.body.setVelocityY(velocity);
      this.availableBonus = false;
      ctx.time.delayedCall(150, () => {
        this.activatedBonus = true;
      }, null, this);
    }
  }

  reset() {
    this.sprite.setPosition(this.xPos, -50);
    this.unsetBonus();
    this.unsetInvincible();
  }

  kill() {
    this.sprite.anims.pause();
    this.sprite.setTexture('dead');
    this.sprite.setVelocityY(-1000);
  }

  update() {
    const { ctx, input, keys, sprite, availableBonus, activatedBonus } = this;
    const onGround = sprite.body.touching.down;
    const pointer = input.activePointer;
    const pointerActive = pointer.isDown && pointer.y > 100;
    const pointerOnJump = pointerActive && pointer.x > ctx.game.config.width / 2;
    const pointerOnBonus = pointerActive && pointer.x < ctx.game.config.width / 2;

    if (pointerOnBonus) this.activateBonus();

    if (pointerOnJump || keys.w.isDown || keys.up.isDown) this.jump();

    if (activatedBonus && onGround) this.attack();

    if (sprite.body.velocity.y === 0 && onGround) {
      const targetAnim = availableBonus ? 'special' : 'default';
      sprite.anims.play(targetAnim, true);
    }
  }
}
