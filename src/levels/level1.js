import ground from '../assets/ground.png';
import player from '../assets/player-stand.png';
import cacti from '../assets/cacti.png';
import prlx from '../assets/parallax.png';
import groundv2 from '../assets/groundv2.png';
import devchomp from '../assets/chompusd.png';
import obstacledev from '../assets/obstacledev.png';

import spriteImporter from '../spriteImporter.js';
import velocityCalculator from '../velocityCalculator.js';

export default class Level1 extends Phaser.Scene {
    preload() {
        spriteImporter(this, 
            [
                { name: 'ground', asset: ground, w: 1202, h: 32 },
                { name: 'player', asset: player, w: 88, h: 103 },
                { name: 'cacti', asset: cacti, w: 50, h: 96 },
                { name: 'prlx', asset: prlx, w: 592, h: 272 },
                { name: 'newground', asset: groundv2, w: 1024, h: 709 },
                { name: 'playerd', asset: devchomp, w: 100, h: 90 },
                { name: 'obstacledev', asset: obstacledev, w: 577, h: 755 }
            ]);
    }

    create() {
        //const velocity = velocityCalculator(this);
        this.spawnPoint = { x: 900, y: 300 };
        this.prlxbg = this.add.tileSprite(400, 190, 592, 272, 'prlx').setScale(1.5, 1.7);
        this.bg = this.add.tileSprite(300, 430, 1024, 709, 'newground').setScale(1, 0.6);

        this.ground = this.physics.add.staticImage(400, 400, 'ground').setScale(0.5);
        this.ground.setAlpha(0)

        this.player = this.physics.add.sprite(200, 200, 'player', 0);
        
        this.obstacle = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'obstacledev', 0);
        this.obstacle.body.setAllowGravity(false)
        this.obstacle.setScale(.2);
        
        this.physics.add.collider(this.ground, this.player);
        this.physics.add.collider(this.ground, this.obstacle);

        this.cursors = this.input.keyboard.createCursorKeys();


        /// experimentation zone

        /// the end of experimentation zone, you are clear mister!
    }

    update() {
        this.bg.tilePositionX += 5;
        this.obstacle.x -= 5;
        this.prlxbg.tilePositionX += 3;
        const isOverlapping = this.physics.world.overlap(this.obstacle, this.player)
        if (this.obstacle.x < -100) {
            this.obstacle.body.reset(this.spawnPoint.x, this.spawnPoint.y);
        }

        if (isOverlapping) {
            this.scene.restart()
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-800);
          }
    }
}