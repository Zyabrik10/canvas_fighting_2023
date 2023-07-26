// TO DO LIST:
// -----------
// 1) MAKE SUPER HIT with charging
// 2) MAKE SHURICANS
// 3) MAKE MUSIC
// 4) PREALOAD IMAGES
// 5) MAKE UI SETTINGS
// 6) ADD PREVIEW VOIS ROUND 1
// 7) MAKE MULRYROUND GAME
// -----------

// BUGS
// 1) When the last hit, you die, but health bar is not changed
// 2) Whe player encounter the wall the animation doesn`t stop

import keys from "./js/config/keys.js";
import { stuff } from "./js/init/initGlobalVariables.js";
import { player, enemy, playerJumpForce } from "./js/players.js";
import { userButtons } from "./js/init/initUserInterface.js";
import { initGame } from "./js/init/initGame.js";
import { timer } from "./js/init/timer.js";
import { canvas, ctx } from "./js/init/initCanvas.js";

const startGameButton = document.querySelector(".start-game-button");

startGameButton.addEventListener("click", function startGame() {
  if (userButtons.isButtonPlayClicked) return;
  document.querySelector(".timer-value").textContent = timer.timerCounter;
  initGame();
});

window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "KeyD":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "KeyW":
      if (player.pos.y + player.height >= player.floor)
        player.vel.y = -playerJumpForce;
      break;
    case "Space":
      if (!keys.space.pressed) {
        player.attack();

        keys.space.pressed = true;

        setTimeout(() => {
          keys.space.pressed = false;
        }, 500);
      }
  }

  switch (code) {
    case "ArrowRight":
      keys.arrowRight.pressed = true;
      enemy.lastKey = "arrowRight";
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      enemy.lastKey = "arrowLeft";
      break;
    case "ArrowUp":
      if (enemy.pos.y + enemy.height >= enemy.floor)
        enemy.vel.y = -playerJumpForce;
      break;
    case "KeyL":
      if (!keys.f.pressed) {
        enemy.attack();
        keys.f.pressed = true;

        setTimeout(() => {
          keys.f.pressed = false;
        }, 500);
      }
  }
});

window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "KeyW":
      keys.w.pressed = false;
      break;
  }

  switch (code) {
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.arrowUp.pressed = false;
      break;
  }
});

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  player.floor = canvas.height;
  enemy.floor = canvas.height;

  stuff.forEach((stf) => (stf.floor = canvas.height));
});
