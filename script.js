// ===== GAME STATE =====
const buttons = ["a", "b", "c", "d"];

let started = false;
let level = 0;
let gameSeq = [];
let userSeq = [];
let acceptingInput = false;
let audioEnabled = false;
let highScore = 0;

// ===== UI =====
const counter = document.getElementById("counter");
const heading = document.querySelector("h2");

// ===== PRELOAD SOUNDS =====
const sounds = {
    a: new Audio("sounds/a.mp3"),
    b: new Audio("sounds/b.mp3"),
    c: new Audio("sounds/c.mp3"),
    d: new Audio("sounds/d.mp3"),
    wrong: new Audio("sounds/wrong.mp3")
};

function playSound(id) {
    if (!audioEnabled) return;
    const sound = sounds[id];
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

// ===== START GAME =====
document.addEventListener("keydown", () => {
    if (started) return;

    audioEnabled = true;
    started = true;
    level = 0;
    gameSeq = [];
    nextLevel();
});

// ===== NEXT LEVEL =====
function nextLevel() {
    userSeq = [];
    level++;
    counter.innerText = level;
    heading.innerText = `Level ${level}`;

    const randBtn = buttons[Math.floor(Math.random() * buttons.length)];
    gameSeq.push(randBtn);

    playSequence();
}

// ===== PLAY FULL SEQUENCE =====
function playSequence() {
    acceptingInput = false;

    let i = 0;
    const interval = setInterval(() => {
        flashButton(gameSeq[i]);
        i++;

        if (i >= gameSeq.length) {
            clearInterval(interval);
            acceptingInput = true;
        }
    }, 600);
}

// ===== FLASH BUTTON =====
function flashButton(id) {
    const btn = document.getElementById(id);
    playSound(id);
    btn.style.opacity = "1";
    setTimeout(() => btn.style.opacity = "0.3", 300);
}

// ===== USER INPUT =====
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!started || !acceptingInput) return;

        const id = btn.id;
        userSeq.push(id);

        flashButton(id);
        checkAnswer(userSeq.length - 1);
    });
});

// ===== CHECK ANSWER =====
function checkAnswer(index) {
    if (userSeq[index] !== gameSeq[index]) {
        gameOver();
        return;
    }

    if (userSeq.length === gameSeq.length) {
        setTimeout(nextLevel, 800);
    }
}

// ===== GAME OVER =====
function gameOver() {
    playSound("wrong");

    highScore = Math.max(highScore, level - 1);

    heading.innerText =
        `Game Over! Highest Level: ${highScore}. Press any key to restart`;

    document.body.style.backgroundColor = "red";
    setTimeout(() => document.body.style.backgroundColor = "grey", 300);

    resetGame();
}

// ===== RESET =====
function resetGame() {
    started = false;
    acceptingInput = false;
    level = 0;
    gameSeq = [];
    userSeq = [];
    counter.innerText = 0;
}