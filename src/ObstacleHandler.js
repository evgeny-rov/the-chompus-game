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

  stomp() {
    const { obstacleCollider } = this.context;
    obstacleCollider.active = false;
    console.log(obstacleCollider)
  }

  updateObstacles() {
    const { x, y } = this.context.spawnPoint;
    const sprite = randNum(0, 12);
    const scale = randNum(50, 80) / 100;
    const xPos = randNum(x, x + 500);

    const obstacle = this.context.physics.add.sprite(xPos, y, 'toadsdev', sprite);
    obstacle.body.setSize(80, 80);
    obstacle.body.setOffset(20, 20);
    obstacle.setScale(scale);

    const scoreCollider = this.context.physics.add.collider(obstacle, this.context.scoreCheck, () => {
      scoreCollider.active = false;
      this.context.incScore(1);
      this.context.scoreText.setText(`${this.context.score}`);
    });

    this.context.physics.add.overlap(obstacle, this.context.catcher, (toad, body) => {
      const newSprite = randNum(0, 12);
      const newScale = randNum(50, 80) / 100;
      toad.body.reset(randNum(x, x + 500), y);
      toad.setScale(newScale);
      toad.setFrame(newSprite);
      scoreCollider.active = true;
    });

    this.context.physics.add.overlap(obstacle, this.obstacles, (toad, body) => {
      toad.setX(randNum(x, x + 500));
    });

    this.context.physics.add.overlap(obstacle, this.context.player.sprite, (toad, body) => {
      //const { score, highscore } = this.context;
      //const newHighscore = score > highscore ? score : highscore;
      //this.context.setHighscore(newHighscore);
      //this.context.scene.restart();
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
