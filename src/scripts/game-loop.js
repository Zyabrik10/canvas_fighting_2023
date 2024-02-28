import { instances } from "./instances";
import worldSettings from "./world-settings.js";

function movePlayers(keys, player, enemy) {
  player.movePlayerOn(keys.a, keys.d);
  enemy.movePlayerOn(keys.arrowLeft, keys.arrowRight);
}

function updatePlayers(canvas, ctx, player, enemy) {
  player.update(canvas, ctx);
  enemy.update(canvas, ctx);
}

function ifPlayersJump(player, enemy) {
  player.ifJumped();
  enemy.ifJumped();
}

function playersAttacking(player, enemy) {
  player.checkHitBox(enemy, 1);
  enemy.checkHitBox(player, 4);
}

function checkIfPlayerAreAttacking(player, enemy) {
  player.checkIfIsAttacking(3);
  enemy.checkIfIsAttacking(0);
}

function arePlayersAlive(player, enemy, func) {
  player.checkIfIsAlive(func);
  enemy.checkIfIsAlive(func);
}

function isPlayerBehindEnemy(player, enemy) {
  player.isBehind(enemy);
  enemy.isBehind(player);
}

function GameOver() {
  clearInterval(worldSettings.timer);
  cancelAnimationFrame(worldSettings.updateCanvas);
}

export default function gameLoop(canvas, ctx, keys) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayers(canvas, ctx, instances.player, instances.enemy);
  movePlayers(keys, instances.player, instances.enemy);
  ifPlayersJump(instances.player, instances.enemy);
  playersAttacking(instances.player, instances.enemy);
  checkIfPlayerAreAttacking(instances.player, instances.enemy);
  arePlayersAlive(instances.player, instances.enemy, GameOver);
  isPlayerBehindEnemy(instances.player, instances.enemy);
}
