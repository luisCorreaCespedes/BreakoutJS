// Game parameters
const WIDTH = 400;
const HEIGHT = 500;
const PADDLE_SPD = 0.7;
const BALL_SPD = 0.6;
const BRICK_ROWS = 10;
const BRICK_COLS = 8;
const BRICK_GAP = 0.2;
const MARGIN = 0.1;
const MAX_LEVEL = 10; // Maximun game level (+2 rows per level)

// Dimensions
const WALL = WIDTH/50;
const PADDLE_H = WALL;
const PADDLE_W = PADDLE_H * 6;
const BALL_SIZE = WALL;
const BALL_SPIN = 0.4;

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
var bricks = [], level;

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
    updateBricks(timeDelta);

    // Draw
    drawBackgroud();
    drawWall();
    drawPaddle();
    drawBall();
    drawBricks();

    // Next loop
    requestAnimationFrame(loop);
};

// Apply ball speed
function applyBallSpeed(angle) {
    // Keep the angle to paddle
    if (angle < Math.PI / 6) {
        angle = Math.PI / 6;
    } else if (angle > Math.PI * 5 / 6) {
        angle = Math.PI * 5 / 6;
    }
    // Update the velocity of the ball
    ball.xv = ball.spd * Math.cos(angle);
    ball.yv = -ball.spd * Math.sin(angle);
};

// Create bricks
function createBricks() {
    // Row dimentions
    let minY = WALL;
    let maxY = ball.y - ball.h * 3.5;
    let totalSpaceY = maxY - minY;
    let totalRows = MARGIN + BRICK_ROWS + MAX_LEVEL * 2;
    let rowH = totalSpaceY / totalRows;
    let gap = WALL * BRICK_GAP;
    let h = rowH - gap;
    // Column dimentions
    let totalSpaceX = WIDTH - WALL * 2;
    let colW = (totalSpaceX - gap) / BRICK_COLS;
    let w = colW - gap;
    // Bricks array
    bricks = [];
    let cols = BRICK_COLS;
    let rows = BRICK_ROWS + level * 2;
    let color, left, top, rank, highestRank;
    highestRank = rows * 0.5 - 1;
    for (let i = 0; i < rows; i++) {
        bricks[i] = [];
        rank = Math.floor(i * 0.5);
        color = getBrickColor(rank, highestRank);
        top = WALL + (MARGIN + i) * rowH;
        for (let j = 0; j < cols; j++) {
            left = WALL + gap + j * colW;
            bricks[i][j] = new Brick(left, top, w, h, color);
        }
    }
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

// Draw bricks
function drawBricks() {
    for (let row of bricks) {
        for (let brick of row) {
            if (brick == null) {
                continue;
            }
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.left, brick.top, brick.w, brick.h);
        }
    }
};

// Set color bricks
// Red 0, Orange 0.33, Yellow 0.67, Green 1
function getBrickColor(rank, highestRank) {
    let fraction = rank / highestRank;
    let r, g, b = 0;
    // Red to orange to yellow
    if (fraction <= 0.67) {
        r = 255;
        g = 255 * fraction / 0.67;
    }
    // Yellow to green
    else {
        r = 255 * (1 - fraction) / 0.33;
        g = 255;
    }
    // Return rgb
    return "rgb(" + r + ", " + g + ", " + b + ")";
};

// Controls paddle
function keyDown(ev) {
    switch(ev.keyCode) {
        // Space (serve the ball)
        case 32:
            serveBall();
            break; 
        case 37:
            movePaddle(Direction.LEFT);
            break;
        case 65:
            movePaddle(Direction.LEFT);
            break;
        // Move right
        case 39:
            movePaddle(Direction.RIGHT);
            break;
        case 68:
            movePaddle(Direction.RIGHT);
            break;
    }
};

function keyUp(ev) {
    switch(ev.keyCode) {
        // Stop moving left
        case 37:
        case 65:
        // Stop moving right
        case 39:
        case 68:
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

// New game room
function newGame() {
    paddle = new Paddle();
    ball = new Ball();
    level = 0;
    createBricks();
};

// Ball out of board
function outOfBoard() {
    // Out of board
    newGame();
};

// Serve the ball
function serveBall() {
    // Ball already
    if (ball.yv != 0) {
        return;
    }
    // Random angle (45° and 135°)
    let angle = Math.random() * Math.PI / 2 + Math.PI / 4;
    applyBallSpeed(angle);
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
    // Bounce ball off the walls
    if (ball.x < WALL + ball.w * 0.5) {
        ball.x = WALL + ball.w * 0.5;
        ball.xv = -ball.xv;
    } else if (ball.x > canv.width - WALL - ball.w * 0.5) {
        ball.x = canv.width - WALL - ball.w * 0.5;
        ball.xv = -ball.xv;
    } else if (ball.y < WALL + ball.h * 0.5) {
        ball.y = WALL + ball.h * 0.5;
        ball.yv = -ball.yv;
    }
    // Bounce ball in the paddle
    if (ball.y > paddle.y - paddle.h * 0.5 - ball.h * 0.5
        && ball.y < paddle.y + paddle.h * 0.5
        && ball.x > paddle.x - paddle.w * 0.5 - ball.w * 0.5
        && ball.x < paddle.x + paddle.w * 0.5 + ball.w * 0.5) {
            ball.y = paddle.y - paddle.h * 0.5 - ball.h * 0.5;
            ball.yv = -ball.yv;
        // Modify the angle ball
        let angle = Math.atan2(-ball.yv, ball.xv);
        angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * BALL_SPIN;
        applyBallSpeed(angle);
    }
    // Out of board
    if (ball.y > canv.height) {
        outOfBoard();
    }
    // Move ball
    if (ball.yv == 0) {
        ball.x = paddle.x;
    }

};

// Update bricks
function updateBricks(delta) {
    // Check for ball collision
    OUTER: for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < BRICK_COLS; j++) {
            if (bricks[i][j] != null && bricks[i][j].intersect(ball)) {
                bricks[i][j] = null;
                ball.yv = -ball.yv;
                //Score
                break OUTER;
            }
        }
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

// Setting bricks
function Brick(left, top, w, h, color) {
    this.w = w;
    this.h = h;
    this.bot = top + h;
    this.left = left;
    this.right = left + w;
    this.top = top;
    this.color = color;
    this.intersect = function(ball) {
        let bBot = ball.y + ball.h * 0.5;
        let bLeft = ball.x - ball.w * 0.5;
        let bRight = ball.x + ball.w * 0.5;
        let bTop = ball.y - ball.h * 0.5;
        return this.left < bRight
        && bLeft < this.right
        && this.bot > bTop
        && bBot > this.top;
    }
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