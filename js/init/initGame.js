import { timer } from "./timer.js";
import { stuff } from "./initGlobalVariables.js";
import Stuff from "../Stuff.js";
import { hideUserInterFace } from "../userInterface.js";
import { userButtons } from "./initUserInterface.js";
import update from "../update/mainUpdateFunction.js";
import globalUpdate from "../update/globalUpdate.js";

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
    if (timer.timerCounter <= 0) gameOver();
  }, 1000);
}

const kit = new Stuff({
  role: 0,
  pos: {
    x: 0,
    y: 0,
  },
});
const def = new Stuff({
  role: 1,
  pos: {
    x: 0,
    y: 0,
  },
});
const pow = new Stuff({
  role: 2,
  pos: {
    x: 0,
    y: 0,
  },
});

stuff.push(kit);
stuff.push(def);
stuff.push(pow);

for (let i = 0; i < 10; i++) {
  globalUpdate();
}

stuff.splice(0, stuff.length);
