// Only declare constants if they haven't been declared yet
if (typeof window.GOLF_CONSTANTS === 'undefined') {
    window.GOLF_CONSTANTS = {
        WIDTH: 800,
        HEIGHT: 600,
        BALL_RADIUS: 10,
        HOLE_RADIUS: 15,
        FRICTION: 0.99,
        SPEED_FACTOR: 0.05,
        VISUAL_FACTOR: 0.1
    };
}

// Use constants from the global object
const { WIDTH, HEIGHT, BALL_RADIUS, HOLE_RADIUS, FRICTION, SPEED_FACTOR, VISUAL_FACTOR } = window.GOLF_CONSTANTS;

console.log('Golf game script loaded');

// Game state variables
let canvas = null;
let context = null;
let currentLevel = 0;
let totalStrokes = 0;
let ballX, ballY, holeX, holeY, obstacles;
let ballVx = 0, ballVy = 0;
let aiming = false;
let ballMoving = false;
let gameState = 'playing';
let mousePos = { x: 0, y: 0 };
let gameLoop = null;

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

// Event handlers with debug logging
function handleMouseDown(event) {
    console.log('Mouse down detected at:', event.clientX, event.clientY);
    if (gameState !== 'playing' || ballMoving) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (distance(mouseX, mouseY, ballX, ballY) < BALL_RADIUS) {
        aiming = true;
        console.log('Aiming started');
    }
}

function handleMouseMove(event) {
    console.log('Mouse moving');
    const rect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - rect.left;
    mousePos.y = event.clientY - rect.top;
}

function handleMouseUp(event) {
    console.log('Mouse up detected');
    if (aiming) {
        aiming = false;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const shotDx = ballX - mouseX;
        const shotDy = ballY - mouseY;
        ballVx = shotDx * SPEED_FACTOR;
        ballVy = shotDy * SPEED_FACTOR;
        ballMoving = true;
        totalStrokes++;
        console.log('Shot fired with velocity:', ballVx, ballVy);
    }
}

function handleKeyDown(event) {
    if (gameState === 'level_complete' && event.key === ' ') {
        currentLevel++;
        if (currentLevel < levels.length) {
            loadLevel(currentLevel);
            gameState = 'playing';
        } else {
            gameState = 'game_over';
        }
    }
}

// Enhanced initialization function
function initGame() {
    console.log('Initializing golf game');
    canvas = document.getElementById('golfCanvas');
    if (!canvas) {
        console.error('Golf canvas not found');
        return;
    }

    context = canvas.getContext('2d');
    if (!context) {
        console.error('Failed to get 2D context');
        return;
    }

    // Log canvas dimensions to verify
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    currentLevel = 0;
    totalStrokes = 0;
    loadLevel(currentLevel);
    gameState = 'playing';

    // Remove any existing event listeners before adding new ones
    cleanup();

    // Add event listeners with error checking
    try {
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keydown', handleKeyDown);
        console.log('Event listeners attached successfully');
    } catch (e) {
        console.error('Failed to attach event listeners:', e);
    }

    // Start the game loop
    gameLoop = requestAnimationFrame(update);
    console.log('Game loop started');
}

// Improved update function with debug logging
function update() {
    if (!canvas || !context) {
        console.error('Canvas or context not initialized');
        return;
    }

    console.log('Game loop running'); // Verify loop is active
    // Clear the canvas
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = '#90EE90';
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
                        ballVx = -ballVx;
                    } else {
                        ballVy = -ballVy;
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
        context.fillStyle = '#666666';
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
            context.strokeStyle = '#ff69b4';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(ballX, ballY);
            context.lineTo(lineEndX, lineEndY);
            context.stroke();
        }

        // Draw UI text
        context.fillStyle = '#ff69b4';
        context.font = '24px Dancing Script';
        context.fillText(`Level: ${currentLevel + 1}`, 10, 30);
        context.fillText(`Strokes: ${totalStrokes}`, 10, 60);
    } else if (gameState === 'level_complete') {
        context.fillStyle = '#ff69b4';
        context.font = '36px Dancing Script';
        context.fillText('Level completed! Press space to continue.', WIDTH / 2 - 250, HEIGHT / 2);
    } else if (gameState === 'game_over') {
        context.fillStyle = '#ff69b4';
        context.font = '36px Dancing Script';
        context.fillText(`Game Over! Total strokes: ${totalStrokes}`, WIDTH / 2 - 200, HEIGHT / 2);
    }

    gameLoop = requestAnimationFrame(update);
}

// Improved cleanup function
function cleanup() {
    console.log('Cleaning up golf game');
    if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
    }
    document.removeEventListener('keydown', handleKeyDown);
    
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }

    // Reset game state
    canvas = null;
    context = null;
    currentLevel = 0;
    totalStrokes = 0;
    gameState = 'playing';
    ballMoving = false;
    aiming = false;
}

// Make functions globally available
window.initGame = initGame;
window.closeGolf = function() {
    console.log('Closing golf game');
    const popup = document.getElementById('golf-popup');
    if (popup) {
        popup.style.display = 'none';
        cleanup();
    }
};

// Export cleanup function globally
window.cleanupGolf = cleanup; 