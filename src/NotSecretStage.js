import randNum from './utils/randomNum';

const texturePrefix = 'kanako0';

export default class NotSecretStage {
  constructor(scene) {
    this.scene = scene;

    this.actionSnd = scene.sound.add('not-secret', { volume: 0.2 });
    this.played = false;
    this.playAllowed = false;

    const { anims } = scene;
    anims.create({
      key: 'secret_def',
      frames: anims.generateFrameNames('textures', {
        prefix: texturePrefix,
        start: 1,
        end: 6,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite = scene.add.sprite(-200, 250).setScale(1.5).setVisible(false);
    this.sprite.anims.play('secret_def', true);
  }

  endStage() {
    const { scene, sprite } = this;
    scene.tweens.add({
      targets: [sprite],
      delay: 2000,
      duration: 2000,
      x: { from: 512, to: 1224 },
      ease: 'Linear',
      onStart: () => {
        const toAdd = randNum(0, 1) === 1;
        scene.setScore(10, toAdd);
        const sound = toAdd ? 'positive' : 'negative';
        scene.sound.play(sound, { detune: 400, volume: 0.4 });
      },
      onComplete: () => {
        sprite.setVisible(false);
        sprite.setX(-200);
        scene.events.emit('secretover');
      },
    });
  }

  startStage() {
    const { scene, actionSnd, sprite } = this;
    this.played = true;
    this.playAllowed = false;
    sprite.setVisible(true);
    actionSnd.play();

    scene.tweens.add({
      targets: [sprite],
      duration: 3000,
      x: { from: -200, to: 512 },
      ease: 'Linear',
      onComplete: () => this.endStage(),
    });
  }

  setActive(allowed) {
    this.playAllowed = allowed;
  }

  try() {
    const { scene, playAllowed, played } = this;
    if (playAllowed && !played) {
      this.startStage();
      scene.events.emit('secret');
    }
  }

  reset() {
    this.played = false;
    this.playAllowed = false;
  }
}
