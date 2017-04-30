// CONSTANTS
// -> state
const GRAVITY = 0.8;
const JUMP_VELOCITY = 10;
const MIN_JUMP_COOLDOWN = 100; // ms
const DISTANCE_BETWEEN_WALLS = 150; // px or frames
const CLOSE_TO_PLAYER_THRESHOLD = 200;
const SPEED_IN_FACTOR = 1/10;

// -> drawing
const FLOOR_X = 50; // px
const FLOOR_Y = 50; // px
const PLAYER_SIZE = 10;
const OBSTACLE_WIDTH = 35;
const OBSTACLE_GAP_HEIGHT = 100;

// GAME
var canvas, ctx;

canvas = document.getElementById('game-canvas');

function tick(t) {
    ctx = canvas.getContext('2d');
    draw(ctx, canvas);
    if (!gameState.gameOver) {
    	updateState();
    }
    requestAnimationFrame(tick);
}

window.addEventListener('resize', scaleCanvas);
window.addEventListener('load', scaleCanvas);

function scaleCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
