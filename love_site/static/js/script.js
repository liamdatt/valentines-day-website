// ========== TRIVIA CONSTANTS ==========
const TRIVIA_QUESTIONS = [
    {
        question: "First Party that we both went to:",
        choices: ["FOF", "I Love Soca", "ZimiSehRiva", "Chill"],
        correctAnswer: 2
    },
    {
        question: "Day we started our streak:",
        choices: ["March 12, 2019", "December 17, 2018", "September 30, 2018", "June 12, 2019"],
        correctAnswer: 1
    },
    {
        question: "First time we had sex:",
        choices: ["June 30, 2021", "July 30, 2021", "June 12, 2021", "July 15, 2021"],
        correctAnswer: 3
    },
    {
        question: "When did Liam first start liking Vritti:",
        choices: ["Grade 11", "Grade 13", "Grade 10", "Grade 12"],
        correctAnswer: 2
    },
    {
        question: "How many times did Gabe hit Sonam's Car:",
        choices: ["One", "Three", "Two", "Zero"],
        correctAnswer: 2
    },
    {
        question: "When did Vritti first start liking Liam:",
        choices: ["First Year", "Grade 13", "Grade 12", "Still waiting"],
        correctAnswer: 2
    },
    {
        question: "Who was the teacher of the first form class we shared:",
        choices: ["Miss Webster", "Miss Atkins", "Miss Nicholson", "Miss Cuthburt"],
        correctAnswer: 2
    },
    {
        question: "Who taught the first class we had together:",
        choices: ["Miss Reynolds", "Miss Webster", "Mr Davis", "Miss Gardener"],
        correctAnswer: 0
    },
    {
        question: "Who changed the most after High school:",
        choices: ["David", "Miles", "Pierre", "Luna (#ALLY)"],
        correctAnswer: 3
    },
    {
        question: "In first year, when we went out for Halloween, which one of my friends terrorized your friends:",
        choices: ["Chris", "Cal", "Jack", "Matt"],
        correctAnswer: 2
    },
    {
        question: "When we went to Canada where was the first place we met up:",
        choices: ["Airport", "Dorm", "Eaton Center", "Avi's apartment"],
        correctAnswer: 2
    },
    {
        question: "First Date in Jamaica:",
        choices: ["Cru", "100", "Fridays", "Tacbar"],
        correctAnswer: 3
    },
    {
        question: "What is Vritti's funniest phrase ever said:",
        choices: ["A who dat Nutty Buddy", "Tell dem again Nutty Buddy", "A Your Buddy so Nutty", "Shut up Stupid Nigga"],
        correctAnswer: 1
    },
    {
        question: "What was James Husband's banger line:",
        choices: ["Guys i bought a 2k printer", "My names James", "thats seh u sein when bc u up to 😂", "thats sein u seh when u up to bc 😂"],
        correctAnswer: 3
    },
    {
        question: "Who was Liam's favourite roommate from Evelyn Wiggins:",
        choices: ["Sydney", "Armelle", "Joyline", "Nolan"],
        correctAnswer: 2
    },
    {
        question: "Most racist roommate from Evelyn Wiggins:",
        choices: ["Sydney", "Sydney", "Sydney", "Sydney"],
        correctAnswer: 0
    },
    {
        question: "Did avinash lose his virginity the first week in Canada:",
        choices: ["Yes", "N/A", "No", "N/A"],
        correctAnswer: 2
    },
    {
        question: "Who is Kar Kar:",
        choices: ["The Help", "Family", "The Dog", "Stranger"],
        correctAnswer: 1
    },
    {
        question: "Which of your friends do I think is the funniest:",
        choices: ["Kashish", "Demi", "Diya", "Joyline"],
        correctAnswer: 1
    },
    {
        question: "Is Liam a good investment advisor?",
        choices: ["N/A", "Yes, Hes the best", "This nigga lose me money", "N/A"],
        correctAnswer: 2
    },
    {
        question: "Liam's Favourite Date this year:",
        choices: ["Korean BBQ", "Chat Bar", "Sza Movie", "Greta"],
        correctAnswer: 0
    },
    {
        question: "Liam's Most Fun Date last year:",
        choices: ["Christmas Fair", "CNE", "Center Island", "Interstellar"],
        correctAnswer: 2
    },
    {
        question: "Sauciest Date last year:",
        choices: ["CNE", "Drake Hotel", "Birthday Drinks", "Strangers at the bar 🥵"],
        correctAnswer: 3
    },
    {
        question: "Who did Kiran think was the funniest at the beach that day:",
        choices: ["Liam", "Liam", "Liam", "Liam"],
        correctAnswer: 0
    }
];

// ========== TRIVIA STATE ==========
let currentQuestionIndex = 0;
let triviaScore = 0;

// ========== TRIVIA FUNCTIONS ==========
window.startTrivia = function() {
    console.log("Starting trivia game...");
    const popup = document.getElementById('trivia-popup');
    if (!popup) {
        console.error("No trivia popup element found!");
        return;
    }
    
    // Reset and show popup
    popup.style.display = 'flex';
    currentQuestionIndex = 0;
    triviaScore = 0;
    document.getElementById('trivia-score').textContent = triviaScore;
    
    // Display first question
    displayCurrentQuestion();
    console.log("Trivia game started successfully!");
};

function displayCurrentQuestion() {
    console.log("Displaying question:", currentQuestionIndex + 1);
    const questionContainer = document.querySelector('.trivia-question');
    const choicesContainer = document.querySelector('.trivia-choices');
    const currentQuestion = TRIVIA_QUESTIONS[currentQuestionIndex];
    
    if (!questionContainer || !choicesContainer) {
        console.error("Could not find question or choices container!");
        return;
    }
    
    // Display question
    questionContainer.textContent = currentQuestion.question;
    
    // Clear previous choices
    choicesContainer.innerHTML = '';
    
    // Add new choices
    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement('div');
        button.className = 'trivia-choice';
        button.textContent = choice;
        button.onclick = () => checkAnswer(index);
        choicesContainer.appendChild(button);
    });
    
    console.log("Question displayed successfully!");
}

function checkAnswer(choiceIndex) {
    const currentQuestion = TRIVIA_QUESTIONS[currentQuestionIndex];
    const choices = document.querySelectorAll('.trivia-choice');
    const message = document.getElementById('trivia-message');
    
    // Disable all choices
    choices.forEach(choice => choice.style.pointerEvents = 'none');
    
    // Show correct/incorrect
    choices[choiceIndex].classList.add(
        choiceIndex === currentQuestion.correctAnswer ? 'correct' : 'incorrect'
    );
    choices[currentQuestion.correctAnswer].classList.add('correct');
    
    // Update score
    if (choiceIndex === currentQuestion.correctAnswer) {
        triviaScore++;
        document.getElementById('trivia-score').textContent = triviaScore;
        message.classList.remove('hidden');
        setTimeout(() => message.classList.add('hidden'), 1500);
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < TRIVIA_QUESTIONS.length) {
            displayCurrentQuestion();
        } else {
            endTrivia();
        }
    }, 2000);
}

function endTrivia() {
    const questionContainer = document.querySelector('.trivia-question');
    const choicesContainer = document.querySelector('.trivia-choices');
    
    questionContainer.textContent = `Quiz Complete! You scored ${triviaScore} out of ${TRIVIA_QUESTIONS.length}!`;
    choicesContainer.innerHTML = `
        <div class="trivia-choice" onclick="startTrivia()">Play Again</div>
        <div class="trivia-choice" onclick="closeTrivia()">Close</div>
    `;
}

function closeTrivia() {
    const popup = document.getElementById('trivia-popup');
    popup.style.display = 'none';
}

// ========== GAME CONSTANTS ==========
const BOARD_WIDTH = 750;
const BOARD_HEIGHT = 250;
const DINO_WIDTH = 88;
const DINO_HEIGHT = 94;
const CACTUS_WIDTHS = [25, 50, 75];
const CACTUS_HEIGHT = 70;
const CACTUS_X = 700;
const CACTUS_Y = BOARD_HEIGHT - 70;
const VELOCITY_X = -6;
const GRAVITY = 0.6;
const JUMP_VELOCITY = -14;
const CACTUS_SPAWN_INTERVAL = 1500;
const CACTUS_SPAWN_CHANCE = 0.4;
const HITBOX_PADDING = 10;

// ========== CROSSWORD CONSTANTS ==========
const CROSSWORD_GRID = [
    [ {letter: 'H', number: 1}, {letter: 'E'}, {letter: 'A'}, {letter: 'R'}, {letter: 'T'} ],
    [ {letter: 'A', number: 2}, {letter: 'M'}, {letter: 'O'}, {letter: 'U'}, {letter: 'R'} ],
    [ {letter: 'S', number: 3}, {letter: 'W'}, {letter: 'E'}, {letter: 'E'}, {letter: 'T'} ],
    [ {letter: 'C', number: 4}, {letter: 'H'}, {letter: 'A'}, {letter: 'R'}, {letter: 'M'} ],
    [ {letter: 'H', number: 5}, {letter: 'O'}, {letter: 'N'}, {letter: 'E'}, {letter: 'Y'} ]
];

// ========== GAME STATE ==========
let board;
let context;
let gameStarted = false;
let gameOver = false;
let score = 0;

// ========== GAME ENTITIES ==========
let dino1 = {
    x: 50,
    y: BOARD_HEIGHT - DINO_HEIGHT,
    width: DINO_WIDTH,
    height: DINO_HEIGHT,
    velocityY: 0,
    img: null
};

let dino2 = {
    x: 50 - 50,
    y: BOARD_HEIGHT - DINO_HEIGHT,
    width: DINO_WIDTH,
    height: DINO_HEIGHT,
    velocityY: 0,
    img: null
};

let partnerHeadImg = null;
let youHeadImg = null;
let cactusArray = [];

// ========== GAME FUNCTIONS ==========
window.startGame = function() {
    const gameContainer = document.querySelector('.game-container');
    const gameOverScreen = document.getElementById("game-over");
    
    gameContainer.style.display = 'block';
    gameOverScreen.style.display = 'none';
    
    // Reset game state
    gameOver = false;
    gameStarted = true;
    score = 0;
    cactusArray = [];
    dino1.y = BOARD_HEIGHT - DINO_HEIGHT;
    dino2.y = BOARD_HEIGHT - DINO_HEIGHT;

    // Initialize game if not already initialized
    if (!board) {
        initGame();
    } else {
        requestAnimationFrame(update);
    }
};

function initGame() {
    board = document.getElementById("board");
    board.height = BOARD_HEIGHT;
    board.width = BOARD_WIDTH;
    context = board.getContext("2d");

    // Load images
    dino1.img = loadImage(GAME_ASSETS.dino);
    dino2.img = loadImage(GAME_ASSETS.dino);
    partnerHeadImg = loadImage(HEADS.partner);
    youHeadImg = loadImage(HEADS.you);

    // Start game loop
    document.addEventListener("keydown", moveDino);
    requestAnimationFrame(update);
    setInterval(placeCactus, CACTUS_SPAWN_INTERVAL);
}

function loadImage(path) {
    const img = new Image();
    img.src = path;
    return img;
}

function update() {
    if (!gameStarted || gameOver) return;
    
    context.clearRect(0, 0, board.width, board.height);
    
    // Update dinosaurs
    updateDino(dino1);
    updateDino(dino2);
    drawDino(dino1, partnerHeadImg);
    drawDino(dino2, youHeadImg);

    // Update cacti
    for (let i = cactusArray.length - 1; i >= 0; i--) {
        cactusArray[i].x += VELOCITY_X;
        context.drawImage(
            cactusArray[i].img, 
            cactusArray[i].x, 
            cactusArray[i].y, 
            cactusArray[i].width, 
            cactusArray[i].height
        );

        if (detectCollision(dino1, cactusArray[i]) || detectCollision(dino2, cactusArray[i])) {
            endGame();
            return;
        }

        // Remove off-screen cacti
        if (cactusArray[i].x < -cactusArray[i].width) {
            cactusArray.splice(i, 1);
        }
    }

    // Update score
    context.fillStyle = "black";
    context.font = "20px Courier";
    context.fillText(`Score: ${Math.floor(score / 10)}`, 5, 20);
    score++;

    requestAnimationFrame(update);
}

function updateDino(dino) {
    dino.velocityY += GRAVITY;
    dino.y = Math.min(dino.y + dino.velocityY, BOARD_HEIGHT - DINO_HEIGHT);
}

function drawDino(dino, headImg) {
    context.drawImage(dino.img, dino.x, dino.y, dino.width, dino.height);
    context.drawImage(headImg, dino.x + 40, dino.y - 20, 60, 50);
}

function moveDino(e) {
    if (gameOver) return;

    if ((e.code === "Space" || e.code === "ArrowUp") && dino1.y >= BOARD_HEIGHT - DINO_HEIGHT - 1) {
        dino1.velocityY = JUMP_VELOCITY;
        dino2.velocityY = JUMP_VELOCITY;
    }
}

function placeCactus() {
    if (gameOver) return;
    
    // Reduced spawn chance
    if (Math.random() > CACTUS_SPAWN_CHANCE) {
        const cactus = {
            img: new Image(),
            x: CACTUS_X,
            y: CACTUS_Y,
            width: CACTUS_WIDTHS[Math.floor(Math.random() * CACTUS_WIDTHS.length)],
            height: CACTUS_HEIGHT
        };
        
        cactus.img.src = GAME_ASSETS[`cactus${Math.floor(Math.random() * 3) + 1}`];
        cactusArray.push(cactus);
    }

    // Cleanup old cacti
    if (cactusArray.length > 4) {
        cactusArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x + HITBOX_PADDING < b.x + b.width - HITBOX_PADDING &&
           a.x + a.width - HITBOX_PADDING > b.x + HITBOX_PADDING &&
           a.y + HITBOX_PADDING < b.y + b.height - HITBOX_PADDING &&
           a.y + a.height - HITBOX_PADDING > b.y + HITBOX_PADDING;
}

function endGame() {
    gameOver = true;
    document.getElementById("game-over").style.display = "block";
}

// ========== DOM INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game if needed
    if (board) {
        initGame();
    }

    // Video Functions
    window.openVideo = function() {
        const popup = document.getElementById('video-popup');
        const video = document.getElementById('couple-video');
        if (popup && video) {
            popup.style.display = 'flex';
        }
    };

    window.closeVideo = function() {
        const popup = document.getElementById('video-popup');
        const video = document.getElementById('couple-video');
        if (popup && video) {
            popup.style.display = 'none';
            video.pause();
            video.currentTime = 0;
        }
    };

    // Initialize video event listeners
    const videoPopup = document.getElementById('video-popup');
    if (videoPopup) {
        videoPopup.addEventListener('click', (e) => {
            if (e.target === videoPopup) {
                window.closeVideo();
            }
        });
    }
});

// ========== EXPOSE FUNCTIONS ==========
window.toggleLetter = function() {
    const envelope = document.querySelector('.envelope');
    const letter = document.querySelector('.letter-content');
    
    envelope.classList.toggle('hidden');
    letter.classList.toggle('open');
    
    if (letter.classList.contains('open')) {
        document.addEventListener('click', closeLetterOnOutsideClick);
    } else {
        document.removeEventListener('click', closeLetterOnOutsideClick);
    }
};

function closeLetterOnOutsideClick(event) {
    const letterContainer = document.querySelector('.letter-container');
    if (!letterContainer.contains(event.target)) {
        window.toggleLetter();
    }
}

window.startCrossword = function() {
    // Hide other game containers if needed, but keep the crossword container visible
    document.querySelectorAll('.game-container').forEach(c => {
        if (c.id !== 'crossword-container') {
            c.style.display = 'none';
        }
    });
    // Show the crossword popup (set display to flex so that it's visible and layout is computed)
    const popup = document.getElementById('crossword-popup');
    if (!popup) {
        console.error("No crossword popup element found in HTML!");
        return;
    }
    popup.style.display = 'flex';
    
    // Set a timeout to ensure the popup layout is applied before creating the grid
    setTimeout(createCrossword, 100);
};

// ========== CROSSWORD FUNCTIONS ==========
function createCrossword() {
    console.log("Creating relationship crossword grid...");
    // Find the grid element inside the popup
    const grid = document.querySelector('#crossword-popup .crossword-grid');
    if (!grid) {
        console.error("Could not find the crossword grid element.");
        return;
    }
    
    // Clear any previous content
    grid.innerHTML = '';
    
    // Loop through the grid array and create each cell
    CROSSWORD_GRID.forEach((row, y) => {
        row.forEach((cell, x) => {
            const div = document.createElement('div');
            // if letter is a space, mark cell as black (empty)
            div.className = `crossword-cell ${cell.letter === ' ' ? 'black' : ''}`;
            
            // If there is a number, show it at the top-left of the cell
            if (cell.number) {
                const numberSpan = document.createElement('span');
                numberSpan.className = 'cell-number';
                numberSpan.textContent = cell.number;
                div.appendChild(numberSpan);
            }
            
            // If the cell is not a black (empty) cell, add an input for the letter
            if (cell.letter !== ' ') {
                const input = document.createElement('input');
                input.maxLength = 1;
                input.placeholder = '_'; // temporary placeholder to show the cell is there
                input.dataset.answer = cell.letter; // store correct answer
                input.addEventListener('input', highlightCorrect);
                div.appendChild(input);
            }
            
            grid.appendChild(div);
        });
    });
    
    console.log("Grid created. Total cells added:", grid.childElementCount);
}

function highlightCorrect(e) {
    const input = e.target;
    if (input.value.toUpperCase() === input.dataset.answer) {
        input.style.color = '#228B22';
        input.style.fontWeight = 'bold';
    } else {
        input.style.color = '#c71585';
        input.style.fontWeight = 'normal';
    }
}

function checkCrossword() {
    const allCorrect = [...document.querySelectorAll('.crossword-cell input')]
        .every(input => input.value.toUpperCase() === input.dataset.answer);
    
    const message = document.getElementById('crossword-message');
    message.style.display = allCorrect ? 'block' : 'none';
}

// Function to close the crossword popup
function closeCrossword() {
    const popup = document.getElementById('crossword-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}