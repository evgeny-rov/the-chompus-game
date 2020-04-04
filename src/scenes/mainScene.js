import spriteImporter from '../utils/spriteImporter.js';
import obstacleHandler from '../utils/obstacleHandler.js';
import stage1 from '../stages/stage1.js';
import stage2 from '../stages/stage2.js';
import stageMax from '../stages/stageMax.js';

let highscore = 0;

const settings = {
    maxStage: 800,
    stageTick: 400,
    oSpawnX: 900,
    oSpawnY: 300,
}

export default class Level1 extends Phaser.Scene {
    preload() {
        spriteImporter(this)
    }

    create() {
        this.spawnPoint = { x: 900, y: 300 };
        const { width, height } = this.game.config;
        console.log(width)

        this.bg4 = this.add.tileSprite(width / 2, height / 4, 480, 272, 'fourth').setScale(2);
        this.bg3 = this.add.tileSprite(width / 2, height / 4, 592, 272, 'third').setScale(1.5, 1.7);
        this.bg2 = this.add.tileSprite(width / 2, height / 4, 592, 272, 'second').setScale(1.5, 1.7);
        this.bg1 = this.add.tileSprite(width / 2, height / 4, 592, 272, 'first').setScale(1.5, 1.7);

        this.groundBg = this.add.tileSprite(width / 2, Math.floor(height / 1.4), 1024, 709, 'newground').setScale(1, 0.6);
        
        this.ground = this.add.rectangle(width / 2, height / 1.5, 800, 10).setAlpha(0);
        this.physics.add.existing(this.ground, true);

        this.player = this.physics.add.sprite(width / 4, height / 2, 'chompusdev', 0);
        this.player.setScale(0.5)
       
        this.physics.add.collider(this.ground, this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

        /// experimentation zone
        
        this.score = 1;
        this.scoreText = this.add.text(25, 20, `Score: ${this.score}`)
        this.highscore = this.add.text(25, 40, `Highscore: ${highscore}`)

        const anims = this.anims;
        anims.create({
            key: "player-run",
            frames: anims.generateFrameNumbers('chompusdev', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        this.obstaclesTEST = new obstacleHandler(this)

        this.speed = 1;
        /// the end of experimentation zone, you are clear mister!
    }

    update() {
        const stages = {
            1: (context) => stage1(context),
            2: (context) => stage2(context),
            max: (context) => stageMax(context),
        }
        const stage = this.score >= settings.maxStage ? 'max' : Math.ceil(this.score / settings.stageTick);
        stages[stage](this);

        this.obstaclesTEST.update();

        this.scoreText.setText(`Score: ${Math.floor(this.score += .5)}`);

        this.bg3.tilePositionX += .3;
        this.bg2.tilePositionX += .5;
        this.bg1.tilePositionX += .8;

        if (this.cursors.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-800);
        } 
        
        if (this.player.body.velocity.y === 0 && this.player.body.touching.down) {
            this.player.anims.play('player-run', true)
        } else {
            this.player.anims.stop();
            this.player.setFrame(2);
        }

        if (this.cursors.down.isDown) {
            this.scene.pause()
        }
    }
}