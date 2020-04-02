export default class ObsHandler {
    constructor(scene) {
        this.context = scene;
        this.obstacles = this.context.add.group();
    }

    isEmpty() {
        return this.obstacles.getLength() === 0;
    }

    randomNumber(min, max) {
        return Phaser.Math.Between(min, max);
    }

    createObjects() {
        const amount = this.randomNumber(1, 3);

        const nextPosX = this.context.spawnPoint.x + this.randomNumber(200, 500);
        const nextPosY = this.context.spawnPoint.y + 50;

        const objects = [];
        let prevPos;
        let prevSize;

        for (let i = amount; i > 0; i--) {
            const nextSprite = this.randomNumber(0, 12);
            const nextScale = this.randomNumber(40, 100) / 100;
            const currentSize = (142 * nextScale)
            const obstaclePlace = prevPos ? prevPos - (prevSize / 2 + currentSize / 2) : nextPosX + currentSize;
            prevPos = obstaclePlace;
            prevSize = currentSize;

            const obstacle = this.context.physics.add.sprite(Math.floor(obstaclePlace), nextPosY, 'toadsdev', nextSprite);
            obstacle.body.setAllowGravity(false);
            obstacle.setScale(nextScale);
            obstacle.setCircle(55, 0, 10);
            objects.push(obstacle);
        }
        return objects;
    }

    adding() {
        this.obstacles.addMultiple(this.createObjects());
    }

    updating() {
        this.obstacles.incX(-15)
        const isOverlapping = this.context.physics.world.overlap(this.obstacles, this.context.player)

        if (isOverlapping) {
            //const newHighScore = this.score > highscore ? this.score : highscore;
            //highscore = Math.floor(newHighScore);
            this.context.scene.restart()
        }

        if (this.obstacles.getFirst(true).x < -132) {
            this.obstacles.clear(true, true);
        }
    }

    update() {
        return this.isEmpty() ? this.adding() : this.updating();
    }
};