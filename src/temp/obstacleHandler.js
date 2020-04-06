export default class ObstacleHandler {
    constructor(scene) {
        this.context = scene;
        this.obstacles = this.context.add.group();
        this.maxObstacles = 1;
    }

    setMax(amount) {
        this.maxObstacles = amount;
    }

    getObstacles() {
        return this.obstacles;
    }

    isEmpty() {
        return this.obstacles.getLength() === 0;
    }

    randomNumber(min, max) {
        return Phaser.Math.Between(min, max);
    }

    createObjects() {
        const amount = this.randomNumber(1, this.maxObstacles);

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
            
            this.context.physics.add.overlap(obstacle, this.context.player, (toad, body) => this.context.scene.pause());

            console.log(obstacle)
            objects.push(obstacle);
        }
        return objects;
    }

    adding() {
        console.log('call to add', this.obstacles.getLength())
        this.obstacles.addMultiple(this.createObjects());
    }

    updating() {
        //console.log(this.obstacles)

        const isOverlapping = this.context.physics.world.overlap(this.obstacles, this.context.player)

        if (isOverlapping) {
            //this.context.scene.pause()
        }

        if (this.obstacles.getFirst(true).x < -142) {
            this.obstacles.clear(true, true);
        }
    }

    update() {
        return this.isEmpty() ? this.adding() : this.updating();
    }
};