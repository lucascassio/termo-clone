const pool = require('./server/database'); // Update the path accordingly.

var userGuess = [];

var word = "termo";

var NUMBER_OF_GUESSES = 6;
var guessesRemaining = NUMBER_OF_GUESSES;
let nextLetter = 0; 

//Junta o input do usuário
function unifyWord(userGuess){
    let palavra = "";
    for (let index = 0; index < userGuess.length; index++) {
      palavra += userGuess[index];
    }
    return palavra;
}

function resetKeyboard(){
  guessesRemaining--
  nextLetter = 0
  userGuess = [];
}

function verifyVictory(palavra){
  if (palavra === word) {
    alert("Parabéns")
  }
}

async function verifyExistance(palavra) {
  try {
    const queryResult = await pool.query(
      `SELECT COUNT(*) as count FROM palavras WHERE palavra = ?`,
      [palavra]
    );

    const wordExists = queryResult[0].count > 0;
    return wordExists;
  } catch (err) {
    console.error("Erro ao verificar a palavra:", err);
  }
}


//Verifica o input do usuário
async function verifyWord() {
    try {
        let palavra = unifyWord(userGuess)
        await verifyExistance(palavra); // Call the verifyVictory function with the unified word
        if (userGuess.length != 5 && await verifyExistance(palavra)) throw new TypeError("Palavra inválida");
         for (let i = 0; i < 5; i++) {
           if (word.includes(userGuess[i])) {
             if (word[i] === userGuess[i]) {
               let row =
                 document.getElementsByClassName("letter-row")[
                   6 - guessesRemaining
                 ]
               let box = row.children[i]
               box.classList.add("right-letter")
             } else {
               let row =
                 document.getElementsByClassName("letter-row")[
                   6 - guessesRemaining
                 ]
               let box = row.children[i]
               box.classList.add("middle-letter")
             }
           } else {
             let row =
               document.getElementsByClassName("letter-row")[
                 6 - guessesRemaining
               ]
             let box = row.children[i]
             box.classList.add("wrong-letter")
           }
         }
         verifyVictory(palavra)
         resetKeyboard()
    } catch ({name, message}) {
        alert(message);
    }
}
    
//Une a letra
function insertLetter(key) {
    key = key.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter];
    box.textContent = key;
    box.classList.add("filled-box");
    userGuess.push(key);
    if (nextLetter >= 0 && nextLetter < 4) nextLetter++
}

//Deleta uma letra
function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = " ";
    userGuess.pop();
    if(nextLetter > 0 && nextLetter < 5) nextLetter--;
    box.classList.remove("filled-box");
}

document.addEventListener('keyup', (e) => {

    let pressedKey = String(e.key);

    if(guessesRemaining == 0) return;

    if (pressedKey === "Backspace") {
        deleteLetter();
        console.log('deleta')
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

//Faz o teclado virtual funcionar
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.getElementsByTagName("button")

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", (event) => {
      const buttonValue = event.target.value;
      let found = buttonValue.match(/[a-z]/gi)
      if (found && found.length <= 1) {
        insertLetter(buttonValue)
      } else if (buttonValue == "Backspace" && nextLetter !== 0) {
        deleteLetter()
      }
    })
  }
})

//Inicia o board
function initBoard() {
    let board = document.getElementById("word-container");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box";
            row.appendChild(box)
        }

        board.appendChild(row);
    }
}

initBoard();

function addClickListenerToLetterBoxes() {
  const letterBoxes = document.getElementsByClassName("letter-box");
  for (let i = 0; i < letterBoxes.length; i++) {;
    letterBoxes[i].addEventListener("click", handleLetterBoxClick);
  }
}
addClickListenerToLetterBoxes();

function handleLetterBoxClick(event) {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let clickedBox = event.target;

  for (let j = 0; j < row.children.length; j++) {
    if (row.children[j] === clickedBox) {
      nextLetter = j;
      break;
    }
  }
}

