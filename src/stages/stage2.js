export default (context) => {
    context.groundBg.tilePositionX += 10;
    context.obstaclesTEST.getObstacles().incX(-10);
    context.obstaclesTEST.setMax(2);
}