import globalUpdate from "../update/globalUpdate.js";
import resetPlayersVelocity from "../update/resetPlayersVelocity.js";
import movePlayers from "../update/movePlayers.js";
import isPlayerBehindEnemy from "../update/isPlayerBehindEnemy.js";
import pickUpStuff from "../update/pickUpStuff.js";
import forStuff from "../init/stuff.js";
import spawnStuff from "../update/spawnStuff.js";
import arePlayersAttacking from "../update/arePlayersAttacking.js";
import playersAttacking from "../update/playersAttacking.js";
import playersJump from "../update/playersJump.js";
import { game } from "../init/initGame.js";
import { canvas, ctx } from "../init/initCanvas.js";
import arePlayersAlive from "./arePlayersAlive.js";

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  globalUpdate();
  resetPlayersVelocity();
  movePlayers();
  playersJump();
  playersAttacking();
  arePlayersAttacking();
  arePlayersAlive();
  spawnStuff();
  pickUpStuff();
  isPlayerBehindEnemy();

  forStuff.forStuffCounter++;

  if (game.gameLoop) requestAnimationFrame(update);
}

export default update;
