
var userGuess = [];

var list = ["termo"];

var word = "termo";

var NUMBER_OF_GUESSES = 6;
var guessesRemaining = NUMBER_OF_GUESSES;
let nextLetter = 0; 

function verifyWord() {
    let palavra = '';

    for (let index = 0; index < userGuess.length; index++) {
     palavra += userGuess[index];
    }

    if(userGuess.length != 5 || !list.includes(palavra))  return;

    for (let i = 0; i < 5; i++) {
        if(word.includes(userGuess[i])) {
            if(word[i] === userGuess[i]) {
                let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
                let box = row.children[i];
                box.classList.add('right-letter');
            } else {
                let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
                let box = row.children[i];
                box.classList.add('middle-letter');
            }
        } else {
            let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
            let box = row.children[i];
            box.classList.add('wrong-letter');
        }
    }

}
    

function insertLetter(key) {
    key = key.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter];
    box.textContent = key;
    box.classList.add("filled-box");
    userGuess.push(key);
    nextLetter++;
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = '';
    userGuess.pop();
    nextLetter--;
    box.classList.remove("filled-box");
}

document.addEventListener('keyup', (e) => {

    let pressedKey = String(e.key);

    if(guessesRemaining == 0) return;

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if(pressedKey === "Enter") {
        verifyWord();
        return;
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }

});

document.getElementById("enter").addEventListener("click", verifyWord);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    verifyWord(); 
    guessesRemaining--; 
    }
});

function initBoard() {
    let board = document.getElementById("word-container");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row);
    }
}
initBoard();