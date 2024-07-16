// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';
import { startButtonElement, restartButtonElement, playGame, resetGame } from './game';

// Añade los event listeners a los botones de inicio y reinicio
startButtonElement.addEventListener('click', playGame);
restartButtonElement.addEventListener('click', resetGame);
