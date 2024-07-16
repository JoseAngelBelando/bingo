import {
  userBoardElement,
  userTextElement,
  pcBoardElement,
  pcTextElement,
  bingoBoardElement,
  startButtonElement,
  restartButtonElement,
  gameTextElement
} from './dom';

// Creación del array de números del 1 al 99
let numbers = [];
for (let i = 1; i <= 99; i++) {
  numbers.push(i);
}
let gameOver = false;
let timeoutId;

// Genera un número aleatorio entre 1 y 99
const getRandomNumber = () => Math.floor(Math.random() * 100);

// Genera un array de 15 números aleatorios entre 1 y 99
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

// Inserta los números en el tablero
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

// Marca un número en el tablero
const updateMarkedNumbers = (number, boardElement, className) => {
  [...boardElement.children].forEach(child => {
    if (Number(child.dataset.number) === number) {
      child.classList.add(className);
    }
  });
};

// Comprueba si alguien ha ganado
const checkWinCondition = () => {
  const userCorrectNumbers = document.querySelectorAll('.number-user-correct');
  const pcCorrectNumbers = document.querySelectorAll('.number-pc-correct');

  if (userCorrectNumbers.length === 15) {
    gameOver = true;
    restartButtonElement.classList.remove('hide');
    userTextElement.textContent = 'USER WIN';
    pcTextElement.textContent = 'PC LOSE';
    document.body.classList.add('user-win');
  } else if (pcCorrectNumbers.length === 15) {
    gameOver = true;
    restartButtonElement.classList.remove('hide');
    userTextElement.textContent = 'USER LOSE';
    pcTextElement.textContent = 'PC WIN';
    document.body.classList.add('pc-win');
  }
};

// Genera un número aleatorio y lo elimina del array
const drawNumber = () => {
  const randomIndex = Math.floor(Math.random() * numbers.length);
  const number = numbers[randomIndex];
  numbers.splice(randomIndex, 1);
  return number;
};

// Función principal del juego
let intervalId;

const playGame = () => {
  clearInterval(intervalId);
  gameTextElement.classList.remove('hide');

  intervalId = setInterval(() => {
    if (numbers.length > 0 && !gameOver) {
      const number = drawNumber();
      gameTextElement.textContent = `Número: ${number}`;

      document.querySelector(`[data-bingo='${number}']`).classList.add('number-appeared');
      updateMarkedNumbers(number, userBoardElement, 'number-user-correct');
      updateMarkedNumbers(number, pcBoardElement, 'number-pc-correct');
      startButtonElement.classList.add('hide');
      checkWinCondition();

      if (gameOver) {
        clearInterval(intervalId);
      }
    } else {
      clearInterval(intervalId);
    }
  }, 100);
};

// Reinicia el juego
const resetGame = () => {
  numbers = Array.from({ length: 99 }, (_, index) => index + 1);
  gameOver = false;
  timeoutId = undefined;
  userTextElement.textContent = '';
  pcTextElement.textContent = '';

  document.body.classList.remove('user-win', 'pc-win');
  document.body.style.backgroundColor = 'aliceblue';
  const clearClasses = (parentElement, className) => {
    const children = parentElement.children;
    for (let i = 0; i < children.length; i++) {
      children[i].classList.remove(className);
    }
  };

  clearClasses(bingoBoardElement, 'number-appeared');
  clearClasses(userBoardElement, 'number-user-correct');
  clearClasses(pcBoardElement, 'number-pc-correct');

  restartButtonElement.classList.add('hide');
  playGame();
};

// Inserta los números en los tableros
insertNumbers(userBoardElement);
insertNumbers(pcBoardElement);

export { startButtonElement, restartButtonElement, playGame, resetGame };
