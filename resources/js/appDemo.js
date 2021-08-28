/*

--------------------------------------------------
This is the beta version, but i can't completed
because the coliisions isn't good. I make a new
Breakout, but this, is a retro style (ATARI).
--------------------------------------------------

// Load background
const bgImage = new Image();
bgImage.src = './resources/img/back.png';

// Constants and variables
const cvs = document.getElementById('breakout');
const ctx = cvs.getContext('2d');

cvs.style.border = '2px solid #fff';

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;

let LIFE = 3;

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

// Draw the paddle
function drawPaddle() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

// Draw the ball
function drawBall() {
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
    
};

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

// Move the paddle
function movePaddle() {
    if (rightMove && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftMove && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
};

// Ball movement
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
};

// Ball and wall collision
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--; //Lose life
        resetPaddle();
        resetBall();
    }
};

// Ball and paddle collision
function ballPaddleColiision() {
    if (ball.x < paddle.x + paddle.width &&
        ball.x > paddle.x &&
        paddle.y < paddle.y + paddle.height &&
        ball.y > paddle.y) {

        // Check where the ball hit the paddle
        let collidePoint = ball.x - (paddle.x + paddle.width/2);

        // Normalize the values
        collidePoint = collidePoint / (paddle.width/2);

        // Calculate the angle of the ball
        let angle = collidePoint * Math.PI/3;
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
};


// Reset the paddle
function resetPaddle() {
    paddle.x = cvs.width/2 - PADDLE_WIDTH/2,
    paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    paddle.dx = 5
};

// Reset the ball
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
};

// Draw elements to board
function draw() {
    drawPaddle();
    drawBall();
};

// Update game
function updateGame() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleColiision();
};

// Game loop
function loop() {
    ctx.drawImage(bgImage, 0, 0);
    draw();
    updateGame();
    requestAnimationFrame(loop);
};

loop();

*/