export default (context) => {
    console.log('stage1')
    context.groundBg.tilePositionX += 5;
    context.obstaclesTEST.getObstacles().incX(-5)
    //context.player.anims.frameRate
}