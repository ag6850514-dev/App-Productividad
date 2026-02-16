let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let currentMode = 'focus';

const modes = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const body = document.body;
// Hourglass Elements
const timerVisual = document.querySelector('.timer-visual');
const sandTop = document.getElementById('sand-top');
const sandBottom = document.getElementById('sand-bottom');
const sandStream = document.getElementById('sand-stream');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timerDisplay.textContent} - Zen Pomodoro`;

    // Update Sand Animation
    if (sandTop && sandBottom) {
        const totalTime = modes[currentMode];
        const progress = timeLeft / totalTime; // 1.0 (start) to 0.0 (end)

        // Top Sand: Drops from top (y increases, height decreases)
        const topH = 150 * progress;
        const topY = 150 * (1 - progress);
        sandTop.setAttribute('y', topY);
        sandTop.setAttribute('height', topH);

        // Bottom Sand: Piles up (y decreases, height increases)
        const botH = 150 * (1 - progress);
        const botY = 150 + (150 * progress);
        sandBottom.setAttribute('y', botY);
        sandBottom.setAttribute('height', botH);
    }
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        startBtn.textContent = 'Iniciar';
    } else {
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timer);
                notifyEnd();
            }
        }, 1000);
        startBtn.textContent = 'Pausar';
        timerVisual.classList.add('running'); // Start stream
    }
    isRunning = !isRunning;
    if (!isRunning) timerVisual.classList.remove('running'); // Stop stream if paused
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = modes[currentMode];
    startBtn.textContent = 'Iniciar';
    timerVisual.classList.remove('running');
    updateDisplay();
}

function switchMode(mode) {
    currentMode = mode;

    // Update active button
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');

    // Update theme
    const colors = {
        focus: '#fbd38d', // Muted Orange
        short: '#fbb6ce', // Muted Pink
        long: '#bee3f8'  // Muted Blue
    };
    body.style.background = `linear-gradient(135deg, ${colors[mode]}cc 0%, #eef2f7 100%)`;

    resetTimer();
}

function notifyEnd() {
    isRunning = false;
    startBtn.textContent = 'Iniciar';
    alert('¡Tiempo cumplido! Tómate un respiro.');
}

// Task Logic
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
        <span>${text}</span>
        <div class="task-actions">
            <button class="task-btn" onclick="toggleTask(this)">✔️</button>
            <button class="task-btn" onclick="this.parentElement.parentElement.remove()">🗑️</button>
        </div>
    `;
    taskList.appendChild(li);
    taskInput.value = '';
}

function toggleTask(btn) {
    const li = btn.parentElement.parentElement;
    li.classList.toggle('completed');
}

// Enter key support for task input
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial display
updateDisplay();
