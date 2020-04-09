export default class Player {
  constructor(scene, x, y, keys, pointer) {
    this.context = scene;
    this.keys = keys;
    this.pointer = pointer;

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

  update() {
    const { sprite } = this;
    const keyboardJump = this.keys.space.isDown && sprite.body.touching.down;
    const touchJump = this.pointer.isDown
      && this.pointer.x >= this.context.game.config.width / 2
      && sprite.body.touching.down;

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
