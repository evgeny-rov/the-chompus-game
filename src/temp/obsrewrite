import randNum from './utils/randomNum';

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

  pickUnbunchedPos(refPos, refSize) {
    const putAfter = randNum(0, 1) === 1;
    const pivot = putAfter ? refPos + (refSize / 2) : refPos - (refSize / 2);

    return putAfter
      ? randNum(pivot, pivot + 500)
      : randNum(this.context.spawnPoint.x, pivot);
  }

  posEval(currentSize) {
    const lastObs = this.obstacles.getLast(true);
    const lastPos = lastObs && lastObs.x;
    const notAccessible = lastPos && lastPos - this.context.spawnPoint.x < 150;
    if (this.obstacles.getLength() === 0 || notAccessible) {
      return this.context.spawnPoint.x + randNum(100, 700);
    }
    const toBunch = randNum(0, 2) === 0;
    const lastSize = lastObs.displayWidth;

    const nextPos = toBunch
      ? lastPos + (lastSize / 2 + currentSize / 2)
      : this.pickUnbunchedPos(lastPos, lastSize);

    return Math.floor(nextPos);
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

    const scoreCollider = this.context.physics.add.collider(obstacle, this.context.scoreCheck, (toad, body) => {
      this.context.physics.world.removeCollider(scoreCollider);
      this.context.scoreText.setText(`${this.context.score += 1}`);
    });

    this.context.physics.add.overlap(obstacle, this.obstacles, (toad, body) => {
      const posX = toad.x;
      toad.setX(randNum(posX, posX + 600));
    });

    this.context.physics.add.overlap(obstacle, this.context.player.sprite, (toad, body) => {
      this.context.scene.restart()
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
}
