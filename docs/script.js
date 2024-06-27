document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const fullscreenButton = document.getElementById('fullscreenButton');

    const aspectRatio = 16 / 9; // Razão de aspecto desejada
    let canvasWidth, canvasHeight;

    const gridSize = 20; // Tamanho da grade
    const skullEmoji = '💀'; // Emoji de caveira
    const boneEmoji = '🦴'; // Emoji de osso

    let snake, dx, dy, changingDirection, gameOver, score, fruits;
    let gameInterval; // Variável para armazenar o intervalo do jogo

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
        fruits = [];
        createFruit('fruit'); // Cria uma fruta saudável
        scoreElement.textContent = `Score: ${score}`;
    }

    function clearCanvas() {
        ctx.fillStyle = '#e6ece1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        if (gameOver) {
            // Desenha uma caveira no lugar da cabeça da cobra
            ctx.font = '20px Arial';
            ctx.fillText(skullEmoji, snake[0].x, snake[0].y + gridSize);

            // Desenha ossos no restante do corpo da cobra
            for (let i = 1; i < snake.length; i++) {
                ctx.fillText(boneEmoji, snake[i].x, snake[i].y + gridSize);
            }
        } else {
            snake.forEach(part => {
                ctx.fillStyle = 'green';
                ctx.fillRect(part.x, part.y, gridSize, gridSize);
            });
        }
    }

    function getRandomPosition() {
        return Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    }

    function createFruit(type) {
        let fruitX, fruitY;
        do {
            fruitX = getRandomPosition();
            fruitY = getRandomPosition();
        } while (fruits.some(fruit => fruit.x === fruitX && fruit.y === fruitY));

        const fruit = {
            x: fruitX,
            y: fruitY,
            emoji: type === 'banana' ? getRandomBananaEmoji() : getRandomFruitEmoji(),
            type: type
        };

        fruits.push(fruit);

        // Se a fruta criada for uma fruta saudável, decide aleatoriamente quantas bananas criar (entre 1 e 2)
        if (type === 'fruit') {
            const numberOfBananas = Math.random() < 0.5 ? 1 : 2; // Decide aleatoriamente entre 1 ou 2 bananas
            for (let i = 0; i < numberOfBananas; i++) {
                createFruit('banana');
            }
        }
    }

    function getRandomFruitEmoji() {
        const fruitEmojis = ['🍎', '🍏', '🍒', '🍓']; // Lista de emojis de frutas saudáveis
        return fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
    }

    function getRandomBananaEmoji() {
        const bananaEmojis = ['🍟', '🌭', '🍔', '🍕']; // Emojis de bananas variantes
        return bananaEmojis[Math.floor(Math.random() * bananaEmojis.length)];
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
                    createFruit('fruit'); // Cria uma nova fruta saudável
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
        const keyPressed = event.keyCode;
        const SPACE_KEY = 32;

        if (keyPressed === SPACE_KEY) {
            restartGame(); // Chama a função para reiniciar o jogo imediatamente
            return; // Não checa mais direções se for espaço
        }

        if (changingDirection) return;
        changingDirection = true;

        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

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

    function restartGame() {
        clearInterval(gameInterval); // Para o loop do jogo
        initializeGame(); // Reinicializa os parâmetros do jogo
        gameLoop(); // Reinicia o loop do jogo
    }

    function gameLoop() {
        if (gameOver || checkCollision()) {
            gameOver = true; // Marca o jogo como encerrado
            clearInterval(gameInterval); // Para o jogo se acabar
            clearCanvas(); // Limpa o canvas para apagar a cobra
            drawSnake(); // Desenha apenas os ossos
            return;
        }

        changingDirection = false;
        clearCanvas();
        drawFruits();
        moveSnake();
        drawSnake();

        gameInterval = setTimeout(gameLoop, 100); // Ajusta a velocidade do jogo
    }

    document.addEventListener('keydown', changeDirection);
    fullscreenButton.addEventListener('click', toggleFullScreen);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Erro ao tentar entrar em tela cheia: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Inicializa o jogo na primeira execução
    initializeGame();
    gameLoop(); // Inicia o loop do jogo
});
