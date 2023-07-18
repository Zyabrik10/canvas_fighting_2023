import { timer } from "./timer.js";
import { stuff } from "./initGlobalVariables.js";
import { hideUserInterFace } from "../userInterface.js";
import { userButtons } from "./initUserInterface.js";
import update from "../update/mainUpdateFunction.js";

export const game = { gameLoop: false };

export function initGame() {
  game.gameLoop = true;
  userButtons.isButtonPlayClicked = true;

  update();
  hideUserInterFace();

  timer.gameTimer = setInterval(() => {
    if (!game.gameLoop) return;
    for (let i = stuff.length - 1; i >= 0; i--) {
      if (stuff[i].end === timer.timerCounter) stuff.splice(i, 1);
    }
    timer.timerCounter--;
    document.querySelector(".timer-value").textContent = timer.timerCounter;
    // if (timer.timerCounter <= 0) gameOver();
  }, 1000);
}
