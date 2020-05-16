import randNum from './utils/randomNum';

export default class NotSecretStage {
  constructor(scene) {
    this.ctx = scene;

    this.actionSnd = scene.sound.add('not-secret', { volume: 0.2 });

    this.played = false;
    this.minTriggerScore = 40;
    this.maxTriggerScore = 60;

    const { anims } = scene;
    anims.create({
      key: 'kanakodef',
      frames: anims.generateFrameNumbers('kanako', { start: 0, end: 12 }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite = scene.add.sprite(-200, 215).setScale(1.5).setVisible(false);
    this.sprite.anims.play('kanakodef', true);

    this.endStage = scene.tweens.add({
      targets: [this.sprite],
      delay: 2000,
      duration: 3000,
      x: { from: 512, to: 1224 },
      ease: 'Linear',
      paused: true,
      onStart: () => {
        const inc = randNum(0, 1) === 1;
        this.ctx.setScore(10, inc);
        const sound = inc ? 'positive' : 'negative';
        this.ctx.sound.play(sound, { detune: 400 });
      },
      onComplete: () => {
        this.sprite.setVisible(false);
        this.ctx.obstacles.setPause(false);
        this.ctx.player.unsetInvincible();
      },
    });

    this.startStage = scene.tweens.add({
      targets: [this.sprite],
      duration: 3000,
      x: { from: -200, to: 512 },
      ease: 'Linear',
      paused: true,
      onStart: () => {
        this.actionSnd.play();
        this.sprite.setVisible(true);
        this.played = true;
        this.ctx.obstacles.setPause(true);
        this.ctx.obstacles.kill();
        this.ctx.player.setInvincible();
      },
      onComplete: () => this.endStage.play(),
    });
  }

  check(score) {
    const { minTriggerScore, maxTriggerScore, played } = this;
    if (!played && score >= minTriggerScore && score <= maxTriggerScore) this.startStage.play();
  }
}
