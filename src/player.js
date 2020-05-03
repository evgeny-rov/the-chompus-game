export default class Player {
  constructor(scene, x, y) {
    this.context = scene;
    this.camera = scene.cameras.main;
    this.input = scene.input;
    this.obstacles = scene.obstacles.getObstacles();

    this.pressDuration = 0;

    this.availableBonus = false;
    this.activatedBonus = false;

    this.jumpSFX = scene.sound.add('jumpSound', { volume: 0.7 });
    this.stompSFX = scene.sound.add('stompSound', { volume: 0.4 });

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
      .sprite(x, y, 'player', 0)
      .setScale(0.5);
    this.sprite.body.setAccelerationY(1600);
    this.sprite.body.setSize(105, 75);
    this.sprite.body.setOffset(50, 40);
    this.sprite.setMaxVelocity(0, 1400);

    this.groundCollider = scene.physics.add.collider(scene.ground, this.sprite);

    this.obstacleCollider = scene.physics.add.overlap(this.sprite, this.obstacles, () => {
      const { score, highscore } = scene;
      const newHighscore = score > highscore ? score : highscore;
      this.context.setHighscore(newHighscore);
      scene.scene.restart();
    });

    this.input.keyboard.on('keydown-SPACE', () => this.activateBonus());
    this.keys = this.input.keyboard.addKeys({
      up: 'up',
      w: 'W',
    });
  }

  setBonus() {
    this.availableBonus = true;
    this.sprite.setFrame(6);
  }

  setInvincible() {
    this.obstacleCollider.active = false;
  }

  unsetInvincible() {
    this.obstacleCollider.active = true;
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

  stomp() {
    const { obstacles } = this.context;
    this.stompSFX.play();
    this.unsetBonus();
    this.camera.shake(150, 0.03, true);
    obstacles.stomp();
  }

  activateBonus() {
    if (this.availableBonus) {
      const { sprite } = this;
      const onGround = sprite.body.touching.down;
      const velocity = onGround ? -700 : 500;
      this.setInvincible();
      sprite.body.setVelocityY(velocity);
      this.availableBonus = false;
      this.context.time.delayedCall(150, () => {
        this.activatedBonus = true;
      });
    }
  }

  update() {
    const { input, keys, sprite, availableBonus } = this;
    const pointer = input.activePointer;
    const onGround = sprite.body.touching.down;


    if (pointer.isDown && pointer.y > 100) {
      pointer.x > this.context.game.config.width / 2 ? this.jump() : this.activateBonus();
    }

    if (keys.up.isDown || keys.w.isDown) this.jump();

    if (this.activatedBonus && onGround) {
      this.stomp();
    }

    if (sprite.body.velocity.y === 0 && onGround) {
      const targetAnim = availableBonus ? 'special' : 'default';
      sprite.anims.play(targetAnim, true);
    }
  }
}
