// Constants for layout
const WIDTH = 800;
const HEIGHT = 600;
const TITLE_Y = 50;
const THEME_Y = 100;
const WORD_YS = [150, 200, 250];
const GUESSES_Y = 350;
const INCORRECT_Y = 400;
const INPUT_LABEL_Y = 500;
const INPUT_BOX = { x: 200, y: 500, width: 400, height: 40 };
const BUTTONS = {
    restart: { x: 300, y: 400, width: 100, height: 40 },
    exit: { x: 500, y: 400, width: 100, height: 40 }
};

// Themes and words
const themes = {
    "Fruits": ["apple", "banana", "cherry", "date", "fig", "grape", "kiwi", "lemon", "mango", "orange",
               "peach", "pear", "plum", "raspberry", "strawberry", "watermelon", "apricot", "blueberry",
               "coconut", "durian", "elderberry", "guava", "honeydew", "jackfruit", "kumquat"],
    "Animals": ["dog", "cat", "elephant", "lion", "tiger", "bear", "zebra", "giraffe", "hippo", "rhino",
                "monkey", "panda", "kangaroo", "koala", "penguin", "dolphin", "shark", "octopus", "squid",
                "jellyfish", "crab", "lobster", "snail", "worm", "deer"],
    "Colors": ["red", "blue", "green", "yellow", "purple", "orange", "black", "white", "brown", "pink",
               "gray", "violet", "indigo", "turquoise", "magenta", "cyan", "beige", "maroon", "navy",
               "olive", "teal", "coral", "gold", "silver", "bronze"],
    "Vehicles": ["car", "truck", "bus", "train", "plane", "boat", "ship", "bicycle", "motorcycle", "van",
                 "taxi", "subway", "helicopter", "scooter", "tractor", "jet", "ferry", "yacht", "skateboard",
                 "ambulance", "firetruck", "bulldozer", "rocket", "canoe", "tank"],
    "Countries": ["brazil", "canada", "france", "germany", "india", "japan", "mexico", "russia", "spain",
                  "china", "italy", "korea", "norway", "sweden", "turkey", "egypt", "greece", "poland",
                  "thailand", "australia", "chile", "peru", "kenya", "ireland", "denmark"],
    "Sports": ["soccer", "basketball", "tennis", "baseball", "cricket", "golf", "rugby", "hockey", "boxing",
               "swimming", "cycling", "running", "volleyball", "wrestling", "skiing", "snowboarding",
               "badminton", "karate", "judo", "archery", "fencing", "rowing", "diving", "gymnastics", "polo"],
    "Foods": ["pizza", "burger", "pasta", "sushi", "taco", "salad", "soup", "sandwich", "steak", "curry",
              "noodle", "bread", "rice", "cake", "cookie", "pie", "fries", "chicken", "fish", "shrimp",
              "cheese", "chili", "stew", "pancake", "waffle"],
    "Clothing": ["shirt", "pants", "dress", "jacket", "coat", "hat", "scarf", "gloves", "socks", "shoes",
                 "boots", "sweater", "skirt", "tie", "belt", "vest", "shorts", "blouse", "hoodie", "jeans",
                 "robe", "sandals", "cap", "suit", "gown"],
    "Weather": ["rain", "snow", "wind", "cloud", "storm", "sunny", "fog", "thunder", "lightning", "hail",
                "breeze", "frost", "mist", "drizzle", "sleet", "tornado", "hurricane", "blizzard", "gale",
                "shower", "overcast", "humid", "clear", "tempest", "squall"],
    "Professions": ["doctor", "teacher", "engineer", "nurse", "chef", "pilot", "lawyer", "artist", "writer",
                    "farmer", "scientist", "mechanic", "soldier", "dentist", "plumber", "electrician", "actor",
                    "musician", "police", "firefighter", "architect", "driver", "clerk", "vet", "baker"],
    "Furniture": ["chair", "table", "sofa", "bed", "desk", "shelf", "cabinet", "lamp", "couch", "stool",
                  "dresser", "mirror", "bench", "bookcase", "wardrobe", "ottoman", "recliner", "futon",
                  "hammock", "cradle", "throne", "bunk", "cot", "chest", "stand"],
    "Instruments": ["guitar", "piano", "violin", "drum", "flute", "trumpet", "saxophone", "cello", "harp",
                    "clarinet", "bassoon", "trombone", "accordion", "banjo", "mandolin", "ukulele", "organ",
                    "horn", "oboe", "fiddle", "tambourine", "xylophone", "chimes", "bagpipe", "sitar"],
    "Plants": ["rose", "tulip", "daisy", "lily", "oak", "pine", "maple", "cactus", "fern", "bamboo",
               "orchid", "ivy", "palm", "willow", "birch", "cedar", "grass", "moss", "vine", "sunflower",
               "jasmine", "lavender", "aloe", "spruce", "heather"],
    "Tools": ["hammer", "screwdriver", "wrench", "drill", "saw", "pliers", "chisel", "axe", "shovel",
              "rake", "ladder", "tape", "nail", "bolt", "screw", "level", "clamp", "knife", "scissors",
              "trowel", "pickaxe", "crowbar", "spade", "file", "grinder"],
    "Cities": ["london", "paris", "tokyo", "newyork", "sydney", "berlin", "moscow", "rome", "madrid",
               "beijing", "seoul", "cairo", "athens", "bangkok", "dublin", "oslo", "vienna", "prague",
               "lisbon", "toronto", "mumbai", "chicago", "houston", "miami", "stockholm"]
};

// Game state variables
let canvas;
let ctx;
let selectedTheme;
let secretWords;
let guessedLetters = new Set();
let correctlyGuessedWords = new Set();
let letterGuesses = 0;
const maxLetterGuesses = 10;
let playerInput = "";
let gameState = 'playing'; // 'playing' or 'end'
let winMessage = "";

// Initialize the game
function initWordGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    startWordGame();
}

// Shuffle array function
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Get display string for a word
function getDisplayWord(word, guessedLetters, isGuessed) {
    if (isGuessed) {
        return word.split('').join(' ');
    } else {
        return word.split('').map(letter => guessedLetters.has(letter) ? letter : '_').join(' ');
    }
}

// Render the game state
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw title
    ctx.font = '48px Dancing Script';
    ctx.fillStyle = '#ff69b4';
    const title = "Word Mystery Game";
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (WIDTH - titleWidth) / 2, TITLE_Y);

    if (gameState === 'playing') {
        // Draw theme
        ctx.font = '24px Dancing Script';
        const themeText = `Theme: ${selectedTheme}`;
        const themeWidth = ctx.measureText(themeText).width;
        ctx.fillText(themeText, (WIDTH - themeWidth) / 2, THEME_Y);

        // Draw words
        ctx.font = '36px Dancing Script';
        secretWords.forEach((word, i) => {
            const isGuessed = correctlyGuessedWords.has(i);
            const displayStr = getDisplayWord(word, guessedLetters, isGuessed);
            const wordWidth = ctx.measureText(displayStr).width;
            ctx.fillText(displayStr, (WIDTH - wordWidth) / 2, WORD_YS[i]);
        });

        // Draw guesses used
        ctx.font = '24px Dancing Script';
        const guessesText = `Letter guesses used: ${letterGuesses}/${maxLetterGuesses}`;
        ctx.fillText(guessesText, 50, GUESSES_Y);

        // Draw incorrect letters
        const allLetters = new Set(secretWords.join(''));
        const incorrect = [...guessedLetters].filter(letter => !allLetters.has(letter)).sort().join(', ');
        const incorrectText = `Guessed letters not in any word: ${incorrect}`;
        ctx.fillStyle = '#ff69b4';
        ctx.fillText(incorrectText, 50, INCORRECT_Y);
        ctx.fillStyle = 'black';

        // Draw input label and box
        const label = "Guess:";
        ctx.fillText(label, 100, INPUT_LABEL_Y + 30);
        ctx.strokeStyle = '#ff69b4';
        ctx.strokeRect(INPUT_BOX.x, INPUT_BOX.y, INPUT_BOX.width, INPUT_BOX.height);
        ctx.fillText(playerInput, INPUT_BOX.x + 10, INPUT_BOX.y + 30);
    } else if (gameState === 'end') {
        // Draw fully revealed words
        ctx.font = '36px Dancing Script';
        secretWords.forEach((word, i) => {
            const displayStr = word.split('').join(' ');
            const wordWidth = ctx.measureText(displayStr).width;
            ctx.fillText(displayStr, (WIDTH - wordWidth) / 2, WORD_YS[i]);
        });

        // Draw win/lose message
        ctx.font = '24px Dancing Script';
        ctx.fillStyle = winMessage.includes('won') ? '#90EE90' : '#FFB6C1';
        const messageWidth = ctx.measureText(winMessage).width;
        ctx.fillText(winMessage, (WIDTH - messageWidth) / 2, 300);
        ctx.fillStyle = 'black';

        // Draw buttons
        ctx.fillStyle = '#ff69b4';
        ctx.fillRect(BUTTONS.restart.x, BUTTONS.restart.y, BUTTONS.restart.width, BUTTONS.restart.height);
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(BUTTONS.exit.x, BUTTONS.exit.y, BUTTONS.exit.width, BUTTONS.exit.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Dancing Script';
        ctx.fillText("Restart", BUTTONS.restart.x + 10, BUTTONS.restart.y + 30);
        ctx.fillText("Exit", BUTTONS.exit.x + 30, BUTTONS.exit.y + 30);
    }
}

// Process player's guess
function processGuess() {
    const guess = playerInput.trim().toLowerCase();
    playerInput = "";
    if (guess.length === 1 && /^[a-z]$/.test(guess)) {
        if (!guessedLetters.has(guess)) {
            guessedLetters.add(guess);
            letterGuesses++;
        }
    } else if (guess.length > 1) {
        secretWords.forEach((word, i) => {
            if (!correctlyGuessedWords.has(i) && word === guess) {
                correctlyGuessedWords.add(i);
                word.split('').forEach(letter => guessedLetters.add(letter));
            }
        });
    }
    // Check win or lose conditions
    if (correctlyGuessedWords.size === 3) {
        gameState = 'end';
        winMessage = "Congratulations! You won!";
    } else if (letterGuesses >= maxLetterGuesses) {
        gameState = 'end';
        winMessage = "Game Over! Try again!";
    }
    render();
}

// Start a new game
function startWordGame() {
    selectedTheme = Object.keys(themes)[Math.floor(Math.random() * Object.keys(themes).length)];
    const themeWords = themes[selectedTheme];
    secretWords = shuffle(themeWords).slice(0, 3);
    guessedLetters = new Set();
    correctlyGuessedWords = new Set();
    letterGuesses = 0;
    playerInput = "";
    gameState = 'playing';
    winMessage = "";
    render();
}

// Handle keyboard input
function handleKeydown(event) {
    if (gameState === 'playing') {
        if (event.key === 'Backspace') {
            playerInput = playerInput.slice(0, -1);
        } else if (event.key === 'Enter') {
            processGuess();
        } else if (/^[a-zA-Z]$/.test(event.key)) {
            playerInput += event.key.toLowerCase();
        }
        render();
    }
}

// Handle mouse clicks
function handleClick(event) {
    if (gameState === 'end') {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x >= BUTTONS.restart.x && x <= BUTTONS.restart.x + BUTTONS.restart.width &&
            y >= BUTTONS.restart.y && y <= BUTTONS.restart.y + BUTTONS.restart.height) {
            startWordGame();
        } else if (x >= BUTTONS.exit.x && x <= BUTTONS.exit.x + BUTTONS.exit.width &&
                   y >= BUTTONS.exit.y && y <= BUTTONS.exit.y + BUTTONS.exit.height) {
            window.closeWordGame();
        }
    }
}

// Open and close functions for the word game popup
window.openWordGame = function() {
    const popup = document.getElementById('word-game-popup');
    if (popup) {
        popup.style.display = 'flex';
        initWordGame();
        // Add event listeners
        document.addEventListener('keydown', handleKeydown);
        canvas.addEventListener('click', handleClick);
    }
};

window.closeWordGame = function() {
    const popup = document.getElementById('word-game-popup');
    if (popup) {
        popup.style.display = 'none';
        // Remove event listeners
        document.removeEventListener('keydown', handleKeydown);
        canvas.removeEventListener('click', handleClick);
    }
}; 