
var word = "termo";

var input = ['t', 'e', 'r', 'm', 'o'];

const list = "list";

function verifyWord() {

    if(word.length != 5 || list.find() != word)  return;

    for (let i = 0; i < input.length; i++) {
        if(word.find(input[i])) {
            if(word[i] == input[i]) {
                // mudar css para a cor verde na posicao da letra e mudar a mesma cor no teclado
            } else {
                // mudar css para a cor amarela na posicao da letra e mudar a mesma cor no teclado
            }
        } else {
            // mudar css para a cor escura na posicao da letra e mudar para a mesma cor no teclado
        }
    }
    
}

document.getElementById("enter").addEventListener("click", verifyWord);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    verifyWord();  
    }
});

