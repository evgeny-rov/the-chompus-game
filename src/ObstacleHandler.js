import randNum from './utils/randomNum';

export default class ObstacleHandler {
  constructor(scene) {
    this.context = scene;
    this.obstacles = this.context.physics.add.group();
    this.maxObstacles = 1;
  }

  getObstacles() {
    return this.obstacles;
  }

  setMax(amount) {
    this.maxObstacles = amount;
  }

  updateObstacles() {
    const { x, y } = this.context.spawnPoint;
    const sprite = randNum(0, 12);
    const scale = randNum(40, 100) / 100;
    const xPos = x;

    const obstacle = this.context.physics.add.sprite(xPos, y, 'toadsdev', sprite);
    obstacle.body.setSize(80, 80);
    obstacle.body.setOffset(20, 20)
    obstacle.setScale(scale);
    //obstacle.setCircle(55, 0, 10);

    const scoreCollider = this.context.physics.add.collider(obstacle, this.context.scoreCheck, (toad, body) => {
      scoreCollider.active = false;
      this.context.incScore(1);
    });

    this.context.physics.add.overlap(obstacle, this.context.catcher, (toad, body) => {
      const newSprite = randNum(0, 12);
      const newScale = randNum(40, 100) / 100;
      toad.body.reset(randNum(x, x + 600), y);
      toad.setScale(newScale);
      toad.setFrame(newSprite);
      scoreCollider.active = true;
    });

    this.context.physics.add.overlap(obstacle, this.obstacles, (toad, body) => {
      toad.setX(randNum(x, x + 600));
    });

    this.context.physics.add.overlap(obstacle, this.context.player.sprite, (toad, body) => {
      this.context.scene.restart();
    });

    return obstacle;
  }

  update() {
    const length = this.obstacles.getLength();
    if (length < this.maxObstacles) {
      this.obstacles.add(this.updateObstacles());
    }
  }
}
