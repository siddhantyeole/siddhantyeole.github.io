
let currentObject = null;
let score = 0;
let roundScore = 0;
let objectsInRound = 0;
const objectsPerRound = 5;
let availableObjects = [];
let gameStats = {
    gamesPlayed: 0,
    bestRound: 0,
    perfectGuesses: 0,
    roundScores: []
};

const objects = [
    {
        "image": "https://imgpile.com/images/DPALlX.jpg",
        "price": 149
    },
    {
        "image": "https://imgpile.com/images/DogF13.jpg",
        "price": 172
    },
    {
        "image": "https://imgpile.com/images/DPAoX2.jpg",
        "price": 82
    },
    {
        "image": "https://imgpile.com/images/DPAqpG.jpg",
        "price": 400
    },
    {
        "image": "https://imgpile.com/images/DPAATa.jpg",
        "price": 264
    },
    {
        "image": "https://imgpile.com/images/Dogg2w.jpg",
        "price": 144
    },
    {
        "image": "https://imgpile.com/images/DogQKl.jpg",
        "price": 335
    },
    {
        "image": "https://imgpile.com/images/DogvaF.jpg",
        "price": 237
    },
    {
        "image": "https://imgpile.com/images/DqDbz1.jpg",
        "price": 200
    },
    {
        "image": "https://imgpile.com/images/DqDdvL.png",
        "price": 251
    },
    {
        "image": "https://imgpile.com/images/DqD9wx.jpg",
        "price": 135
    },
    {
        "image": "https://i.imgur.com/DLmzwpA.png",
        "price": 110
    },
    {
        "image": "https://i.imgur.com/kEpvy15.jpeg",
        "price": 114
    },
    {
        "image": "https://i.imgur.com/L3ciBKK.jpeg",
        "price": 215
    },
    {
        "image": "https://i.imgur.com/KYaLPco.jpeg",
        "price": 380
    },
    {
        "image": "https://i.imgur.com/f3TrgIu.gif",
        "price": 135
    },
    {
        "image": "https://i.imgur.com/Fd0OSUr.jpeg",
        "price": 69
    },
    {
        "image": "https://i.imgur.com/fibq2WQ.jpeg",
        "price": 34
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/95700/95749.jpg",
      "price": 281
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/163400/163497.jpg",
      "price": 152
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/146100/146134.jpg",
      "price": 52
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/DB/022001/022418.jpg",
      "price": 38
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/DB/022001/022035.jpg",
      "price": 46
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/DB/102000/017094.jpg",
      "price": 84
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/DB/102000/017116.jpg",
      "price": 117
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/36900/36983.jpg",
      "price": 102
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_960,q_50/lsci/db/PICTURES/DB/102000/017213.jpg",
      "price": 34
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/DB/012001/021192.jpg",
      "price": 78
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/DB/102000/017305.jpg",
      "price": 105
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/289800/289879.jpg",
      "price": 50
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/289800/289868.jpg",
      "price": 89
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/289900/289900.jpg",
      "price": 22
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/289900/289981.jpg",
      "price": 73
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/289900/289972.jpg",
      "price": 52
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290000/290044.jpg",
      "price": 18
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290000/290087.jpg",
      "price": 45
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/291700/291740.jpg",
      "price": 42
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290100/290153.jpg",
      "price": 107
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290100/290126.jpg",
      "price": 84
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290200/290206.jpg",
      "price": 30
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290200/290270.jpg",
      "price": 122
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290200/290256.jpg",
      "price": 31
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290200/290295.jpg",
      "price": 82
    },
    {
      "image": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_480/lsci/db/PICTURES/CMS/290200/290273.jpg",
      "price": 64
    },

];

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
    const difference = Math.abs(guess - actualPrice);
    const maxPoints = 100;
    
    if (difference === 0) {
        return maxPoints; // Perfect guess
    }
    
    // Create a smooth curve that gives points from 1-99 based on difference
    // The formula creates a balanced distribution where:
    // - Small differences get high points (95-99)
    // - Medium differences get moderate points (30-70)
    // - Large differences get low points (1-29)
    
    let points;
    
    if (difference <= 50) {
        // For differences 1-50: exponential decay from 99 to 30
        points = Math.round(99 * Math.exp(-difference * 0.05));
    } else if (difference <= 100) {
        // For differences 51-100: linear decrease from 29 to 10
        points = Math.round(29 - ((difference - 50) * 0.38));
    } else if (difference <= 150) {
        // For differences 101-150: slower decrease from 10 to 5
        points = Math.round(10 - ((difference - 100) * 0.1));
    } else {
        // For very large differences: minimum points with slight variation
        points = Math.max(1, Math.round(5 - (difference - 150) * 0.02));
    }
    
    // Ensure points are within valid range and add some randomness for variety
    points = Math.max(1, Math.min(99, points));
    
    return points;
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
        pointsEl.textContent = points;
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
}

function startNewRound() {
    roundScore = 0;
    objectsInRound = 0;
    availableObjects = [];
    nextObject();
}

// Initialize game
window.addEventListener('load', () => {
    loadStats();
    startNewRound();
});
