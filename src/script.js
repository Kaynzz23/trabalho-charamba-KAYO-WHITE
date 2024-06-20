// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restartButton');

    const gridSize = 20; // Tamanho da grade
    const canvasSize = 400;
    const snakeColor = 'green';

    let snake, dx, dy, changingDirection, gameOver, score, fruits;
    let gameInterval; // Variável para armazenar o intervalo do jogo

    // Função para inicializar o jogo
    function initializeGame() {
        snake = [
            { x: 200, y: 200 },
            { x: 180, y: 200 },
            { x: 160, y: 200 }
        ];
        dx = gridSize;
        dy = 0;
        changingDirection = false;
        gameOver = false;
        score = 0;
        fruits = [
            { x: getRandomPosition(), y: getRandomPosition(), emoji: '🍎', type: 'fruit' },
            { x: getRandomPosition(), y: getRandomPosition(), emoji: '🍔', type: 'banana' }
        ];
        scoreElement.textContent = `Score: ${score}`;
    }

    function clearCanvas() {
        ctx.fillStyle = '#eee';
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

    function createFruit() {
        let fruitX, fruitY;
        do {
            fruitX = getRandomPosition();
            fruitY = getRandomPosition();
        } while (fruits.some(fruit => fruit.x === fruitX && fruit.y === fruitY));

        const isBanana = Math.random() < 0.25; // 25% de chance de gerar uma banana
        const fruit = {
            x: fruitX,
            y: fruitY,
            emoji: isBanana ? '🍔' : getRandomFruitEmoji(),
            type: isBanana ? 'banana' : 'fruit'
        };

        fruits.push(fruit);
    }

    function getRandomFruitEmoji() {
        const fruitEmojis = ['🍎', '🍊, '🍒', '🍓']; // Lista de emojis de frutas saudáveis
        return fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
    }

    function drawFruit(fruit) {
        ctx.font = '20px Arial';
        ctx.fillText(fruit.emoji, fruit.x, fruit.y + gridSize);
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
                } else {
                    // Fruta saudável aumenta o tamanho da cobra
                    fruits.splice(index, 1);
                    createFruit();
                    score += 10;
                    scoreElement.textContent = `Score: ${score}`;
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
        const maxBananas = 10;
        const bananaCount = fruits.filter(fruit => fruit.type === 'banana').length;
        if (bananaCount > maxBananas) {
            fruits = fruits.filter(fruit => fruit.type !== 'banana');
        }
    }

    function restartGame() {
        clearInterval(gameInterval); // Para o loop do jogo
        initializeGame(); // Reinicializa os parâmetros do jogo
        gameLoop(); // Reinicia o loop do jogo
    }

    function gameLoop() {
        if (gameOver || checkCollision()) {
            clearInterval(gameInterval); // Para o jogo se acabar
            return;
        }

        changingDirection = false;
        clearCanvas();
        drawFruits();
        moveSnake();
        drawSnake();

        removeExcessBananas();

        gameInterval = setTimeout(gameLoop, 100); // Ajusta a velocidade do jogo
    }

    document.addEventListener('keydown', changeDirection);
    restartButton.addEventListener('click', restartGame);

    initializeGame(); // Inicializa o jogo na primeira execução
    gameLoop(); // Inicia o loop do jogo
});
