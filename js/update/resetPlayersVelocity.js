import { player, enemy } from "../players.js";

export default function resetPlayersVelocity() {
  player.vel.x = 0;
  enemy.vel.x = 0;
}
