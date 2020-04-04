export default (context) => {
    const { speed } = context;
    const stageSpeed = 10;
    if (speed < stageSpeed) context.speed += 0.05;
    console.log('stage2', 'speed', speed)

    context.groundBg.tilePositionX += speed;
    context.obstaclesTEST.getObstacles().incX(-speed);
    context.obstaclesTEST.setMax(2);
}