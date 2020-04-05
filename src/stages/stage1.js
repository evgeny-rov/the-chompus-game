export default (context) => {
    const { speed } = context;
    const stageSpeed = 5;
    context.speed = 5;
    //console.log('stage1', 'speed', speed)

    context.groundBg.tilePositionX += speed;
    context.obstaclesTEST.getObstacles().incX(-speed);
    context.obstaclesTEST.setMax(1);
}