// Constants and variables
const cvs = document.getElementById('breakout');
const ctx = cvs.getContext('2d');

cvs.style.border = '2px solid #fff';

const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;

let leftMove = false;
let rightMove = false;

// Create the paddle
const paddle = {
    x: cvs.width/2 - PADDLE_WIDTH/2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5
};

// Create the ball
const ball = {
    x: cvs.width/2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3,
    dy: -3
};

// Draw paddle function
function drawPaddle() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball function
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball, radius, 0, Math.PI*2);
}

// Controls for paddle
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37 || event.keyCode == 65) {
        leftMove = true;
    }else if (event.keyCode == 39 || event.keyCode == 68) {
        rightMove = true;
    }
});
document.addEventListener('keyup', function(event) {
    if (event.keyCode == 37 || event.keyCode == 65) {
        leftMove = false;
    }else if (event.keyCode == 39 || event.keyCode == 68) {
        rightMove = false;
    }
});

// Move paddle function
function movePaddle() {
    if (rightMove && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftMove && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

// Insert paddle to canvas function
function insertPaddle() {
    drawPaddle();
}

// Update game function
function updateGame() {
    movePaddle();
}

// Game loop
function loop() {
    ctx.drawImage(bgImage, 0, 0);
    insertPaddle();
    updateGame();
    requestAnimationFrame(loop);
}

loop();