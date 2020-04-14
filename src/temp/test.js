const scoreCollider = this.context.physics.add.collider(obstacle, this.context.scoreCheck, (toad, body) => {
  scoreCollider.active = false;
  this.context.incScore(1);
});

this.context.physics.add.overlap(obstacle, obstacleGroup, (toad, body) => {
  const { x, y } = this.context.spawnPoint;
  toad.setX(randNum(x, x + 600));
});

this.context.physics.add.overlap(obstacle, this.context.player.sprite, (toad, body) => {
  this.context.scene.restart();
});

this.context.physics.add.overlap(obstacle, this.context.catcher, (toad, body) => {
  const { x, y } = this.context.spawnPoint;
  const sprite = randNum(0, 12);
  const scale = randNum(40, 100) / 100;
  toad.body.reset(randNum(x, x + 600), y);
  toad.setScale(scale);
  toad.setFrame(sprite);
  scoreCollider.active = true;
});