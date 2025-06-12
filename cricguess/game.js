let currentObject = null;
let score = 0;
let roundScore = 0;
let objectsInRound = 0;
const objectsPerRound = 5;
let availableObjects = [];


cost objects = [
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
  }
]



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
	document.getElementById("guess").style.display = "none";
	document.getElementById("submit-guess").style.display = "none";
	document.getElementById("next-object").style.display = "none";
	document.getElementById("result").textContent = "";
	document.getElementById("score").textContent = score;
	document.getElementById("round-score").textContent = roundScore;
	document.getElementById("objects-count").textContent = `${objectsInRound}/${objectsPerRound}`;

	const imageContainer = document.querySelector('.image-container');
	imageContainer.innerHTML = '<div id="loading">Loading...</div>';

	const img = new Image();
	img.onload = function() {
		imageContainer.innerHTML = '';
		img.id = 'object-image';
		imageContainer.appendChild(img);
		document.getElementById("guess").style.display = "inline-block";
		document.getElementById("submit-guess").style.display = "inline-block";
	};
	img.onerror = function() {
		imageContainer.innerHTML = '<div id="error">Error loading image</div>';
	};
	img.src = currentObject.image;

	document.getElementById("game-container").style.display = "block";
	document.getElementById("round-end-container").style.display = "none";
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
	const pointsPerDifference = 5; // Points per unit of difference
	const maxDifferenceForFullPoints = 1; // Difference within which full points are awarded

	if (difference === 0) {
		return maxPoints;  // Perfect guess
	} else if (difference <= maxDifferenceForFullPoints) {
		return maxPoints; // Full points for close guesses
	} else {
		// Calculate points based on difference and pointsPerDifference
		const points = maxPoints - Math.floor((difference - maxDifferenceForFullPoints) / pointsPerDifference);
		return points > 0 ? points : 0; // Ensure points are not negative
	}
}

function submitGuess() {
	const guessInput = document.getElementById("guess");
	const guess = parseFloat(guessInput.value);

	if (isNaN(guess) || guess < 0 || guess > 400) {
		document.getElementById("result").textContent = "Please enter a valid number between 0 and 400.";
		return;
	}

	const points = calculatePoints(guess, currentObject.price);
	score += points;
	roundScore += points;

	const resultText = `The actual runs scored were ${currentObject.price} runs. \n You earned ${points} points!`;
	document.getElementById("result").textContent = resultText;
	document.getElementById("score").textContent = score;
	document.getElementById("round-score").textContent = roundScore;

	guessInput.style.display = "none";
	document.getElementById("submit-guess").style.display = "none";
	document.getElementById("next-object").style.display = "inline-block";
}

function endRound() {
	document.getElementById("game-container").style.display = "none";
	document.getElementById("round-end-container").style.display = "block";
	document.getElementById("final-round-score").textContent = roundScore;
	document.getElementById("final-total-score").textContent = score;
}

function startNewRound() {
	roundScore = 0;
	objectsInRound = 0;
	availableObjects = [];
	nextObject();
}

// Start the game
startNewRound();
