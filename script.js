const startEl = document.getElementById("start");
const stopEl = document.getElementById("stop");
const resetEl = document.getElementById("reset");
const timerEl = document.getElementById("timer");
const soundIcon = document.getElementById("sound-icon");
const soundSelect = document.getElementById("sound-select");
const noiseSelect = document.getElementById("noise-select");
const breakSelection = document.getElementById("break-selection");
const skipBreakBtn = document.getElementById("skip-break");
const quoteDisplay = document.getElementById("quote-display");
const quoteText = document.getElementById("quote-text");
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');

let interval;
let timeLeft = 10;
let isMuted = true; // Default to muted
let isBreakMode = false; // Track if we're in break mode
let backgroundAudio = null; // Background noise audio
let isBackgroundPlaying = false; // Track if background noise is playing

// Motivational quotes for work sessions
const workQuotes = [
    "Focus on progress, not perfection.",
    "Every minute spent planning saves five in execution.",
    "The only way to do great work is to love what you do.",
    "Small steps, big impact.",
    "Your future self is watching you right now through memories.",
    "Discipline is choosing between what you want now and what you want most.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only limit to your impact is your imagination and commitment."
];

// Encouraging messages for completed sessions
const completionMessages = [
    "Well done! You've made great progress!",
    "Excellent work! You're building amazing habits!",
    "Fantastic! Every session brings you closer to your goals!",
    "Outstanding! Your focus is truly impressive!",
    "Brilliant work! You're unstoppable!",
    "Incredible! You're mastering the art of deep work!",
    "Superb! Your dedication is inspiring!",
    "Outstanding focus! You're crushing it!",
    "Amazing work! You're building something special!",
    "Exceptional! Your consistency is remarkable!"
];

// Creation of audio element for the alert sound
let audioAlert = new Audio('sounds/classic-bell.mp3'); // Default sound

// Background noise management
function startBackgroundNoise() {
    const selectedNoise = noiseSelect.value;
    
    if (selectedNoise === 'none') {
        stopBackgroundNoise();
        // Mute and update sound icon when no background noise is selected
        if (!isMuted) {
            isMuted = true;
            soundIcon.src = "images/sound-off.svg";
            soundIcon.alt = "Sound Off";
        }
        return;
    }
    
    // Stop any currently playing background noise
    stopBackgroundNoise();
    
    // Create new background audio
    backgroundAudio = new Audio(`sounds/${selectedNoise}.mp3`);
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.3; // Set to 30% volume for background
    
    // Unmute and update sound icon when background noise starts
    if (isMuted) {
        isMuted = false;
        soundIcon.src = "images/sound-on.svg";
        soundIcon.alt = "Sound On";
    }
    
    // Play the background noise
    backgroundAudio.play().then(() => {
        isBackgroundPlaying = true;
    }).catch(error => {
        console.log('Background noise not available:', selectedNoise);
    });
}

function stopBackgroundNoise() {
    if (backgroundAudio && isBackgroundPlaying) {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
        isBackgroundPlaying = false;
    }
}

// Quote management functions
function getRandomQuote(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function showWorkQuote() {
    const quote = getRandomQuote(workQuotes);
    quoteText.textContent = quote;
    quoteDisplay.classList.remove('completed');
    quoteDisplay.style.background = 'linear-gradient(135deg, #660066, #800080)';
    quoteDisplay.style.boxShadow = '0 3px 12px rgba(52, 152, 219, 0.3)';
}

function showCompletionMessage() {
    const message = getRandomQuote(completionMessages);
    quoteText.textContent = message;
    quoteDisplay.classList.add('completed');
    quoteDisplay.style.background = 'linear-gradient(135deg, #660066, #800080)';
    quoteDisplay.style.boxShadow = '0 3px 12px rgba(39, 174, 96, 0.3)';
}

// Sound selection functionality
function changeSound() {
    const selectedSound = soundSelect.value;
    
    // Stop the currently playing audio before creating new audio
    if (audioAlert) {
        audioAlert.pause();
        audioAlert.currentTime = 0;
    }
    
    audioAlert = new Audio(`sounds/${selectedSound}`);
    
    // Automatically turn sound on when a sound is selected
    if (isMuted) {
        isMuted = false;
        soundIcon.src = "images/sound-on.svg";
        soundIcon.alt = "Sound On";
    }
    
    // Play a preview of the selected sound
    audioAlert.play();
}

// Background noise selection functionality
function changeBackgroundNoise() {
    const selectedNoise = noiseSelect.value;
    
    // Stop any currently playing background noise
    if (backgroundAudio && isBackgroundPlaying) {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
        isBackgroundPlaying = false;
    }
    
    if (selectedNoise === 'none') {
        // Mute and update sound icon when no background noise is selected
        if (!isMuted) {
            isMuted = true;
            soundIcon.src = "images/sound-off.svg";
            soundIcon.alt = "Sound Off";
        }
        return; // No preview for "none" option
    }
    
    // Unmute and update sound icon when previewing background noise
    if (isMuted) {
        isMuted = false;
        soundIcon.src = "images/sound-on.svg";
        soundIcon.alt = "Sound On";
    }
    
    // Create new background audio for preview
    const previewAudio = new Audio(`sounds/${selectedNoise}.mp3`);
    previewAudio.volume = 0.3; // Set to 30% volume for preview
    
    // Play a preview of the selected background noise
    previewAudio.play().then(() => {
        // Stop preview after 3 seconds
        setTimeout(() => {
            previewAudio.pause();
            previewAudio.currentTime = 0;
        }, 3000);
    }).catch(error => {
        console.log('Background noise preview not available:', selectedNoise);
    });
}

// Sound toggle functionality
function toggleSound() {
    isMuted = !isMuted;
    if (isMuted) {
        soundIcon.src = "images/sound-off.svg";
        soundIcon.alt = "Sound Off";
    } else {
        soundIcon.src = "images/sound-on.svg";
        soundIcon.alt = "Sound On";
    }
}

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    timerEl.innerHTML = formattedTime;
    
    // Update tab title with timer countdown
    if (isBreakMode) {
        document.title = `Break: ${formattedTime} - Pomodoro Timer`;
    } else if (timeLeft > 0) {
        document.title = `Work: ${formattedTime} - Pomodoro Timer`;
    } else {
        document.title = "Pomodoro Timer";
    }
}

function startTimer() {
    clearInterval(interval); // Prevent multiple intervals!
    startEl.disabled = true; // Disable Start button while timer is running
    // Start background noise when timer starts
    startBackgroundNoise();
    
    // Show work quote when starting a new session
    if (!isBreakMode) {
        showWorkQuote();
    }
    
    interval = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) timeLeft = 0; // Prevent negative time
        updateTimer();
        if(timeLeft === 0) {
            clearInterval(interval);
            // Stop background noise when timer completes
            stopBackgroundNoise();
            // Visual notification effects
            const container = document.querySelector('.container');
            const timer = document.querySelector('.timer');
            // Add visual effects
            container.classList.add('timer-complete');
            timer.classList.add('timer-complete');
            // Play the audio alert only if not muted
            if (!isMuted) {
                audioAlert.play();
            }
            // Remove visual effects after 3 seconds
            setTimeout(() => {
                container.classList.remove('timer-complete');
                timer.classList.remove('timer-complete');
            }, 3000);
            if (!isBreakMode) {
                // Work session completed - show completion message and break selection
                showCompletionMessage();
                showBreakSelection();
            } else {
                // Break completed - reset to work mode
                resetToWorkMode();
            }
        }
    }, 1000)
}

function showBreakSelection() {
    breakSelection.classList.remove('hidden');
    startEl.disabled = true;
    stopEl.disabled = true;
    resetEl.disabled = true;
}

function hideBreakSelection() {
    breakSelection.classList.add('hidden');
    startEl.disabled = false;
    stopEl.disabled = false;
    resetEl.disabled = false;
}

function startBreak(breakTime) {
    isBreakMode = true;
    timeLeft = breakTime;
    updateTimer();
    hideBreakSelection();
    startTimer();
}

function resetToWorkMode() {
    isBreakMode = false;
    timeLeft = 10; // Reset to work time
    updateTimer();
}

function stopTimer() {
     clearInterval(interval);
     stopBackgroundNoise();
     startEl.disabled = false; // Re-enable Start button when stopped
}

function resetTimer() {
   clearInterval(interval);
    timeLeft = 10;
    isBreakMode = false;
    updateTimer();
    hideBreakSelection();
    stopBackgroundNoise();
    startEl.disabled = false; // Re-enable Start button when reset
}

// Break option click handlers
document.querySelectorAll('.break-option').forEach(button => {
    button.addEventListener('click', () => {
        const breakTime = parseInt(button.dataset.time);
        startBreak(breakTime);
    });
});

// Skip break handler
skipBreakBtn.addEventListener('click', () => {
    resetToWorkMode();
    hideBreakSelection();
});

startEl.addEventListener("click", startTimer);
stopEl.addEventListener("click", stopTimer);
resetEl.addEventListener("click", resetTimer);
soundIcon.addEventListener("click", toggleSound);
soundSelect.addEventListener("change", changeSound);
noiseSelect.addEventListener("change", changeBackgroundNoise);

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const soundIcon = document.getElementById('sound-icon');

    function setTheme(isLight) {
        if (isLight) {
            document.body.classList.add('light-theme');
            themeIcon.src = 'images/light.svg';
            themeIcon.alt = 'Light mode';
        } else {
            document.body.classList.remove('light-theme');
            themeIcon.src = 'images/dark.svg';
            themeIcon.alt = 'Dark mode';
        }
        // Update sound icon filter for light/dark
        if (document.body.classList.contains('light-theme')) {
            soundIcon.style.filter = 'invert(0.3)';
        } else {
            soundIcon.style.filter = 'invert(1)';
        }
    }

    // Default to dark mode
    let isLightTheme = false;
    setTheme(isLightTheme);

    themeToggle.addEventListener('click', () => {
        isLightTheme = !isLightTheme;
        setTheme(isLightTheme);
    });

    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            isLightTheme = !isLightTheme;
            setTheme(isLightTheme);
        }
    });
});