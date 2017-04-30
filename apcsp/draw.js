// gameState = {
//     obstacles: [], // {height: 0, distanceFromPlayer: 0, type: 'wall'}
//     player: {
//         score: 0,
//         yHeight: 0,
//         yVelocity: 0,
//         distance: 0
//     }
// }
function MAX_PLAYER_HEIGHT(canvas) {
    return canvas.height - FLOOR_Y
}

function MAX_DISTANCE_FROM_PLAYER(canvas) {
    return canvas.width - FLOOR_X
}

// var player = new Image();

function draw(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState.gameOver) {
        showGameOverScreen(ctx, canvas)
        return
    }

    drawPlayer(ctx, canvas);
    // drawObstacle(ctx, canvas, {height: 50, distanceFromPlayer: 100, type: 'wall'})
    gameState.obstacles.forEach(drawObstacleFunctionForContextAndCanvas(ctx, canvas));
    drawGround(ctx, canvas);
    drawInfo(ctx, canvas, gameState);
}

function showGameOverScreen(ctx, canvas) {
    // make background
    ctx.fillStyle = '#7f8c8d'; // obtained from http://flatuicolors.com/
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // game over text
    ctx.fillStyle = '#ecf0f1'; // obtained from http://flatuicolors.com/
    ctx.textAlign = 'center'; // text centering from http://www.ckollars.org/canvas-text-centering.html
    ctx.font = 'normal bold 30pt sans-serif'; // text styling from http://www.ckollars.org/canvas-text-centering.html
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    // score text
    ctx.font = '15pt sans-serif';
    ctx.fillText("you scored " + gameState.score.toString(), canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText("your high is " + getHighScoreAsString(), canvas.width / 2, canvas.height / 2 + 60);
    // play again text

    ctx.fillText("press return to play again", canvas.width / 2, canvas.height / 2 + 90);
}

function drawGround(ctx, canvas) {
    ctx.fillStyle = '#2ecc71'; // obtained from http://flatuicolors.com/
    ctx.fillRect(0, canvas.height - FLOOR_Y, canvas.width, FLOOR_Y);
}

function drawPlayer(ctx, canvas) {
    ctx.fillStyle = '#000000'; // black
    var baseHeight = canvas.height - FLOOR_Y;
    var playerHeight = baseHeight - gameState.player.yHeight;
    // ctx.drawImage(player, FLOOR_X, playerHeight);
    ctx.fillRect(FLOOR_X, canvas.height - FLOOR_Y - gameState.player.yHeight, PLAYER_SIZE, -PLAYER_SIZE);
}

function drawInfo(ctx, canvas, gs) {
    // show distance travelled
    ctx.textAlign = 'left';
    ctx.font = '20pt sans-serif';
    ctx.fillText("Score: " + gameState.score.toString(), canvas.width - 220, 60);

    // show highscore if there is one
    if (!window.localStorage) return;
    ctx.font = '20pt sans-serif';
    ctx.fillText("High score: " + getHighScoreAsString(), canvas.width - 220, 100);
}

function drawObstacleFunctionForContextAndCanvas(ctx, canvas) {
    return (obstacle) => drawObstacle(ctx, canvas, obstacle)
}

function drawObstacle(ctx, canvas, obstacle) {
    ctx.fillStyle = '#2980b9'; // obtained from http://flatuicolors.com/
    var obstDistance = FLOOR_X + obstacle.distanceFromPlayer;
    var baseHeight = canvas.height - FLOOR_Y;
    ctx.fillRect(obstDistance, baseHeight, OBSTACLE_WIDTH, -obstacle.height + (getGapHeight() / 2));
    ctx.fillRect(obstDistance, 0, OBSTACLE_WIDTH, baseHeight - obstacle.height - (getGapHeight() / 2));
}

function getHighScoreAsString() {
    return (window.localStorage.highscore || 0).toString();
}
