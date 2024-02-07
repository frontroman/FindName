const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(rightGuessString)

function initBoard() {

    let board = document.getElementById("play-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }
        console.log(row);
        board.appendChild(row)
    }
}


function insertLetter (pressedKey) {
    if (nextLetter === 5) { 
        return;
    }
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}


function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}


function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        new Notify({
            title: "Ошибка",
            text: "Введены не все буквы",
            status: 'error'
        })
        return;
    }

    if (!WORDS.includes(guessString)) {
        new Notify({
            title: "Ошибка",
            text: "Такого слова не существует",
            status: 'error'
        })
        return;
    }

    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }
            rightGuess[letterPosition] = "#"
        }
        box.style.backgroundColor = letterColor;
    }

    if (guessString === rightGuessString) {
        new Notify({
            title: "Победа",
            text: "Вы нашли слово",
            status: 'success'
        })
        guessesRemaining = 0;
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("У вас не осталось попыток. Вы проиграли!");
            toastr.info(`Загаданное слово: "${rightGuessString}"`)
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (guessesRemaining === 0) {
        return
    }
    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }
    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})


initBoard();



