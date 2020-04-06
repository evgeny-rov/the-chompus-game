export default (context) => {
    const { speed } = context;
    const stageSpeed = 5;
    context.speed = 5;
    //console.log('stage1', 'speed', speed)

    context.groundBg.tilePositionX += speed;
    context.obstacles.getObstacles().incX(-speed);
    context.obstacles.setMax(1);
}