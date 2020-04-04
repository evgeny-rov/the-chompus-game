export default (context) => {
    console.log('stagemax')
    context.groundBg.tilePositionX += 15;
    context.obstaclesTEST.getObstacles().incX(-15);
    context.obstaclesTEST.setMax(4);
}