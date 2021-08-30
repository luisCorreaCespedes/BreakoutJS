// Game parameters
const WIDTH = 400;
const HEIGHT = 500;
const PADDLE_SPD = 0.7;
const BALL_SPD = 0.5;

// Dimensions
const WALL = WIDTH/50;
const PADDLE_H = WALL;
const PADDLE_W = PADDLE_H * 6;
const BALL_SIZE = WALL;

// Colors
const COLOR_BGN = 'black';
const COLOR_WALL = 'gray';
const COLOR_PADDLE = 'brown';
const COLOR_BALL = 'white';

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
var ball, paddle;

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
    updateBall(timeDelta);

    // Draw
    drawBackgroud();
    drawWall();
    drawPaddle();
    drawBall();

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

// Draw ball
function drawBall() {
    ctx.fillStyle = COLOR_BALL;
    ctx.fillRect(ball.x - ball.w * 0.5, ball.y - ball.h * 0.5, ball.w, ball.h);
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
    ball = new Ball();
};

// Update the paddle
function updatePaddle(delta) {
    paddle.x += paddle.xv * delta;
    // Collision walls
    if (paddle.x < WALL + paddle.w * 0.5) {
        paddle.x = WALL + paddle.w * 0.5;
    } else if (paddle.x > canv.width -WALL - paddle.w * 0.5) {
        paddle.x = canv.width -WALL - paddle.w * 0.5;
    }
};

// Update the ball
function updateBall(delta) {
    ball.x += ball.xv * delta;
    ball.y += ball.yv * delta;
    // Move ball
    if (ball.yv == 0) {
        ball.x = paddle.x;
    }

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

// Settings ball
function Ball() {
    this.w = BALL_SIZE;
    this.h = BALL_SIZE;
    this.x = paddle.x;
    this.y = paddle.y - paddle.h / 2 - this.h / 2;
    this.spd = BALL_SPD * WIDTH;
    this.xv = 0;
    this.yv = 0;
};