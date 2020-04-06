export default (context) => {
    const { speed } = context;
    const stageSpeed = 20;
    if (speed < stageSpeed) context.speed += 0.05;
    //console.log('stageMax', 'speed:', speed)

    context.groundBg.tilePositionX += speed;
    context.obstacles.getObstacles().incX(-speed);
    context.obstacles.setMax(4);
}