import randNum from './utils/randomNum';

export default class NotSecretStage {
  constructor(scene) {
    this.ctx = scene;

    this.actionSnd = scene.sound.add('not-secret', { volume: 0.2 });
    this.played = false;
    this.startAllowed = false;

    const { anims } = scene;
    anims.create({
      key: 'kanakodef',
      frames: anims.generateFrameNumbers('kanako', { start: 0, end: 12 }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite = scene.add.sprite(-200, 215).setScale(1.5).setVisible(false);
    this.sprite.anims.play('kanakodef', true);

    scene.events.on('secret', () => !this.played && this.startStage());
  }

  endStage() {
    const { ctx } = this;
    ctx.tweens.add({
      targets: [this.sprite],
      delay: 2000,
      duration: 2000,
      x: { from: 512, to: 1224 },
      ease: 'Linear',
      onStart: () => {
        const toAdd = randNum(0, 1) === 1;
        this.ctx.setScore(10, toAdd);
        const sound = toAdd ? 'positive' : 'negative';
        this.ctx.sound.play(sound, { detune: 400, volume: 0.4 });
      },
      onComplete: () => {
        this.sprite.setVisible(false);
        this.sprite.setX(-200);
        ctx.events.emit('secretover');
      },
    });
  }

  startStage() {
    const { ctx, actionSnd } = this;
    this.played = true;
    this.startAllowed = false;
    actionSnd.play();
    this.sprite.setVisible(true);

    ctx.tweens.add({
      targets: [this.sprite],
      duration: 3000,
      x: { from: -200, to: 512 },
      ease: 'Linear',
      onComplete: () => this.endStage(),
    });
  }

  setActive(active) {
    this.startAllowed = active;
  }

  try() {
    return this.startAllowed;
  }

  reset() {
    this.played = false;
    this.startAllowed = false;
  }
}
