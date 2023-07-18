import { player, enemy } from "../players.js";

export default function playersAttacking() {
  player.checkHitBox(enemy, 1);
  enemy.checkHitBox(player, 4);
}
