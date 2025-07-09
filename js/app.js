let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new_game");
let winContainer = document.querySelector(".win_container");
let winMessage = document.querySelector("#message");
let difficultySelect = document.getElementById("difficulty");
let firstTurnSelect = document.getElementById("first");

let turnO = true; // true => Player's turn (O)
let difficulty = "easy";

// Winning combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Update difficulty on change
difficultySelect.addEventListener("change", () => {
  difficulty = difficultySelect.value;
});

// Attach event listeners to each box
const init = () => {
  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (!turnO || box.innerText !== "") return;

      box.innerText = "O";
      box.style.color = "#0f0";
      box.disabled = true;
      turnO = false;

      checkWinner();

      setTimeout(() => {
        if (!turnO) systemMove();
      }, 400);
    });
  });
};

// System (AI) makes a move based on difficulty
const systemMove = () => {
  if (isGameOver()) return;

  if (difficulty === "easy") {
    makeRandomMove();
  } else if (difficulty === "medium") {
    if (!tryToWinOrBlock("X")) {
      if (!tryToWinOrBlock("O")) {
        makeRandomMove();
      }
    }
  } else if (difficulty === "hard") {
    let bestMove = getBestMove();
    if (bestMove !== -1) {
      let box = boxes[bestMove];
      box.innerText = "X";
      box.style.color = "#f00";
      box.disabled = true;
      turnO = true;
      checkWinner();
    }
  }
};

// Random move for Easy mode
const makeRandomMove = () => {
  let emptyBoxes = [];
  boxes.forEach((box, i) => {
    if (box.innerText === "") emptyBoxes.push(i);
  });

  if (emptyBoxes.length === 0) return;

  let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  let box = boxes[randomIndex];
  box.innerText = "X";
  box.style.color = "#f00";
  box.disabled = true;
  turnO = true;
  checkWinner();
};

// Win/block logic for Medium mode
const tryToWinOrBlock = (symbol) => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    let idx = [a, b, c];

    let count = vals.filter(v => v === symbol).length;
    let emptyIndex = vals.findIndex(v => v === "");

    if (count === 2 && emptyIndex !== -1) {
      let moveIndex = idx[emptyIndex];
      boxes[moveIndex].innerText = "X";
      boxes[moveIndex].style.color = "#f00";
      boxes[moveIndex].disabled = true;
      turnO = true;
      checkWinner();
      return true;
    }
  }
  return false;
};

// Minimax AI for Hard mode
const getBestMove = () => {
  let bestScore = -Infinity;
  let move = -1;

  boxes.forEach((box, i) => {
    if (box.innerText === "") {
      box.innerText = "X";
      let score = minimax(false);
      box.innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
};

const minimax = (isMaximizing) => {
  let winner = evaluateWinner();
  if (winner !== null) {
    if (winner === "X") return 1;
    if (winner === "O") return -1;
    if (winner === "draw") return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    boxes.forEach((box, i) => {
      if (box.innerText === "") {
        box.innerText = "X";
        let score = minimax(false);
        box.innerText = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    boxes.forEach((box, i) => {
      if (box.innerText === "") {
        box.innerText = "O";
        let score = minimax(true);
        box.innerText = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
};

const evaluateWinner = () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let val1 = boxes[a].innerText;
    let val2 = boxes[b].innerText;
    let val3 = boxes[c].innerText;

    if (val1 && val1 === val2 && val2 === val3) {
      return val1;
    }
  }

  if ([...boxes].every(box => box.innerText !== "")) {
    return "draw";
  }

  return null;
};

// Disable all boxes
const disableBox = () => {
  boxes.forEach(box => box.disabled = true);
};

// Enable and clear boxes
const enableBox = () => {
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
  });
};

// Game reset
const resetGame = () => {
  turnO = firstTurnSelect.value === "player";
  enableBox();
  winContainer.classList.add("hidden");

  if (!turnO) {
    setTimeout(systemMove, 400);
  }
};

// Show winner message
const showWinner = (winner) => {
  winMessage.innerText = `🎉 Winner is ${winner}`;
  winContainer.classList.remove("hidden");
  disableBox();
};

// Show draw message
const showDraw = () => {
  winMessage.innerText = "😐 It's a Draw!";
  winContainer.classList.remove("hidden");
  disableBox();
};

// Check for win/draw after each move
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let val1 = boxes[a].innerText;
    let val2 = boxes[b].innerText;
    let val3 = boxes[c].innerText;

    if (val1 && val1 === val2 && val2 === val3) {
      showWinner(val1);
      return;
    }
  }

  if ([...boxes].every(box => box.innerText !== "")) {
    showDraw();
  }
};

// Check if game is already over
const isGameOver = () => {
  return [...boxes].every(box => box.disabled);
};

// Button actions
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Start game
init();
resetGame();
