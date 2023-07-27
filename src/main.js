const apiUrl = 'https://termo-api.vercel.app/words';
const NUMBER_OF_GUESSES = 6;
let word;
let dataCache = null;
let userGuess = [];
let guessesRemaining = NUMBER_OF_GUESSES;
let nextLetter = 0; 

async function fetchTermsFromAPI() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in API request:', error);
    throw error;
  }
}

async function getRandomTerm() {
  try {
    if (!dataCache) {
      dataCache = await fetchTermsFromAPI();
    }

    const randomIndex = Math.floor(Math.random() * dataCache.length);
    const selectedTerm = dataCache[randomIndex];
    let selectedWord = selectedTerm.palavra;

    console.log('Selected term:', selectedTerm);
    console.log('Selected word:', selectedWord);

    return selectedWord;
  } catch (error) {
    console.error('Error in API request:', error);
    throw error;
  }
}

async function initBoard() {
  let board = document.getElementById("word-container");
  word = await getRandomTerm();
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }

  addClickListenerToLetterBoxes();
}

initBoard();

function unifyWord(userGuess){
  let word = "";
  for (let index = 0; index < userGuess.length; index++) {
    word += userGuess[index];
  }
  return word;
}

function resetKeyboard(){
  guessesRemaining--;
  nextLetter = 0;
  userGuess = [];
}

async function resetGame() {
  const letterRows = document.getElementsByClassName("letter-row");
  for (let i = 0; i < letterRows.length; i++) {
    const boxes = letterRows[i].getElementsByClassName("letter-box");
    for (let j = 0; j < boxes.length; j++) {
      boxes[j].textContent = "";
      boxes[j].classList.remove("right-letter", "middle-letter", "wrong-letter", "filled-box");
    }
  }

  word = await getRandomTerm();
  guessesRemaining = NUMBER_OF_GUESSES;
}

async function verifyVictory(userWord) {
  if (userWord === word) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await resetGame();
  }
}

async function verifyExistence(userWord) {
  try {
    if (!dataCache) {
      dataCache = await fetchTermsFromAPI();
    }
    return dataCache.some(term => term.palavra === userWord);
  } catch (error) {
    console.error('Error in API request:', error);
  }
}

async function verifyWord() {
  try {
    let userWord = unifyWord(userGuess);
    let exists = await verifyExistence(userWord); 
    if (userGuess.length !== 5 || !exists) throw new Error("Invalid word");
    for (let i = 0; i < 5; i++) {
      if (word.includes(userGuess[i])) {
        let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
        let box = row.children[i];
        if (word[i] === userGuess[i]) {
          box.classList.add("right-letter");
        } else {
          box.classList.add("middle-letter");
        }
      } else {
        let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
        let box = row.children[i];
        box.classList.add("wrong-letter");
      }
    }
    verifyVictory(userWord);
    resetKeyboard();
  } catch ({name, message}) {
    alert(message);
  }
}

function insertLetter(key) {
  key = key.toLowerCase();
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter];
  box.textContent = key;
  userGuess.push(key);
  if (nextLetter >= 0 && nextLetter < 4) nextLetter++;
  box.classList.add("filled-box");
}

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
  if(guessesRemaining === 0) return;

  if (pressedKey === "Backspace") {
    deleteLetter();
    return;
  }

  if(pressedKey === "Enter") {
    verifyWord();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.getElementById("enter").addEventListener("click", verifyWord);

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", (event) => {
      const buttonValue = event.target.value;
      let found = buttonValue.match(/[a-z]/gi);
      if (found && found.length <= 1) {
        insertLetter(buttonValue);
      } else if (buttonValue === "Backspace" && nextLetter !== 0) {
        deleteLetter();
      }
    });
  }
});

function addClickListenerToLetterBoxes() {
  const letterBoxes = document.getElementsByClassName("letter-box");
  for (let i = 0; i < letterBoxes.length; i++) {
    letterBoxes[i].addEventListener("click", handleLetterBoxClick);
  }
}

addClickListenerToLetterBoxes();

function handleLetterBoxClick(event) {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let clickedBox = event.target;

  for (let j = 0; j < row.children.length; j++) {
    if (row.children[j] === clickedBox) {
      row.children[j].classList.add("filled-box")
      nextLetter = j;
      break;
    }
  }

  for (let j = 0; j < row.children.length; j++) {
    if (row.children[j] !==  clickedBox) {
      row.children[j].classList.remove("filled-box")
    }
  }
}
