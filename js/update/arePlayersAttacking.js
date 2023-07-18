import { player, enemy } from "../players.js";

export default function arePlayersAttacking() {
  player.checkIfIsAttacking(3);
  enemy.checkIfIsAttacking(0);
}
