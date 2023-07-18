import { game } from "../init/initGame.js";
import { userButtons } from "../init/initUserInterface.js";
import { timer } from "../init/timer.js";
import { canvas, ctx } from "../init/initCanvas.js";

export default function gameOver() {
  game.gameLoop = false;
  userButtons.isButtonPlayClicked = false;
  timer.timerCounter = timer.maxTimerCounter;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(timer.gameTimer);
}
