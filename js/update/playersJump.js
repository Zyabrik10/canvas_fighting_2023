import { player, enemy } from "../players.js";

export default function playersJump() {
  player.ifJumped();
  enemy.ifJumped();
}
