const playerKillTexture = 'p00';
const playerDefTexturePrefix = 'pd0';
const playerSpecTexturePrefix = 'ps0';
const playerDefTexture = 'pd01';
const playerDefJumpTexture = 'pd03';
const playerSpecJumpTexture = 'ps03';
const specialObstacle = 'obs00';

export default class Player {
  constructor(scene) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.input = scene.input;
    this.jumpSnd = scene.sound.add('player-jump', { volume: scene.masterVolume * 5 });
    this.attackSnd = scene.sound.add('player-attack', { volume: scene.masterVolume * 1.3 });

    this.xPos = scene.game.config.width / 5;

    this.obstacleHandler = scene.obstacles;
    this.obstacles = scene.obstacles.getObstacles();

    this.availableBonus = false;
    this.activatedBonus = false;

    const { anims } = scene;
    anims.create({
      key: 'player_def',
      frames: anims.generateFrameNames('textures', {
        prefix: playerDefTexturePrefix,
        start: 1,
        end: 4,
      }),
      frameRate: 14,
      repeat: -1,
    });

    anims.create({
      key: 'player_spec',
      frames: anims.generateFrameNames('textures', {
        prefix: playerSpecTexturePrefix,
        start: 1,
        end: 4,
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.sprite = scene.physics.add
      .sprite(this.xPos, -50, 'textures', playerDefTexture)
      .setScale(0.5);
    this.sprite.body.setAccelerationY(1600);
    this.sprite.body.setSize(105, 75);
    this.sprite.body.setOffset(50, 40);

    this.groundCollider = scene.physics.add.collider(scene.ground, this.sprite);

    this.obstacleCollider = scene.physics.add.overlap(this.sprite, this.obstacles, (p, obst) => {
      if (obst.frame.name === specialObstacle) {
        this.scene.negativeSnd.play();
        this.scene.setScore(1, false);
        this.obstacleHandler.cycle(obst);
        return this.scene.notSecretStage.try();
      }
      obst.disableBody();
      return scene.gameOver();
    });

    this.input.keyboard.on('keydown-SPACE', () => this.activateBonus());
    this.keys = this.input.keyboard.addKeys({
      up: 'up',
      w: 'W',
    });

    scene.events.on('secret', () => this.setInvincible());
  }

  setInvincible() {
    this.obstacleCollider.active = false;
  }

  unsetInvincible() {
    this.obstacleCollider.active = true;
  }

  setBonus() {
    const { sprite } = this;
    this.availableBonus = true;
    sprite.setFrame(playerSpecJumpTexture);
  }

  unsetBonus() {
    this.availableBonus = false;
    this.activatedBonus = false;
  }

  jump() {
    const { jumpSnd, sprite, availableBonus } = this;
    const onGround = sprite.body.touching.down;
    const targetFrame = !availableBonus ? playerDefJumpTexture : playerSpecJumpTexture;
    if (onGround) {
      jumpSnd.play();
      sprite.setVelocityY(-1400);
      sprite.anims.stop();
      sprite.setFrame(targetFrame);
    }
  }

  attack() {
    const { obstacles } = this.scene;
    this.attackSnd.play();
    this.unsetBonus();
    this.camera.shake(150, 0.03, true);
    obstacles.kill();
    this.scene.incProgress();
  }

  activateBonus() {
    const { scene, availableBonus, sprite } = this;
    if (availableBonus) {
      this.setInvincible();
      const onGround = sprite.body.touching.down;
      const velocity = onGround ? -700 : 500;
      sprite.body.setVelocityY(velocity);
      this.availableBonus = false;
      scene.time.delayedCall(150, () => {
        this.activatedBonus = true;
      }, null, this);
    }
  }

  reset() {
    const { sprite } = this;
    sprite.setPosition(this.xPos, -50);
    sprite.setFrame(playerDefTexture);
    this.unsetBonus();
    this.unsetInvincible();
  }

  kill() {
    const { sprite } = this;
    sprite.anims.pause();
    sprite.setFrame(playerKillTexture);
    sprite.setVelocityY(-1000);
  }

  update() {
    const {
      scene,
      input,
      keys,
      sprite,
      availableBonus,
      activatedBonus,
    } = this;

    const onGround = sprite.body.touching.down;
    const pointer = input.activePointer;
    const pointerActive = pointer.isDown && pointer.y > 100;
    const pointerOnJump = pointerActive && pointer.x > scene.game.config.width / 2;
    const pointerOnBonus = pointerActive && pointer.x < scene.game.config.width / 2;

    if (pointerOnBonus) this.activateBonus();

    if (pointerOnJump || keys.w.isDown || keys.up.isDown) this.jump();

    if (activatedBonus && onGround) this.attack();

    if (sprite.body.velocity.y === 0 && onGround) {
      const targetAnim = availableBonus ? 'player_spec' : 'player_def';
      sprite.anims.play(targetAnim, true);
    }
  }
}
