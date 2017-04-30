var gameState; // Make sure that the gameState variable has global scope.
resetGameState(); // Set up the gameState before the first round.

function resetGameState() {
    // Prepare gameState object for a new game by zeroing values and removing existing obstacles
    gameState = {
        gameOver: false,
        obstacles: [], // {height: 0, distanceFromPlayer: 0, type: 'wall'}
        player: {
            yHeight: 0, // height of top edge of player
            yVelocity: 0, // pixel per tick
            distance: 0 // pixels
        },
        score: 0
    }
}

var updateState = function() {
    // Complete each compartmentalized subroutine of the updateState method.
    stageMovement(); // Move the walls/obstacles closer to the player each tick, and update the player's distance value.
    playerMovement(); // Move the player vertically, taking into account current velocity and gravity.
    updateWalls(); // Generate new walls if needed, and garbage-collect ones the player has already passed.
    detectCollisions(); // End the game if the player has hit a wall.
}

function stageMovement() {
    // Update the score based on the floored output of a linear function evaluated on the player's distance moved.
    gameState.score = Math.floor((gameState.player.distance - 1430) / 10);

    // If there is currently an obstacle on screen (ie. not the first tick), but it is far away, then speed up the game.
    var nextObstacle;
    if ((nextObstacle = gameState.obstacles[0]) && nextObstacle.distanceFromPlayer > CLOSE_TO_PLAYER_THRESHOLD) {
        gameState.gameSpeed = Math.round(nextObstacle.distanceFromPlayer * SPEED_IN_FACTOR);
        gameState.score = 0; // Don't update score in the beginning
    } else {
        // If the closest obstacle is no longer far away, or there aren't any obstacles, then run the game at normal speed. 
        gameState.gameSpeed = calculateGameSpeed(gameState.player.distance);
    }

    // Record the player's "movement" according to the current game speed.
    // Note that the player accumulates "distance," but never actually moves horiztonally from the left edge of the canvas.
    gameState.player.distance += gameState.gameSpeed;

    // Move the obstacles along according to the current game speed.
    // The #distanceFromPlayer property will be reflected when they are rendered.
    for (obstacle of gameState.obstacles) {
        obstacle.distanceFromPlayer -= gameState.gameSpeed;
    }
}

/* Return a value for the game speed based on the player's distance so far
   so that the game speeds up over time */
var calculateGameSpeed = function(x) {
    var seconds = x / 60; // Assuming 60 fps
    return Math.pow(1.05, seconds / 20) + seconds / 70 + 1;
};

/* Return the slowly decreasing gap between the top and bottom walls */
var getGapHeight = function() {
    return 1000000 / (gameState.player.distance) + (1.1 * PLAYER_SIZE); // Add player size so that it's always possible to go through the gap
}

var playerMovement = function() {
    p = gameState.player;
    if (p.yHeight >= 0) {
        p.yHeight += p.yVelocity; // Every tick, the player's vertical coordinate (height) changes due to its velocity.
        p.yVelocity -= GRAVITY; // Every tick, gravity deaccelerates the player, so subtract from velocity
        if (p.yHeight <= 0) { // If the player has hit the ground
            p.yVelocity = 0; // set velocity to 0
            p.yHeight = 0; // and height to 0
        } else if (p.yHeight > MAX_PLAYER_HEIGHT(canvas)) { // If the player has hit the ceiling
            p.yVelocity = 0; // stop vertical movement
            // And make sure the player is still entriely under the top of the canvas
            p.yHeight = MAX_PLAYER_HEIGHT(canvas) - PLAYER_SIZE
        }
    }
}

// A counter variable to keep track of the last time a wall was generated.
var lastGeneratedWall = -Infinity;
function updateWalls() {
    // If the player has moved sufficient (DISTANCE_BETWEEN_WALLS) pixels since the last wall was generated...
    if (gameState.player.distance - lastGeneratedWall >= DISTANCE_BETWEEN_WALLS) {
        gameState.obstacles.push(generateWall()); // ...generate a new one and add it the list of obstacles to render.
        lastGeneratedWall = gameState.player.distance; // Reset the counter variable to reflect that a wall was just generated.
    }

    // Prune the list of obstacles by filtering out any obstacles that have passed off-screen
    // to the left of the player and are no longer needed.
    gameState.obstacles = gameState.obstacles.filter(o => o.distanceFromPlayer > -FLOOR_X - OBSTACLE_WIDTH)
}

// Generate a new wall object.
function generateWall() {
    return {
        // The height coordinate may be between 25% and 50% of the canvas height, but within that range is pseudorandom.
        height: (0.25 + Math.random() / 2) * MAX_PLAYER_HEIGHT(canvas),
        // The distance from the player starts at the full width of the canvas. This will be updated each tick by stageMovement().
        distanceFromPlayer: MAX_DISTANCE_FROM_PLAYER(canvas),
        type: 'wall'
    }
}

// End the game if the player has hit a wall.
function detectCollisions() {
    var obstacle = gameState.obstacles[0]; // Find the closest obstacle (the first one in the list).
    var distToObstacle = obstacle.distanceFromPlayer; // Find the distance from the player.

    // Determine if the player's square is within the range of the wall's horizontal horizontal footprint.
    var passingThroughWall = distToObstacle <= PLAYER_SIZE && distToObstacle > -OBSTACLE_WIDTH; 

    // Identify the top and bottom vertical coordinates of the player and of the gap the player must go through.
    var playerTop = gameState.player.yHeight + PLAYER_SIZE;
    var playerBottom = gameState.player.yHeight;
    var gapTop = obstacle.height + (getGapHeight() / 2);
    var gapBottom = gapTop - getGapHeight();

    // Determine if the player is vertically within the gap.
    var isInGap = playerTop < gapTop && playerBottom > gapBottom;

    // If the player is horizontally within the wall, and they are vertically not in the gap,
    // then they must have collided with the wall, and the game must end.
    if (passingThroughWall && !isInGap) {
        endGame(); // End the game.
    }
}

// setInterval(() => {
//     gameState.obstacles.push(generateWall())
// }, 1000)

document.body.addEventListener('click', jump); // Jump when the user clicks.

window.onkeydown = function(e) { // Handle key presses.
    if (e.keyCode == 32) { // spacebar
        jump();
    } else if (e.keyCode == 13) { // return
        restartGameIfOver();
    }
};

// Handle the game's end.
function endGame() {
    gameState.gameOver = true;

    // If score was higher than past highscore, update highscore
    if (gameState.score > (window.localStorage.highscore || 0)) {
        window.localStorage.highscore = gameState.score;
    }
}

function restartGameIfOver() {
    if (!gameState.gameOver) return
    resetGameState()
    lastGeneratedWall = -Infinity;
}

var lastJump = -1;
function jump() {
    if (gameState.gameOver) return
    var time = Date.now();

    // If the player is trying to jump in quick successions (ie. twice in MIN_JUMP_COOLDOWN milliseconds),
    // disallow them from jumping.
    if (Math.abs(lastJump - time) < MIN_JUMP_COOLDOWN) {
        console.info('cooling down')
        console.info(lastJump - time)
        return;
    }

    // Otherwise, add a positive "jump velocity" to their velocity to make them move upward in the game.
    gameState.player.yVelocity = JUMP_VELOCITY; // make player start moving up

    // Save the current time (when the player last jumped) in order
    // to determine in the future if they are trying to jump too quickly.
    lastJump = time;
}
