// Definition of HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const pauseText = document.getElementById('pause-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const moveSound = new Audio('static/move.mp3');
const hitSound = new Audio('static/hit.mp3');
const gameOverSound = new Audio('static/game_over.mp3');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let gamePaused = false;

// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate food
function generateFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1,
        };
    } while (isPositionOnSnake(newFoodPosition));
    return newFoodPosition;
}

// Check if the position is on the snake
function isPositionOnSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

// Move snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            if (!gamePaused) {
                move();
                checkCollision();
                draw();
            }
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// Start game
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        if (!gamePaused) {
            move();
            checkCollision();
            draw();
        }
    }, gameSpeedDelay);
}

// Pause game
function pauseGame() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseText.style.display = 'block';
    } else {
        pauseText.style.display = 'none';
    }
}

// Keypress event listener
function handleKeyPress(event) {
    if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
        startGame();
    } else if (event.code === 'KeyP' || event.key === 'p') {
        pauseGame();
    } else if (!gamePaused) {
        switch (event.key) {
            case 'ArrowUp':
            case 'W':
            case 'w':
                if (direction !== 'down') {
                    direction = 'up';
                    moveSound.play();
                }
                break;
            case 'ArrowDown':
            case 'S':
            case 's':
                if (direction !== 'up') {
                    direction = 'down';
                    moveSound.play();
                }
                break;
            case 'ArrowLeft':
            case 'A':
            case 'a':
                if (direction !== 'right') {
                    direction = 'left';
                    moveSound.play();
                }
                break;
            case 'ArrowRight':
            case 'D':
            case 'd':
                if (direction !== 'left') {
                    direction = 'right';
                    moveSound.play();
                }
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        hitSound.play();
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            hitSound.play();
            resetGame();
        }
    }
}

function resetGame() {
    gameOverSound.play();
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
    gameStarted = false;
    gamePaused = false;
    instructionText.style.display = 'block';
    pauseText.style.display = 'none';
    logo.style.display = 'block';
}

// Update the score display
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
}

// Update the high score display
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }

    highScoreText.style.display = 'block';
}

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2000)});
