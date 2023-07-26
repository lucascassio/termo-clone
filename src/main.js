
    const apiUrl = 'https://termo-api.vercel.app/words';

    const NUMBER_OF_GUESSES = 6;
    let guessesRemaining = NUMBER_OF_GUESSES;
    let nextLetter = 0;
    let userGuess = [];
    let word;
    let cachedTerms = [];

    async function fetchTerms() {
      if (cachedTerms.length === 0) {
        const response = await fetch(apiUrl);
        cachedTerms = await response.json();
      }
      return cachedTerms;
    }

    async function getRandomTerm() {
      try {
        const terms = await fetchTerms();
        const randomIndex = Math.floor(Math.random() * terms.length);
        const SelectedTerm = terms[randomIndex];
        return SelectedTerm.palavra;
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    }

    async function resetGame() {
      const letterRows = document.getElementsByClassName("letter-row");
      for (let i = 0; i < letterRows.length; i++) {
        const boxes = letterRows[i].getElementsByClassName("letter-box");
        for (let j = 0; j < boxes.length; j++) {
          boxes[j].textContent = "";
          boxes[j].className = "letter-box";
        }
      }
      word = await getRandomTerm();
      guessesRemaining = NUMBER_OF_GUESSES;
      userGuess = [];
      nextLetter = 0;
    }

    async function verifyVictory(palavra) {
      if (palavra === word) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await resetGame();
      }
    }

    async function verifyExistance(palavra) {
      const terms = await fetchTerms();
      return terms.some(termo => termo.palavra === palavra);
    }

    function unifyWord(userGuess) {
      return userGuess.join('');
    }

    function resetKeyboard() {
      guessesRemaining--;
      nextLetter = 0;
      userGuess = [];
      const letterBoxes = document.getElementsByClassName("letter-box");
      for (let i = 0; i < letterBoxes.length; i++) {
        letterBoxes[i].classList.remove("filled-box");
      }
    }

    async function verifyWord() {
      try {
        let palavra = unifyWord(userGuess);
        let exists = await verifyExistance(palavra);
        if (userGuess.length != 5 || !exists) throw new Error("Palavra inválida");
        const letterRows = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
        for (let i = 0; i < 5; i++) {
          if (word.includes(userGuess[i])) {
            if (word[i] === userGuess[i]) {
              letterRows.children[i].classList.add("right-letter");
            } else {
              letterRows.children[i].classList.add("middle-letter");
            }
          } else {
            letterRows.children[i].classList.add("wrong-letter");
          }
        }
        verifyVictory(palavra);
        resetKeyboard();
      } catch ({ name, message }) {
        alert(message);
      }
    }

    function insertLetter(key) {
      key = key.toLowerCase();
      const letterRows = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
      const box = letterRows.children[nextLetter];
      box.textContent = key;
      userGuess.push(key);
      if (nextLetter >= 0 && nextLetter < 4) nextLetter++;
      box.classList.add("filled-box");
    }

    function deleteLetter() {
      const letterRows = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
      const box = letterRows.children[nextLetter];
      box.textContent = " ";
      userGuess.pop();
      if (nextLetter > 0 && nextLetter < 5) nextLetter--;
      box.classList.remove("filled-box");
    }

    document.addEventListener('keyup', (e) => {
      const pressedKey = String(e.key);

      if (guessesRemaining === 0) return;

      if (pressedKey === "Backspace") {
        deleteLetter();
        return;
      }

      if (pressedKey === "Enter") {
        verifyWord();
        return;
      }

      const found = pressedKey.match(/[a-z]/gi);
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
          const found = buttonValue.match(/[a-z]/gi);
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
      const letterRows = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
      const clickedBox = event.target;

      for (let j = 0; j < letterRows.children.length; j++) {
        if (letterRows.children[j] === clickedBox) {
          letterRows.children[j].classList.add("filled-box");
          nextLetter = j;
        } else {
          letterRows.children[j].classList.remove("filled-box");
        }
      }
    }

    async function initBoard() {
      const board = document.getElementById("word-container");
      word = await getRandomTerm();
      for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        const row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < 5; j++) {
          const box = document.createElement("div");
          box.className = "letter-box";
          row.appendChild(box);
        }

        board.appendChild(row);
      }

      addClickListenerToLetterBoxes();
    }

    initBoard();
  </script>
</body>
</html>
