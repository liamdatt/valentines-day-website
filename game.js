const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Constants
const WIDTH = 800;
const HEIGHT = 600;
const BALL_RADIUS = 10;
const HOLE_RADIUS = 15;
const FRICTION = 0.99;
const SPEED_FACTOR = 0.05;
const VISUAL_FACTOR = 0.1;

// Levels definition
const levels = [
    // Level 1: Basic layout with walls
    {
        ballPos: { x: 100, y: 300 },
        holePos: { x: 700, y: 300 },
        obstacles: [
            { x: 0, y: 0, width: 800, height: 10 },   // Top wall
            { x: 0, y: 590, width: 800, height: 10 }, // Bottom wall
            { x: 0, y: 0, width: 10, height: 600 },   // Left wall
            { x: 790, y: 0, width: 10, height: 600 }  // Right wall
        ]
    },
    // Level 2: Adds middle obstacles
    {
        ballPos: { x: 100, y: 300 },
        holePos: { x: 700, y: 300 },
        obstacles: [
            { x: 0, y: 0, width: 800, height: 10 },
            { x: 0, y: 590, width: 800, height: 10 },
            { x: 0, y: 0, width: 10, height: 600 },
            { x: 790, y: 0, width: 10, height: 600 },
            { x: 300, y: 200, width: 50, height: 200 }, // Middle obstacle 1
            { x: 500, y: 200, width: 50, height: 200 }  // Middle obstacle 2
        ]
    },
    // Level 3: More complex obstacles
    {
        ballPos: { x: 100, y: 300 },
        holePos: { x: 700, y: 300 },
        obstacles: [
            { x: 0, y: 0, width: 800, height: 10 },
            { x: 0, y: 590, width: 800, height: 10 },
            { x: 0, y: 0, width: 10, height: 600 },
            { x: 790, y: 0, width: 10, height: 600 },
            { x: 200, y: 100, width: 50, height: 400 }, // Long vertical
            { x: 400, y: 0, width: 50, height: 300 },   // Top obstacle
            { x: 400, y: 400, width: 50, height: 200 }, // Bottom obstacle
            { x: 600, y: 100, width: 50, height: 400 }  // Final vertical
        ]
    }
];

// Game state variables
let currentLevel = 0;
let totalStrokes = 0;
let ballX, ballY, holeX, holeY, obstacles;
let ballVx = 0, ballVy = 0;
let aiming = false;
let ballMoving = false;
let gameState = 'playing';
let mousePos = { x: 0, y: 0 };

// Load a level
function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    ballX = level.ballPos.x;
    ballY = level.ballPos.y;
    holeX = level.holePos.x;
    holeY = level.holePos.y;
    obstacles = level.obstacles;
    ballVx = 0;
    ballVy = 0;
    ballMoving = false;
    aiming = false;
}

// Utility function for distance
function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

// Collision detection between circle (ball) and rectangle (obstacle)
function circleRectCollision(cx, cy, radius, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) < (radius * radius);
}

// Event listeners
canvas.addEventListener('mousedown', (event) => {
    if (gameState !== 'playing' || ballMoving) return;
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    if (distance(mouseX, mouseY, ballX, ballY) < BALL_RADIUS) {
        aiming = true;
    }
});

canvas.addEventListener('mousemove', (event) => {
    mousePos.x = event.offsetX;
    mousePos.y = event.offsetY;
});

canvas.addEventListener('mouseup', (event) => {
    if (aiming) {
        aiming = false;
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        const shotDx = ballX - mouseX;
        const shotDy = ballY - mouseY;
        ballVx = shotDx * SPEED_FACTOR;
        ballVy = shotDy * SPEED_FACTOR;
        ballMoving = true;
        totalStrokes += 1;
    }
});

document.addEventListener('keydown', (event) => {
    if (gameState === 'level_complete' && event.key === ' ') {
        currentLevel += 1;
        if (currentLevel < levels.length) {
            loadLevel(currentLevel);
            gameState = 'playing';
        } else {
            gameState = 'game_over';
        }
    }
});

// Game loop
function gameLoop() {
    // Clear the canvas
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = 'green';
    context.fillRect(0, 0, WIDTH, HEIGHT);

    if (gameState === 'playing') {
        // Update ball position if moving
        if (ballMoving) {
            ballX += ballVx;
            ballY += ballVy;
            ballVx *= FRICTION;
            ballVy *= FRICTION;

            // Check collisions with obstacles
            for (const obstacle of obstacles) {
                if (circleRectCollision(ballX, ballY, BALL_RADIUS, obstacle)) {
                    const overlapX = Math.min(
                        ballX + BALL_RADIUS - obstacle.x,
                        (obstacle.x + obstacle.width) - (ballX - BALL_RADIUS)
                    );
                    const overlapY = Math.min(
                        ballY + BALL_RADIUS - obstacle.y,
                        (obstacle.y + obstacle.height) - (ballY - BALL_RADIUS)
                    );
                    if (overlapX < overlapY) {
                        ballVx = -ballVx; // Bounce horizontally
                    } else {
                        ballVy = -ballVy; // Bounce vertically
                    }
                }
            }

            // Check if ball is in the hole
            if (distance(ballX, ballY, holeX, holeY) < HOLE_RADIUS) {
                ballMoving = false;
                gameState = 'level_complete';
            }

            // Stop ball if speed is too low
            if (Math.hypot(ballVx, ballVy) < 0.1) {
                ballMoving = false;
            }
        }

        // Draw obstacles
        context.fillStyle = 'gray';
        for (const obstacle of obstacles) {
            context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        // Draw hole
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(holeX, holeY, HOLE_RADIUS, 0, Math.PI * 2);
        context.fill();

        // Draw ball
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
        context.fill();

        // Draw aiming line
        if (aiming) {
            const shotDx = ballX - mousePos.x;
            const shotDy = ballY - mousePos.y;
            const lineEndX = ballX + shotDx * VISUAL_FACTOR;
            const lineEndY = ballY + shotDy * VISUAL_FACTOR;
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(ballX, ballY);
            context.lineTo(lineEndX, lineEndY);
            context.stroke();
        }

        // Draw UI text
        context.fillStyle = 'black';
        context.font = '36px Arial';
        context.fillText(`Level: ${currentLevel + 1}`, 10, 40);
        context.fillText(`Strokes: ${totalStrokes}`, 10, 80);
    } else if (gameState === 'level_complete') {
        context.fillStyle = 'black';
        context.font = '36px Arial';
        context.fillText('Level completed! Press space to continue.', WIDTH / 2 - 250, HEIGHT / 2);
    } else if (gameState === 'game_over') {
        context.fillStyle = 'black';
        context.font = '36px Arial';
        context.fillText(`Game Over. Total strokes: ${totalStrokes}`, WIDTH / 2 - 200, HEIGHT / 2);
    }

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Initialize and start the game
loadLevel(0);
gameLoop();