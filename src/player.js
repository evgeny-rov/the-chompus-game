export default class Player {
  constructor(scene, x, y, keys, pointer) {
    this.context = scene;
    this.keys = keys;
    this.pointer = pointer;
    this.availableBonus = false;
    this.activatedBonus = false;

    const { anims } = this.context;
    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('chompusdev', { start: 0, end: 3 }),
      frameRate: 15,
      repeat: -1,
    });

    this.sprite = this.context.physics.add
      .sprite(x, y, 'chompusdev', 0)
      .setScale(0.5);
    this.sprite.body.setAcceleration(0, 1200);
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

  stomp() {
    const { obstacles } = this.context;
    this.unsetBonus();
    this.context.camera.shake(150, 0.03, true);
    obstacles.stomp();
  }

  update() {
    const { sprite } = this;
    const onGround = sprite.body.touching.down;

    const keyboardJump = this.keys.space.isDown && onGround;
    const touchJump = this.pointer.isDown
      && this.pointer.x > this.context.game.config.width / 2
      && onGround;

    const keyboardStomp = this.keys.down.isDown;
    const touchStomp = this.pointer.isDown && this.pointer.x < this.context.game.config.width / 2;

    if (this.availableBonus && (keyboardStomp || touchStomp)) {
      const { obstacles } = this.context;
      const velocity = onGround ? -700 : 500;
      obstacles.setInvincible();
      sprite.setVelocityY(velocity);
      this.availableBonus = false;
      this.context.time.delayedCall(200, () => {
        this.activatedBonus = true;
      });
    }

    if (this.activatedBonus && onGround) {
      this.stomp();
    }

    if (keyboardJump || touchJump) {
      sprite.setVelocityY(-1200);
    }

    if (sprite.body.velocity.y === 0 && onGround) {
      sprite.anims.play('player-run', true);
    } else {
      sprite.anims.stop();
      sprite.setFrame(2);
    }
  }
}
