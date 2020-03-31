const obstacleUpdate = (context, highscore) => {
    context.obstacles.incX(-10)

    /*
    if (context.obstacle.x < -100) {
        const nextSprite = Phaser.Math.Between(0, 4);
        const nextScale = Phaser.Math.Between(50, 150) / 100;
        const nextPosx = context.spawnPoint.x + Phaser.Math.Between(200, 500);
        context.obstacle.body.reset(nextPosx, context.spawnPoint.y + 50);
        context.obstacle.setFrame(nextSprite);
        context.obstacle.setScale(nextScale);
    }

    const isOverlapping = context.physics.world.overlap(context.obstacle, context.player)
    if (isOverlapping) {
        const newHighScore = context.score > highscore ? context.score : highscore;
        highscore = Math.floor(newHighScore);
        context.scene.restart()
    }
    */
}

const randomObstacle = (context) => {
    const obstacle = context.physics.add.sprite(context.spawnPoint.x + 500, context.spawnPoint.y + 70, 'spritedev', 0);
    obstacle.body.setAllowGravity(false)
    obstacle.setScale(.5);
    obstacle.setCircle(55, 0, 10)

    return obstacle;
}


export default (context, highscore) => {
    //console.log(context.obstacles)
    if (context.obstacles.getLength() === 0) {
        console.log('add', context.obstacles.getLength())
        context.obstacles.addMultiple([randomObstacle(context)])
/*
        context.obstacle = context.physics.add.sprite(context.spawnPoint.x + 500, context.spawnPoint.y + 70, 'spritedev', 0);
        context.obstacle.body.setAllowGravity(false)
        context.obstacle.setScale(.5);
        context.obstacle.setCircle(55, 0, 10)
        context.obstacles.push(context.obstacle);
*/
    } else {
        console.log('update')
        obstacleUpdate(context, highscore)
    }



/*    
    context.obstacle.x -= 10;

    const isOverlapping = context.physics.world.overlap(context.obstacle, context.player)
    if (context.obstacle.x < -100) {
        const nextSprite = Phaser.Math.Between(0, 4);
        const nextScale = Phaser.Math.Between(50, 150) / 100;
        const nextPosx = context.spawnPoint.x + Phaser.Math.Between(200, 500);
        context.obstacle.body.reset(nextPosx, context.spawnPoint.y + 50);
        context.obstacle.setFrame(nextSprite);
        context.obstacle.setScale(nextScale);
    }

    if (isOverlapping) {
        const newHighScore = context.score > highscore ? context.score : highscore;
        highscore = Math.floor(newHighScore);
        context.scene.restart()
    }
*/
/*
    context.obstacle = context.physics.add.sprite(context.spawnPoint.x + 500, context.spawnPoint.y + 70, 'spritedev', 0);
    context.obstacle.body.setAllowGravity(false)
    context.obstacle.setScale(.5);
    context.obstacle.setCircle(55, 0, 10)
*/
};