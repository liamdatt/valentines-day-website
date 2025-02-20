// List of 5-letter words (100 words for variety)
const word_list = [
    "APPLE", "BREAD", "CRANE", "DREAM", "ELDER", "FLAME", "GRACE", "HONEY", "IVORY", "JOKER",
    "KNEEL", "LEMON", "MANGO", "NERVE", "OCEAN", "PEARL", "QUICK", "RIVER", "SHADE", "TIGER",
    "UNDER", "VIVID", "WHEAT", "XENON", "YEAST", "ZEBRA", "BLOOM", "CHASE", "DANCE", "EAGLE",
    "FROST", "GLEAM", "HOUND", "INLET", "JUDGE", "KNOCK", "LATCH", "MOUSE", "NIGHT", "OLIVE",
    "PAINT", "QUEST", "ROAST", "SCENE", "THORN", "UNITY", "VISTA", "WHALE", "YIELD", "ZESTY",
    "BLANK", "CHORD", "DRIFT", "EMBER", "FLINT", "GHOST", "HASTE", "INDEX", "JOLLY", "KNIFE",
    "LAYER", "MIRTH", "NOBLE", "OPERA", "PLUSH", "RALLY", "SCOPE", "TRACE", "ULTRA", "VOGUE",
    "WRECK", "YOUNG", "ZIPPY", "BRICK", "CLOUD", "DIVER", "EXACT", "FLOCK", "GLORY", "HEART",
    "ISSUE", "JOINT", "KNEAD", "LUNAR", "MOUND", "NORTH", "PATCH", "RIDGE", "SHINE", "TOUCH",
    "VALUE", "WATCH", "XEROX", "YOUTH", "ZONAL", "BOOST", "CRAFT", "DROVE", "FAITH"
];

let target;
let current_row;
let current_guess;
let game_over;
let rows;
let cells;

// Initialize game state
function initWordle() {
    // Select random target word
    target = word_list[Math.floor(Math.random() * word_list.length)];
    current_row = 0;        // Tracks current attempt (0 to 5)
    current_guess = '';     // Current word being typed
    game_over = false;      // Game state flag

    // Get references to grid cells
    rows = document.querySelectorAll('#wordle-popup .row');
    cells = Array.from(rows).map(row => Array.from(row.querySelectorAll('.cell')));

    // Clear all cells
    cells.forEach(row => {
        row.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
    });

    // Clear message
    document.getElementById('message').textContent = '';
}

// Calculate feedback for a guess
function getFeedback(target, guess) {
    const feedback = new Array(5).fill(0);  // 0: gray, 1: yellow, 2: green
    const targetCount = {};

    // Count letters in target word
    for (let char of target) {
        targetCount[char] = (targetCount[char] || 0) + 1;
    }

    // First pass: Mark correct positions (green)
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            feedback[i] = 2;
            targetCount[guess[i]] -= 1;
        }
    }

    // Second pass: Mark correct letters in wrong positions (yellow)
    for (let i = 0; i < 5; i++) {
        if (feedback[i] === 0 && targetCount[guess[i]] > 0) {
            feedback[i] = 1;
            targetCount[guess[i]] -= 1;
        }
    }

    return feedback;
}

// Update the current row with the typed guess
function updateCurrentRow() {
    const rowCells = cells[current_row];
    for (let col = 0; col < 5; col++) {
        if (col < current_guess.length) {
            rowCells[col].textContent = current_guess[col];
            rowCells[col].className = 'cell';  // Reset to base style
        } else {
            rowCells[col].textContent = '';
            rowCells[col].className = 'cell';
        }
    }
}

// Process a submitted guess
function submitGuess() {
    if (current_guess.length === 5) {
        const feedback = getFeedback(target, current_guess);
        const rowCells = cells[current_row];
        
        // Apply feedback colors
        for (let col = 0; col < 5; col++) {
            rowCells[col].textContent = current_guess[col];
            if (feedback[col] === 2) {
                rowCells[col].classList.add('cell-green');
            } else if (feedback[col] === 1) {
                rowCells[col].classList.add('cell-yellow');
            } else {
                rowCells[col].classList.add('cell-gray');
            }
        }

        // Check win condition
        if (feedback.every(f => f === 2)) {
            showMessage("You win!");
            game_over = true;
        } else {
            current_row += 1;
            if (current_row === 6) {
                showMessage(`Game Over! The word was: ${target}`);
                game_over = true;
            }
            current_guess = '';
        }
    }
}

// Display game result message
function showMessage(msg) {
    document.getElementById('message').textContent = msg;
}

// Handle keyboard input for Wordle game
function handleWordleKeydown(event) {
    if (game_over) return;

    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        if (current_guess.length < 5) {
            current_guess += event.key.toUpperCase();
            updateCurrentRow();
        }
    } else if (event.key === 'Backspace') {
        if (current_guess.length > 0) {
            current_guess = current_guess.slice(0, -1);
            updateCurrentRow();
        }
    } else if (event.key === 'Enter') {
        if (current_guess.length === 5) {
            submitGuess();
        }
    }
}

// Open and close functions for the Wordle game popup
window.openWordle = function() {
    const popup = document.getElementById('wordle-popup');
    if (popup) {
        popup.style.display = 'flex';
        initWordle();
        // Add event listener
        document.addEventListener('keydown', handleWordleKeydown);
    }
};

window.closeWordle = function() {
    const popup = document.getElementById('wordle-popup');
    if (popup) {
        popup.style.display = 'none';
        // Remove event listener
        document.removeEventListener('keydown', handleWordleKeydown);
    }
}; 