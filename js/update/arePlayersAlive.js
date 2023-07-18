import { player, enemy } from "../players.js";
import gameOver from "../gameOver/gameOver.js";

export default function arePlayersAlive() {
  player.checkIfIsAlive(gameOver);
  enemy.checkIfIsAlive(gameOver);
}
