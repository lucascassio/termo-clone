    const apiUrl = 'https://termo-api.vercel.app/words';
    let word;
    let allWordsData = [];

    async function fetchAllWords() {
      try {
        const response = await fetch(apiUrl);
        allWordsData = await response.json();
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    fetchAllWords();

    const NUMBER_OF_GUESSES = 6;
    let guessesRemaining = NUMBER_OF_GUESSES;
    let nextLetter = 0;
    let userGuess = [];

    function unifyWord(userGuess) {
      let palavra = "";
      for (let index = 0; index < userGuess.length; index++) {
        palavra += userGuess[index];
      }
      return palavra;
    }

    function resetKeyboard() {
      guessesRemaining--;
      nextLetter = 0;
      userGuess = [];
    }

    async function resetGame() {
      // Limpa o tabuleiro
      const letterRows = document.getElementsByClassName("letter-row");
      for (let i = 0; i < letterRows.length; i++) {
        const boxes = letterRows[i].getElementsByClassName("letter-box");
        for (let j = 0; j < boxes.length; j++) {
          boxes[j].textContent = "";
          boxes[j].classList.remove("right-letter", "middle-letter", "wrong-letter", "filled-box");
        }
      }


      word = obterTermoAleatorio();


      guessesRemaining = NUMBER_OF_GUESSES;
    }

    async function verifyWord() {
      try {
        let palavra = unifyWord(userGuess);
        let exists = allWordsData.some(termo => termo.palavra === palavra);
        if (userGuess.length != 5 || !exists) throw new Error("Palavra inválida");
        for (let i = 0; i < 5; i++) {
          if (word.includes(userGuess[i])) {
            if (word[i] === userGuess[i]) {
              let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
              let box = row.children[i];
              box.classList.add("right-letter");
            } else {
              let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
              let box = row.children[i];
              box.classList.add("middle-letter");
            }
          } else {
            let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
            let box = row.children[i];
            box.classList.add("wrong-letter");
          }
        }
        if (palavra === word) {
          await new Promise(resolve => setTimeout(resolve, 1500)); // Atraso de 2 segundos
          await resetGame(); // Chama a função resetGame para reiniciar o jogo
        }
        resetKeyboard();
      } catch ({ name, message }) {
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
      let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
      let box = row.children[nextLetter];
      box.textContent = " ";
      userGuess.pop();
      if (nextLetter > 0 && nextLetter < 5) nextLetter--;
      box.classList.remove("filled-box");
    }

    document.addEventListener('keyup', (e) => {

      let pressedKey = String(e.key);

      if (guessesRemaining == 0) return;

      if (pressedKey === "Backspace") {
        deleteLetter();
        return;
      }

      if (pressedKey === "Enter") {
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
          row.children[j].classList.add("filled-box");
          nextLetter = j;
          break;
        }
      }

      for (let j = 0; j < row.children.length; j++) {
        if (row.children[j] !== clickedBox) {
          row.children[j].classList.remove("filled-box");
        }
      }
    }

    function obterTermoAleatorio() {
      const indiceAleatorio = Math.floor(Math.random() * allWordsData.length);
      const termoSelecionado = allWordsData[indiceAleatorio];
      return termoSelecionado.palavra;
    }


    resetGame();
