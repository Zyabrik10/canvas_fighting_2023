import { player, enemy } from "../players.js";
import keys from "../config/keys.js";

export default function movePlayers() {
  player.movePlayerOn(keys.a, keys.d);
  enemy.movePlayerOn(keys.arrowLeft, keys.arrowRight);
}
