export default class Player {
  constructor(scene, x, y, keys, pointer) {
    this.context = scene;
    this.keys = keys;
    this.pointer = pointer;
    this.activeBonus = false;
    this.obstacles = this.context.obstacles;
    console.log(this.obstacles)

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
    this.activeBonus = true;
    // visual effect or sound to reflect bonus acquisition
  }

  unsetBonus() {
    this.activeBonus = false;
  }

  stomp() {
    const { sprite, obstacles } = this;
    console.log('stomp')
    sprite.body.touching.down ? sprite.setVelocityY(-500) : sprite.setVelocityY(700);
    this.context.camera.shake(300, 0.02);
    obstacles.stomp();

    this.unsetBonus();
  }

  update() {
    const { sprite } = this;
    const keyboardJump = this.keys.space.isDown && sprite.body.touching.down;
    const touchJump = this.pointer.isDown
      && this.pointer.x >= this.context.game.config.width / 2
      && sprite.body.touching.down;

    if (this.activeBonus && this.keys.left.isDown) this.stomp();

    if (keyboardJump || touchJump) {
      sprite.setVelocityY(-1200);
    }
    if (sprite.body.velocity.y === 0 && sprite.body.touching.down) {
      sprite.anims.play('player-run', true);
    } else {
      sprite.anims.stop();
      sprite.setFrame(2);
    }
  }
}
