import ground from '../assets/ground.png';
import player from '../assets/player-stand.png';
import cacti from '../assets/cacti.png';
import prlx from '../assets/parallax.png';
import groundv2 from '../assets/groundv2.png';
import devchomp from '../assets/chompusd.png';
import obstacledev from '../assets/obstacledev.png';
import playerdev from '../assets/player-dev.png';
import playerdevbw from '../assets/player-devbw.png';
import toadsprite from '../assets/sprite.png';

import four from '../assets/layers/4.png';
import three from '../assets/layers/3.png';
import two from '../assets/layers/2.png';
import one from '../assets/layers/1.png';

import spriteImporter from '../spriteImporter.js';
import velocityCalculator from '../velocityCalculator.js';

export default class Level1 extends Phaser.Scene {
    preload() {
        spriteImporter(this, 
            [
                { name: 'ground', asset: ground, w: 1202, h: 32 },
                { name: 'player', asset: player, w: 88, h: 103 },
                { name: 'cacti', asset: cacti, w: 50, h: 96 },
                { name: 'newground', asset: groundv2, w: 1024, h: 709 },
                { name: 'playerd', asset: devchomp, w: 100, h: 90 },
                { name: 'obstacledev', asset: obstacledev, w: 577, h: 755 },
                { name: 'playerdev', asset: playerdev, w: 128, h: 104 },
                { name: 'playerdevbw', asset: playerdevbw, w: 128, h: 104 },
                { name: 'spritedev', asset: toadsprite, w: 132, h: 132 },
                { name: 'fourth', asset: four, w: 480, h: 272 },
                { name: 'third', asset: three, w: 592, h: 272 },
                { name: 'second', asset: two, w: 592, h: 272 },
                { name: 'first', asset: one, w: 592, h: 272 },
            ]);
    }

    create() {
        this.spawnPoint = { x: 900, y: 300 };
        this.bg4 = this.add.tileSprite(400, 190, 480, 272, 'fourth').setScale(2);
        this.bg3 = this.add.tileSprite(400, 190, 592, 272, 'third').setScale(1.5, 1.7);
        this.bg2 = this.add.tileSprite(400, 190, 592, 272, 'second').setScale(1.5, 1.7);
        this.bg1 = this.add.tileSprite(400, 190, 592, 272, 'first').setScale(1.5, 1.7);
        
        //this.prlxbg = this.add.tileSprite(400, 190, 592, 272, 'prlx').setScale(1.5, 1.7);
        this.bg = this.add.tileSprite(300, 430, 1024, 709, 'newground').setScale(1, 0.6);

        this.ground = this.physics.add.staticImage(400, 400, 'ground').setScale(0.5);
        this.ground.setAlpha(0)

        this.player = this.physics.add.sprite(200, 200, 'player', 2);
        this.player.setScale(.5)
        
        this.obstacle = this.physics.add.sprite(this.spawnPoint.x + 500, this.spawnPoint.y + 50, 'spritedev', 0);
        this.obstacle.body.setAllowGravity(false)
        this.obstacle.setScale(.5);
        
        this.physics.add.collider(this.ground, this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

        /// experimentation zone
        const { width, height } = this.game.config;
        this.score = 1;
        this.scoreText = this.add.text(25, 20, `Score: ${this.score}`)
        /// the end of experimentation zone, you are clear mister!
    }

    update() {
        const stages = {
            1: (context) => console.log('stage: 1'),
            2: (context) => console.log('stage: 2'),
            max: () => console.log('max'),
        }
        const stage = this.score >= 400 ? 'max' : Math.ceil(this.score / 200);
        stages[stage]();
        ///
        this.scoreText.setText(`Score: ${Math.floor(this.score += .5)}`);
        this.bg.tilePositionX += 8;
        this.obstacle.x -= 8;

        this.bg3.tilePositionX += .3;
        this.bg2.tilePositionX += .5;
        this.bg1.tilePositionX += .8 ;

        const isOverlapping = this.physics.world.overlap(this.obstacle, this.player)
        if (this.obstacle.x < -100) {
            const nextSprite = Phaser.Math.Between(0, 4);
            const nextScale = Phaser.Math.Between(50, 150) / 100;
            const nextPosx = this.spawnPoint.x + Phaser.Math.Between(200, 500);
            this.obstacle.body.reset(nextPosx, this.spawnPoint.y + 50);
            this.obstacle.setFrame(nextSprite);
            this.obstacle.setScale(nextScale);
        }

        if (isOverlapping) {
            this.scene.restart()
        }

        if (this.cursors.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-800);
          }
    }
}