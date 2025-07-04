let currentObject = null;
let score = 0;
let roundScore = 0;
let objectsInRound = 0;
const objectsPerRound = 5;
let availableObjects = [];
let objects = []; // Will be loaded from data.json
let gameStats = {
    gamesPlayed: 0,
    bestRound: 0,
    perfectGuesses: 0,
    roundScores: []
};

// Load objects from data.json
async function loadObjects() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        objects = await response.json();
        console.log(`Loaded ${objects.length} cricket players`);
    } catch (error) {
        console.error('Error loading objects:', error);
        // Fallback to empty array if loading fails
        objects = [];
    }
}

// Load saved stats
function loadStats() {
    const saved = localStorage.getItem('cricguessStats');
    if (saved) {
        gameStats = {...gameStats, ...JSON.parse(saved)};
    }
    updateStatsDisplay();
}

// Save stats
function saveStats() {
    localStorage.setItem('cricguessStats', JSON.stringify(gameStats));
}

// Update stats display
function updateStatsDisplay() {
    document.getElementById('games-played').textContent = gameStats.gamesPlayed;
    document.getElementById('best-round').textContent = gameStats.bestRound;
    document.getElementById('perfect-guesses').textContent = gameStats.perfectGuesses;

    const avgScore = gameStats.roundScores.length > 0 ? 
        Math.round(gameStats.roundScores.reduce((a, b) => a + b, 0) / gameStats.roundScores.length) : 0;
    document.getElementById('avg-score').textContent = avgScore;

    updateAccuracy();
    updateAchievements();
}

// Update accuracy display
function updateAccuracy() {
    if (objectsInRound === 0) {
        document.getElementById('accuracy').textContent = '0%';
        return;
    }

    const accuracy = Math.round((roundScore / (objectsInRound * 100)) * 100);
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Update achievements
function updateAchievements() {
    const achievements = [];

    if (gameStats.perfectGuesses >= 1) achievements.push('🎯 Perfect Shot');
    if (gameStats.perfectGuesses >= 5) achievements.push('🏹 Sharpshooter');
    if (gameStats.bestRound >= 350) achievements.push('🔥 High Scorer');
    if (gameStats.bestRound >= 450) achievements.push('💎 Elite Player');
    if (gameStats.gamesPlayed >= 10) achievements.push('🏆 Veteran');
    if (gameStats.gamesPlayed >= 25) achievements.push('👑 Champion');
    if (gameStats.gamesPlayed >= 50) achievements.push('🌟 Legend');

    const avgScore = gameStats.roundScores.length > 0 ? 
        gameStats.roundScores.reduce((a, b) => a + b, 0) / gameStats.roundScores.length : 0;
    if (avgScore >= 300) achievements.push('📈 Consistent');

    const container = document.getElementById('achievements');
    container.innerHTML = achievements.length > 0 ? 
        achievements.map(a => `<span class="achievement">${a}</span>`).join('') :
        '<p style="color: var(--text-color); opacity: 0.7;">Play more to unlock achievements!</p>';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomObject() {
    if (availableObjects.length === 0) {
        availableObjects = [...objects];
        shuffleArray(availableObjects);
    }
    return availableObjects.pop();
}

function updateUI() {
    document.getElementById("guess").value = "";
    document.getElementById("guess").style.display = "inline-block";
    document.getElementById("submit-guess").style.display = "inline-block";
    document.getElementById("next-object").style.display = "none";
    document.getElementById("result").textContent = "";
    document.getElementById("result").className = "result";

    // Hide counter overlay and points display
    document.getElementById("counter-overlay").style.display = "none";
    document.getElementById("points-earned").style.display = "none";

    // Update score displays
    document.getElementById("round-score").textContent = roundScore;
    document.getElementById("objects-count").textContent = `Round ${objectsInRound}/${objectsPerRound}`;

    const imageContainer = document.querySelector('.image-container');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const imageEl = document.getElementById('object-image');

    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    imageEl.style.display = 'none';

    const img = new Image();
    img.onload = function() {
        loadingEl.style.display = 'none';
        imageEl.src = img.src;
        imageEl.style.display = 'block';
        document.getElementById("guess").focus();
    };
    img.onerror = function() {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = 'Error loading image';
    };
    img.src = currentObject.image;

    document.getElementById("game-container").style.display = "block";
    document.getElementById("round-end-container").style.display = "none";
    document.getElementById("start-screen").style.display = "none";

    updateAccuracy();
}

function nextObject() {
    if (objectsInRound < objectsPerRound) {
        currentObject = getRandomObject();
        objectsInRound++;
        updateUI();
    } else {
        endRound();
    }
}

function calculatePoints(guess, actualPrice) {
    const error = Math.abs(guess - actualPrice);

    // Perfect guess gets 100 points
    if (error === 0) return 100;

    // Exact 1 run off gets 99 points
    if (error === 1) return 99;

    // Advanced scoring system with multiple tiers
    let points;

    if (error <= 5) {
        // Very close guesses: 95-98 points (exponential decay)
        points = 100 - Math.pow(error - 1, 1.5) * 0.8;
    } else if (error <= 15) {
        // Close guesses: 80-94 points (quadratic decay)
        points = 95 - Math.pow(error - 5, 1.8) * 0.12;
    } else if (error <= 30) {
        // Decent guesses: 60-79 points (linear with slight curve)
        points = 80 - (error - 15) * 1.3;
    } else if (error <= 50) {
        // Fair guesses: 35-59 points (steeper decline)
        points = 60 - (error - 30) * 1.25;
    } else if (error <= 75) {
        // Poor guesses: 15-34 points (moderate decline)
        points = 35 - (error - 50) * 0.8;
    } else if (error <= 100) {
        // Bad guesses: 5-14 points (gentler decline)
        points = 15 - (error - 75) * 0.4;
    } else if (error <= 150) {
        // Very bad guesses: 1-4 points (minimal points)
        points = 5 - (error - 100) * 0.08;
    } else {
        // Terrible guesses: 0 points
        points = 0;
    }

    // Apply bonus multipliers for specific scenarios
    let multiplier = 1;

    // Bonus for very low scores (harder to guess accurately)
    if (actualPrice <= 30 && error <= 5) {
        multiplier = 1.1; // 10% bonus
    }

    // Bonus for very high scores (also harder to guess)
    if (actualPrice >= 300 && error <= 10) {
        multiplier = 1.05; // 5% bonus
    }

    // Apply difficulty bonus based on the actual score range
    const difficultyBonus = getDifficultyBonus(actualPrice, error);
    multiplier *= difficultyBonus;

    points *= multiplier;

    // Ensure points are within 0-100 range and round to nearest integer
    return Math.round(Math.max(0, Math.min(points, 100)));
}

function getDifficultyBonus(actualPrice, error) {
    // Different score ranges have different difficulty levels
    let baseMultiplier = 1;

    if (actualPrice <= 25) {
        // Very low scores are hardest to predict
        baseMultiplier = 1.15;
    } else if (actualPrice <= 50) {
        // Low scores are harder
        baseMultiplier = 1.08;
    } else if (actualPrice >= 350) {
        // Very high scores are also hard to predict
        baseMultiplier = 1.12;
    } else if (actualPrice >= 250) {
        // High scores are moderately harder
        baseMultiplier = 1.05;
    } else {
        // Middle range scores (50-250) are easiest
        baseMultiplier = 1.0;
    }

    // Additional precision bonus for extremely accurate guesses
    if (error <= 2) {
        baseMultiplier *= 1.02; // Extra 2% for being within 2 runs
    }

    return baseMultiplier;
}

function animateCounter(targetValue, callback) {
    const counterEl = document.getElementById("runs-counter");
    const counterOverlay = document.getElementById("counter-overlay");

    // Show counter overlay
    counterOverlay.style.display = "flex";

    let currentValue = 0;
    const increment = Math.max(1, Math.ceil(targetValue / 50)); // Control speed
    const duration = 2000; // 2 seconds total
    const stepTime = duration / (targetValue / increment);

    const timer = setInterval(() => {
        currentValue += increment;

        if (currentValue >= targetValue) {
            currentValue = targetValue;
            counterEl.textContent = currentValue;
            clearInterval(timer);

            // Add final emphasis
            counterEl.style.transform = "scale(1.2)";
            setTimeout(() => {
                counterEl.style.transform = "scale(1)";
                // Call the callback after animation completes
                if (callback) callback();
            }, 300);
        } else {
            counterEl.textContent = currentValue;
        }
    }, Math.max(20, stepTime)); // Minimum 20ms for smooth animation
}

function submitGuess() {
    const guessInput = document.getElementById("guess");
    const guess = parseFloat(guessInput.value);
    const resultEl = document.getElementById("result");

    if (isNaN(guess) || guess < 0 || guess > 400) {
        resultEl.textContent = "Please enter a valid number between 0 and 400.";
        resultEl.className = "result error";
        return;
    }

    const points = calculatePoints(guess, currentObject.price);
    const difference = Math.abs(guess - currentObject.price);

    // Hide input controls immediately
    guessInput.style.display = "none";
    document.getElementById("submit-guess").style.display = "none";

    // Clear previous result
    resultEl.textContent = "";
    resultEl.className = "result";

    // Start the counter animation
    animateCounter(currentObject.price, () => {
        // This callback runs after counter animation completes

        // Add to scores
        score += points;
        roundScore += points;

        // Check for perfect guess
        if (points === 100) {
            gameStats.perfectGuesses++;
        }

        // Show points with animation
        const pointsEl = document.getElementById("points-earned");
        const pointsValueEl = pointsEl.querySelector('.points-value');
        pointsValueEl.textContent = points;
        pointsEl.style.display = "block";

        // Animate points
        pointsEl.style.transform = "scale(0)";
        setTimeout(() => {
            pointsEl.style.transform = "scale(1)";
        }, 100);

        // Build result text
        let resultText = `Your guess: ${guess} runs. `;

        if (difference === 0) {
            resultText += `🎯 Perfect! You earned ${points} points!`;
        } else if (difference <= 8) {
            resultText += `Very close! Only ${difference} runs off. You earned ${points} points!`;
        } else if (difference <= 25) {
            resultText += `Good estimate! You earned ${points} points!`;
        } else if (difference <= 50) {
            resultText += `Not bad! You earned ${points} points!`;
        } else {
            resultText += `You earned ${points} points!`;
        }

        // Show result after a delay
        setTimeout(() => {
            resultEl.textContent = resultText;
            resultEl.className = points >= 80 ? "result success" : "result";

            // Update displays
            document.getElementById("round-score").textContent = roundScore;
            updateStatsDisplay();
            saveStats();

            // Show next button
            document.getElementById("next-object").style.display = "inline-block";
        }, 800);
    });
}

function endRound() {
    // Calculate final round accuracy
    const roundAccuracy = Math.round((roundScore / (objectsPerRound * 100)) * 100);

    // Update game stats
    gameStats.gamesPlayed++;
    gameStats.bestRound = Math.max(gameStats.bestRound, roundScore);
    gameStats.roundScores.push(roundScore);

    // Keep only last 10 rounds for average calculation
    if (gameStats.roundScores.length > 10) {
        gameStats.roundScores.shift();
    }

    saveStats();
    updateStatsDisplay();

    document.getElementById("game-container").style.display = "none";
    document.getElementById("round-end-container").style.display = "block";
    document.getElementById("final-round-score").textContent = roundScore;
    document.getElementById("final-round-accuracy").textContent = roundAccuracy + '%';
}

function startNewRound() {
    roundScore = 0;
    objectsInRound = 0;
    availableObjects = [];
    showStartScreen();
}

function showStartScreen() {
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("game-container").style.display = "none";
  document.getElementById("round-end-container").style.display = "none";
}

function startGame() {
    // Hide start screen and begin the actual round
    document.getElementById("start-screen").style.display = "none";
    nextObject();
}

// Initialize game
window.addEventListener('load', async () => {
    await loadObjects();
    loadStats();
    
    // Initially show the start screen
    showStartScreen();

    if (objects.length > 0) {
      //  startNewRound(); // changed to showStartScreen initially
    } else {
        document.getElementById("game-container").innerHTML = 
            '<div style="text-align: center; padding: 2rem;"><h2>No cricket players loaded!</h2><p>Please check data.json file.</p></div>';
    }
});