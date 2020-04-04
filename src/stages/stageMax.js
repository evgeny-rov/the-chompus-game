export default (context) => {
    const { speed } = context;
    const stageSpeed = 20;
    if (speed < stageSpeed) context.speed += 0.05;
    console.log('stageMax', 'speed:', speed)

    context.groundBg.tilePositionX += speed;
    context.obstaclesTEST.getObstacles().incX(-speed);
    context.obstaclesTEST.setMax(4);
}