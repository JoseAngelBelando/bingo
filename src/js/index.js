// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';
// Obtener los elementos del DOM
const userBoardElement = document.getElementById('user-board');
const userTextElement = document.getElementById('user-text');
const pcBoardElement = document.getElementById('pc-board');
const pcTextElement = document.getElementById('pc-text');
const bingoBoardElement = document.getElementById('bingo-board');
const startButtonElement = document.getElementById('button-start');
const restartButtonElement = document.getElementById('button-restart');
const gameTextElement = document.getElementById('game-text');

let numbers = Array.from({ length: 99 }, (_, index) => index + 1);
let gameOver = false;
let timeoutId;

// Inicializa los números aleatorios para el tablero
// generamos un numero aleatorio entre 1 y 99
const getRandomNumber = () => Math.floor(Math.random() * 99 + 1);

// genera un array de 15 números aleatorios ente 1 y 99
const generateUniqueNumbers = () => {
  const numbers = [];
  while (numbers.length < 15) {
    const number = getRandomNumber();
    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }
  return numbers;
};

// Inserta los números en el tablero del usuario y del PC
const insertNumbers = boardElement => {
  const numbers = generateUniqueNumbers();
  const fragment = document.createDocumentFragment();

  numbers.forEach(number => {
    const span = document.createElement('span');
    span.classList.add('number');
    span.textContent = number;
    span.dataset.number = number;
    fragment.appendChild(span);
  });

  boardElement.appendChild(fragment);
};

// Marca un númer del tablero del usuario o pc cuando es seleccionado
const updateMarkedNumbers = (number, boardElement, className) => {
  [...boardElement.children].forEach(child => {
    if (Number(child.dataset.number) === number) {
      child.classList.add(className);
    }
  });
};

// Comprueba si el usuario o el PC han ganado
const checkWinCondition = () => {
  const userCorrectNumbers = document.querySelectorAll('.number-user-correct');
  const pcCorrectNumbers = document.querySelectorAll('.number-pc-correct');

  if (userCorrectNumbers.length === 15) {
    gameOver = true;
    restartButtonElement.classList.remove('hide');
    userTextElement.textContent = 'USER WIN';
    pcTextElement.textContent = 'PC LOSE';
  } else if (pcCorrectNumbers.length === 15) {
    gameOver = true;
    restartButtonElement.classList.remove('hide');
    userTextElement.textContent = 'USER LOSE';
    pcTextElement.textContent = 'PC WIN';
    console.log('PERDISTE');
  }
};

// Genera un número aleatorio del array y lo elimina del array
const drawNumber = () => {
  const randomIndex = Math.floor(Math.random() * numbers.length);
  const number = numbers[randomIndex];
  numbers.splice(randomIndex, 1);
  return number;
};

// Función principal del juego que saca un número, lo muestra y actualiza el tablero hasta que el juego termina.
const playGame = () => {
  clearTimeout(timeoutId);
  gameTextElement.classList.remove('hide');

  if (numbers.length > 0 && !gameOver) {
    const number = drawNumber();
    gameTextElement.textContent = `Número: ${number}`;

    document.querySelector(`[data-bingo='${number}']`).classList.add('number-appeared');
    updateMarkedNumbers(number, userBoardElement, 'number-user-correct');
    updateMarkedNumbers(number, pcBoardElement, 'number-pc-correct');
    startButtonElement.classList.add('hide');
    checkWinCondition();

    timeoutId = setTimeout(playGame, 200);
  }
};

// Reinicia el juego
const resetGame = () => {
  numbers = Array.from({ length: 99 }, (_, index) => index + 1);
  gameOver = false;
  timeoutId = undefined;

  [...bingoBoardElement.children].forEach(child => child.classList.remove('number-appeared'));
  [...userBoardElement.children].forEach(child => child.classList.remove('number-user-correct'));
  [...pcBoardElement.children].forEach(child => child.classList.remove('number-pc-correct'));
  restartButtonElement.classList.add('hide');
  playGame();
};

// Inserta los números en los tableros de usuario y PC
insertNumbers(userBoardElement);
insertNumbers(pcBoardElement);

// Añade los event listeners a los botones de inicio y reinicio
startButtonElement.addEventListener('click', playGame);
restartButtonElement.addEventListener('click', resetGame);
