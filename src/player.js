export default class Player {
  constructor(scene, x, y, keys) {
    this.context = scene;
    this.keys = keys;

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
  }

  update() {
    const { sprite } = this;
    if (this.keys.space.isDown && sprite.body.touching.down) {
      sprite.setVelocityY(-800);
    }
    if (sprite.body.velocity.y === 0 && sprite.body.touching.down) {
      sprite.anims.play('player-run', true);
    } else {
      sprite.anims.stop();
      sprite.setFrame(2);
    }
  }
}
