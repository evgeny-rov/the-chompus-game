export default class Player {
  constructor(scene) {
    this.ctx = scene;
    this.camera = scene.cameras.main;
    this.input = scene.input;
    this.jumpSFX = scene.sound.add('jumpSound', { volume: 0.7 });
    this.stompSFX = scene.sound.add('stompSound', { volume: 0.4 });

    this.xPos = scene.game.config.width / 5;

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
      if (p.state !== 'invincible') scene.gameOver();
    });

    this.input.keyboard.on('keydown-SPACE', () => this.activateBonus());
    this.keys = this.input.keyboard.addKeys({
      up: 'up',
      w: 'W',
    });
  }

  setInvincible() {
    this.sprite.setState('invincible');
  }

  unsetInvincible() {
    this.sprite.setState('idle');
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
    const { jumpSFX, sprite, availableBonus } = this;
    const onGround = sprite.body.touching.down;
    const targetFrame = !availableBonus ? 2 : 6;
    if (onGround) {
      jumpSFX.play();
      sprite.setVelocityY(-1400);
      sprite.anims.stop();
      sprite.setFrame(targetFrame);
    }
  }

  attack() {
    const { obstacles } = this.ctx;
    this.stompSFX.play();
    this.unsetBonus();
    this.camera.shake(150, 0.03, true);
    obstacles.kill();
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
      });
    }
  }

  reset() {
    this.sprite.setPosition(this.xPos, -50);
    this.unsetBonus();
    this.unsetInvincible();
  }

  update() {
    const { ctx, input, keys, sprite, availableBonus, activatedBonus } = this;
    const pointer = input.activePointer;
    const onGround = sprite.body.touching.down;

    if (pointer.isDown && pointer.y > 100) {
      pointer.x > ctx.game.config.width / 2 ? this.jump() : this.activateBonus();
    }

    if (keys.up.isDown || keys.w.isDown) this.jump();

    if (activatedBonus && onGround) this.attack();

    if (sprite.body.velocity.y === 0 && onGround) {
      const targetAnim = availableBonus ? 'special' : 'default';
      sprite.anims.play(targetAnim, true);
    }
  }
}
