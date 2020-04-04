export default (context) => {
    const { speed } = context;
    const stageSpeed = 5;
    if (speed < stageSpeed) context.speed += 0.1;
    console.log('stage1', 'speed', speed)

    context.groundBg.tilePositionX += speed;
    context.obstaclesTEST.getObstacles().incX(-speed);
    context.obstaclesTEST.setMax(1);
}