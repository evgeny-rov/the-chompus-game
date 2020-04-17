export default class Player {
  constructor(scene, x, y) {
    this.context = scene;
    this.camera = this.context.cameras.main;
    this.availableBonus = false;
    this.activatedBonus = false;
    this.input = scene.input;

    const { anims } = this.context;
    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('chompusdev', { start: 0, end: 3 }),
      frameRate: 15,
      repeat: -1,
    });

    this.sprite = this.context.physics.add
      .sprite(x, y, 'chompusdev', 0)
      .setScale(0.5)
      .setAcceleration(0, 1200);

    this.groundCollider = this.context.physics.add.collider(this.context.ground, this.sprite);

    this.input.keyboard.on('keydown-SPACE', () => this.activateBonus());
    this.keys = this.input.keyboard.addKeys({
      up: 'up',
      w: 'W',
    });
  }

  getCollider() {
    return this.groundCollider;
  }

  setBonus() {
    this.availableBonus = true;
    this.sprite.setScale(0.7);
    // visual effect or sound to reflect bonus acquisition
  }

  unsetBonus() {
    this.availableBonus = false;
    this.activatedBonus = false;
    this.sprite.setScale(0.5);
  }

  jump() {
    const { sprite } = this;
    const onGround = sprite.body.touching.down;
    if (onGround) {
      sprite.setVelocityY(-1200);
      sprite.anims.stop();
      sprite.setFrame(2);
    }
  }

  stomp() {
    const { obstacles } = this.context;
    this.unsetBonus();
    this.camera.shake(150, 0.03, true);
    obstacles.stomp();
  }

  activateBonus() {
    if (this.availableBonus) {
      const { obstacles } = this.context;
      const { sprite } = this;
      const onGround = sprite.body.touching.down;
      const velocity = onGround ? -700 : 500;
      obstacles.setInvincible();
      sprite.setVelocityY(velocity);
      this.availableBonus = false;
      this.context.time.delayedCall(200, () => {
        this.activatedBonus = true;
      });
    }
  }

  update() {
    const { sprite, input, keys } = this;
    const pointer = input.activePointer;
    const onGround = sprite.body.touching.down;

    if (pointer.isDown && pointer.y > 80) {
      pointer.x > this.context.game.config.width / 2 ? this.jump() : this.activateBonus();
    }

    if (keys.up.isDown || keys.w.isDown) this.jump();

    if (this.activatedBonus && onGround) {
      this.stomp();
    }

    if (sprite.body.velocity.y === 0 && onGround) {
      sprite.anims.play('player-run', true);
    }
  }
}
