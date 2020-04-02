import spriteImporter from '../spriteImporter.js';
//import obstacleHandler from '../obstacleHandler.js';
import obstacleHandler from '../obsHandler.js';
let highscore = 0;
let paused = false;

export default class Level1 extends Phaser.Scene {
    preload() {
        spriteImporter(this)
    }

    create() {
        this.spawnPoint = { x: 900, y: 300 };
        this.bg4 = this.add.tileSprite(400, 190, 480, 272, 'fourth').setScale(2);
        this.bg3 = this.add.tileSprite(400, 190, 592, 272, 'third').setScale(1.5, 1.7);
        this.bg2 = this.add.tileSprite(400, 190, 592, 272, 'second').setScale(1.5, 1.7);
        this.bg1 = this.add.tileSprite(400, 190, 592, 272, 'first').setScale(1.5, 1.7);

        this.bg = this.add.tileSprite(300, 430, 1024, 709, 'newground').setScale(1, 0.6);
        
        this.ground = this.add.rectangle(400, 400, 800, 10).setAlpha(0);
        this.physics.add.existing(this.ground, true);

        this.player = this.physics.add.sprite(200, 200, 'chompusdev', 0);
        this.player.setScale(0.5)

        this.anime = this.add.tileSprite(30, 225, 32, 64, 'kanako', 3)
        .setScale(5)
        .setVisible(false);
       
        this.physics.add.collider(this.ground, this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

        /// experimentation zone
        const { width, height } = this.game.config;
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
        /// the end of experimentation zone, you are clear mister!
    }

    update() {
        this.obstaclesTEST.update();
        /*
        const stages = {
            1: (context) => console.log('stage: 1'),
            2: (context) => console.log('stage: 2'),
            max: () => console.log('max'),
        }
        const stage = this.score >= 1000 ? 'max' : Math.ceil(this.score / 500);
        stages[stage]();
        */
        ///

        this.scoreText.setText(`Score: ${Math.floor(this.score += .5)}`);
        this.bg.tilePositionX += 15;

        this.bg3.tilePositionX += .3;
        this.bg2.tilePositionX += .5;
        this.bg1.tilePositionX += .8 ;

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