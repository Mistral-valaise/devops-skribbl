// Game state
let currentDifficulty = 'easy';
let words = { easy: [], medium: [], hard: [] };
let currentWord = '';
let wordVisible = true;
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let brushSize = 5;

// Load words from JSON file
async function loadWords() {
    try {
        const response = await fetch('words.json');
        words = await response.json();
    } catch (error) {
        console.error('Error loading words:', error);
        // Fallback words if JSON loading fails
        words = {
            easy: ['Docker', 'Kubernetes', 'Git', 'Pipeline', 'Container'],
            medium: ['Microservices', 'CI/CD', 'Auto Scaling', 'Load Balancer'],
            hard: ['Distributed Tracing', 'Service Level Indicator', 'Chaos Engineering']
        };
    }
}

// Initialize the game
async function init() {
    await loadWords();
    setupCanvas();
    setupColorPalette();
    setupBrushSize();
}

// Setup canvas
function setupCanvas() {
    canvas = document.getElementById('drawing-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Setup drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

// Setup color palette
function setupColorPalette() {
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.dataset.color;
        });
    });
    // Set first color as active
    if (colorButtons.length > 0) {
        colorButtons[0].classList.add('active');
    }
}

// Setup brush size
function setupBrushSize() {
    const brushSizeInput = document.getElementById('brush-size');
    brushSizeInput.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
    });
}

// Start game with selected difficulty
function startGame(difficulty) {
    currentDifficulty = difficulty;
    document.getElementById('menu-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // Update difficulty badge
    const badge = document.getElementById('difficulty-badge');
    badge.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    badge.className = 'badge ' + difficulty;
    
    nextWord();
    clearCanvas();
}

// Get next word
function nextWord() {
    const wordList = words[currentDifficulty];
    if (wordList && wordList.length > 0) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        currentWord = wordList[randomIndex];
        const wordElement = document.getElementById('current-word');
        wordElement.textContent = currentWord;
        // Reset word visibility to visible state
        wordElement.style.filter = 'none';
        wordElement.style.userSelect = 'auto';
        wordVisible = true;
    }
}

// Toggle word visibility
function toggleWord() {
    const wordElement = document.getElementById('current-word');
    if (wordVisible) {
        wordElement.style.filter = 'blur(10px)';
        wordElement.style.userSelect = 'none';
    } else {
        wordElement.style.filter = 'none';
        wordElement.style.userSelect = 'auto';
    }
    wordVisible = !wordVisible;
}

// Back to menu
function backToMenu() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('menu-screen').classList.add('active');
    clearCanvas();
}

// Clear canvas
function clearCanvas() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
