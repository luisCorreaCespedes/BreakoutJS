// Game parameters
const WIDTH = 400;
const HEIGHT = 500;
const PADDLE_SPD = 0.7;

// Dimensions
const WALL = WIDTH/50;
const PADDLE_H = WALL;
const PADDLE_W = PADDLE_H * 6;

// Colors
const COLOR_BGN = 'black';
const COLOR_WALL = 'gray';
const COLOR_PADDLE = 'brown';

// Directions
const Direction = {
    LEFT: 0,
    RIGHT: 1,
    STOP: 2
};

// Canvas settings
var canv = document.createElement('canvas');
canv.width = WIDTH;
canv.height = HEIGHT;
document.body.appendChild(canv);
var ctx = canv.getContext('2d');
ctx.lineWidth = WALL;

// Game variables
var paddle;

// Start a new game
newGame();

// Events
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Game loop
var timeDelta, timeLast;
requestAnimationFrame(loop);

function loop(timeNow) {
    if (!timeLast) {
        timeLast = timeNow;
    }

    timeDelta = (timeNow - timeLast) / 1000;
    timeLast = timeNow;

    // Update
    updatePaddle(timeDelta);

    // Draw
    drawBackgroud();
    drawWall();
    drawPaddle();

    // Next loop
    requestAnimationFrame(loop);
};

// Draw background board
function drawBackgroud() {
    ctx.fillStyle = COLOR_BGN;
    ctx.fillRect(0, 0, canv.width, canv.height);
};

// Draw walls
function drawWall() {
    let hwall = WALL * 0.5;
    ctx.strokeStyle = COLOR_WALL;
    ctx.beginPath();
    ctx.moveTo(hwall, HEIGHT);
    ctx.lineTo(hwall, hwall);
    ctx.lineTo(WIDTH - hwall, hwall);
    ctx.lineTo(WIDTH - hwall, HEIGHT);
    ctx.stroke();
};

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = COLOR_PADDLE;
    ctx.fillRect(paddle.x - paddle.w * 0.5, paddle.y - paddle.h * 0.5, paddle.w, paddle.h);
};

// Controls paddle
function keyDown(ev) {
    switch(ev.keyCode) {
        // Move left
        case 37:
            movePaddle(Direction.LEFT);
            break;
        // Move right
        case 39:
            movePaddle(Direction.RIGHT);
            break;
    }
};

function keyUp(ev) {
    switch(ev.keyCode) {
        // Stop moving left
        case 37:
        // Stop moving right
        case 39:
            movePaddle(Direction.STOP);
            break;
    }
};

// Move paddle
function movePaddle(direction) {
    switch (direction) {
        case Direction.LEFT:
            paddle.xv = -paddle.spd;
            break;
        case Direction.RIGHT:
            paddle.xv = paddle.spd;
            break;
        case Direction.STOP:
            paddle.xv = 0;
            break;
    }
};

// New paddle
function newGame() {
    paddle = new Paddle();
};

// Update the paddle
function updatePaddle(delta) {
    paddle.x += paddle.xv * delta;
};

// Settings paddle
function Paddle() {
    this.w = PADDLE_W;
    this.h = PADDLE_H;
    this.x = canv.width / 2;
    this.y = canv.height - this.h * 3;
    this.spd = PADDLE_SPD * WIDTH;
    this.xv = 0;
};