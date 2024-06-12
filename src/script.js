// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restartButton');

    const gridSize = 20; // Tamanho da grade
    const canvasSize = 400;
    const snakeColor = 'green';

    let snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    // Frutas com suas cores
    let fruits = [];

    const maxBananas = 10; // Limite máximo de bananas
    let dx = gridSize;
    let dy = 0;
    let changingDirection = false;
    let gameOver = false;
    let score = 0;

    function clearCanvas() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnakePart(snakePart) {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function getRandomPosition() {
        return Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    }

    // Função para criar uma maçã em uma posição aleatória
    function createApple() {
        let appleX, appleY;
        do {
            appleX = getRandomPosition();
            appleY = getRandomPosition();
        } while (fruits.some(fruit => fruit.x === appleX && fruit.y === appleY));

        const apple = { x: appleX, y: appleY, type: 'apple', color: 'red' };
        fruits.push(apple);
    }

    // Função para criar uma banana em uma posição aleatória
    function createBanana() {
        let bananaX, bananaY;
        do {
            bananaX = getRandomPosition();
            bananaY = getRandomPosition();
        } while (fruits.some(fruit => fruit.x === bananaX && fruit.y === bananaY));

        const banana = { x: bananaX, y: bananaY, type: 'banana', color: 'yellow' };
        fruits.push(banana);
    }

    // Função para criar todas as frutas
    function createFruits() {
        createApple();
        createBanana();
    }

    function drawFruit(fruit) {
        ctx.fillStyle = fruit.color;
        ctx.fillRect(fruit.x, fruit.y, gridSize, gridSize);
    }

    function drawFruits() {
        fruits.forEach(drawFruit);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        snake.unshift(head);

        let ateFruit = false;
        fruits.forEach((fruit, index) => {
            if (head.x === fruit.x && head.y === fruit.y) {
                ateFruit = true;
                if (fruit.type === 'banana') {
                    gameOver = true; // A banana mata a cobra
                } else if (fruit.type === 'apple') {
                    // A maçã aumenta o tamanho da cobra
                    fruits.splice(index, 1); // Remove a fruta comida
                    createFruits(); // Cria uma nova fruta
                    score += 10; // Aumenta o score
                    scoreElement.textContent = `Score: ${score}`; // Atualiza o placar na tela
                }
            }
        });

        if (!ateFruit) {
            snake.pop();
        }
    }

    function changeDirection(event) {
        if (changingDirection) return;
        changingDirection = true;

        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = event.keyCode;
        const goingUp = dy === -gridSize;
        const goingDown = dy === gridSize;
        const goingRight = dx === gridSize;
        const goingLeft = dx === -gridSize;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -gridSize;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -gridSize;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = gridSize;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = gridSize;
        }
    }

    function checkCollision() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= canvas.width;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= canvas.height;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function removeExcessBananas() {
        fruits = fruits.filter(fruit => fruit.type !== 'banana');
    }

    function restartGame() {
        snake = [
            { x: 200, y: 200 },
            { x: 180, y: 200 },
            { x: 160, y: 200 }
        ];
        fruits = [];
        dx = gridSize;
        dy = 0;
        gameOver = false;
        score = 0;
        scoreElement.textContent = `Score: ${score}`; // Reinicia o placar na tela
        createFruits();
    }

    function gameLoop() {
        if (gameOver || checkCollision()) return;

        changingDirection = false;
        clearCanvas();
        drawFruits();
        moveSnake();
        drawSnake();
        if (fruits.filter(fruit => fruit.type === 'banana').length > maxBananas) {
            removeExcessBananas();
        }
    }

    document.addEventListener('keydown', changeDirection);
    createFruits();

    restartButton.addEventListener('click', restartGame);

    setInterval(gameLoop, 100);
});
