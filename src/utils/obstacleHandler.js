import randNum from './randomNum.js';

export default class ObstacleHandler {
    constructor(scene) {
        this.context = scene;
        this.obstacles = this.context.add.group();
        this.maxObstacles = 1;
    }

    getObstacles() {
        return this.obstacles;
    }

    setMax(amount) {
        this.maxObstacles = amount;
    }

    pickUnbunchedPos(refPos, refSize, withinBounds) {
        if (withinBounds) {
        const after = randNum(0, 1) === 1;
        const pivot = after ? refPos + (refSize / 2) : refPos - (refSize / 2);
        return after
        ? randNum(pivot, pivot + 400)
        : randNum(this.context.spawnPoint.x, pivot);
        } else {
            return this.context.spawnPoint.x + randNum(200, 500)
        }

    }

    posEval(currentSize) {
        const lastObs = this.obstacles.getLast(true);
        if (lastObs) {
            const lastSize = lastObs.displayWidth;
            const lastPos = lastObs.x;

            const toBunch = randNum(0, 2) === 0;
            const inBounds = lastPos > this.context.spawnPoint.x;

            const nextPos = toBunch && inBounds
            ? lastPos + (lastSize / 2 + currentSize / 2)
            : this.pickUnbunchedPos(lastPos, lastSize, inBounds);

            return Math.floor(nextPos);
        } else {
            return this.context.spawnPoint.x + randNum(100, 700);
        }
    }

    create() {
        const sprite = randNum(0, 12);
        const scale = randNum(40, 100) / 100;
        const currentSize = (142 * scale);
        const xPos = this.posEval(currentSize);
        const yPos = this.context.spawnPoint.y;

        const obstacle = this.context.physics.add.sprite(xPos, yPos, 'toadsdev', sprite);
        obstacle.body.setAllowGravity(false);
        obstacle.setScale(scale);
        obstacle.setCircle(55, 0, 10);

        this.context.physics.add.overlap(obstacle, this.context.player, (toad, body) => {
            //this.obstacles.remove(toad, true)
            //this.context.scene.pause()
        });

        this.context.physics.add.overlap(obstacle, this.context.catcher, (toad, body) => {
            toad.destroy();
            this.obstacles.remove(toad, true);
        });

        return obstacle;
    }

    update() {
        if (this.obstacles.getLength() < this.maxObstacles) this.obstacles.add(this.create());
    }
};