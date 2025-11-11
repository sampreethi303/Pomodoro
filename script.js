// DOM Elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const progressBar = document.getElementById('progress-bar');
const modeButtons = document.querySelectorAll('.mode-btn');
const statusText = document.getElementById('status');
const sessionCount = document.getElementById('session-count');

// Timer settings (in minutes)
const settings = {
    work: 25,
    shortBreak: 5,
    longBreak: 15
};

// Timer state
let timer = {
    mode: 'work',
    timeLeft: settings.work * 60, // in seconds
    isRunning: false,
    intervalId: null,
    sessionsCompleted: 0
};

// Initialize the timer display
updateDisplay();

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (timer.isRunning) return; // Don't allow mode change while running
        
        // Update active button
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Change mode and reset timer
        timer.mode = button.dataset.mode;
        resetTimer();
    });
});

// Timer Functions
function startTimer() {
    if (timer.isRunning) return;
    
    timer.isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // Update status text based on mode
    if (timer.mode === 'work') {
        statusText.textContent = 'Focus time! Work hard...';
    } else {
        statusText.textContent = 'Break time! Relax and recharge...';
    }
    
    timer.intervalId = setInterval(() => {
        timer.timeLeft--;
        updateDisplay();
        
        if (timer.timeLeft <= 0) {
            clearInterval(timer.intervalId);
            timerFinished();
        }
    }, 1000);
}

function pauseTimer() {
    if (!timer.isRunning) return;
    
    timer.isRunning = false;
    clearInterval(timer.intervalId);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    statusText.textContent = 'Timer paused';
}

function resetTimer() {
    clearInterval(timer.intervalId);
    timer.isRunning = false;
    timer.timeLeft = settings[timer.mode] * 60;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    updateDisplay();
    statusText.textContent = 'Timer reset';
}

function timerFinished() {
    timer.isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Play notification sound (in a real app)
    // new Audio('notification.mp3').play();
    
    if (timer.mode === 'work') {
        timer.sessionsCompleted++;
        sessionCount.textContent = timer.sessionsCompleted;
        
        // After 4 work sessions, suggest a long break
        if (timer.sessionsCompleted % 4 === 0) {
            statusText.textContent = 'Great job! Time for a long break.';
            // Auto-switch to long break
            modeButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.mode === 'longBreak') btn.classList.add('active');
            });
            timer.mode = 'longBreak';
        } else {
            statusText.textContent = 'Session complete! Take a short break.';
            // Auto-switch to short break
            modeButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.mode === 'shortBreak') btn.classList.add('active');
            });
            timer.mode = 'shortBreak';
        }
    } else {
        statusText.textContent = 'Break over! Ready for another work session?';
        // Auto-switch to work
        modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === 'work') btn.classList.add('active');
        });
        timer.mode = 'work';
    }
    
    resetTimer();
}

function updateDisplay() {
    const minutes = Math.floor(timer.timeLeft / 60);
    const seconds = timer.timeLeft % 60;
    
    // Format display as MM:SS
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const totalTime = settings[timer.mode] * 60;
    const progress = ((totalTime - timer.timeLeft) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (timer.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    } else if (e.code === 'KeyR') {
        resetTimer();
    } else if (e.code === 'Digit1') {
        if (!timer.isRunning) {
            modeButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.mode === 'work') btn.classList.add('active');
            });
            timer.mode = 'work';
            resetTimer();
        }
    } else if (e.code === 'Digit2') {
        if (!timer.isRunning) {
            modeButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.mode === 'shortBreak') btn.classList.add('active');
            });
            timer.mode = 'shortBreak';
            resetTimer();
        }
    } else if (e.code === 'Digit3') {
        if (!timer.isRunning) {
            modeButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.mode === 'longBreak') btn.classList.add('active');
            });
            timer.mode = 'longBreak';
            resetTimer();
        }
    }
});