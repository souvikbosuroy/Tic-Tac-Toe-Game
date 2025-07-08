let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new_game");
let winContainer = document.querySelector(".win_container");
let winMessage = document.querySelector("#message");

let turnO = true; //player O;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
]

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            turnO = false;

        }
        else {
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;

        checkWinner();
    })
});

const disableBox = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const enableBox = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

const resetGame = () => {
    turnO = true;
    enableBox();
    winContainer.classList.add("hidden");
}


const showWinner = (winner) => {
    winMessage.innerText = `Congratulations, Winner is ${winner}`;
    winContainer.classList.remove("hidden");
    disableBox();
}

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let positionOne = boxes[pattern[0]].innerText;
        let positionTwo = boxes[pattern[1]].innerText;
        let positionThree = boxes[pattern[2]].innerText;

        if (positionOne != "" && positionTwo != "" && positionThree != "") {
            if (positionOne === positionTwo & positionTwo === positionThree) {
                console.log("winner", positionOne);
                showWinner(positionOne);
            }
        }
    }
}


newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);