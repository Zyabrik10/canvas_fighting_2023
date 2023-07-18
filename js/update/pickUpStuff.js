import { stuff } from "../init/initGlobalVariables.js";
import { enemy, player } from "../players.js";

export default function pickUpStuff() {
  if (stuff.length > 0) {
    for (let i = stuff.length - 1; i >= 0; i--) {
      if (player.canPickUpStuff(stuff[i])) {
        player.getBonus(stuff[i].role.name);
        stuff.splice(i, 1);
        continue;
      }

      if (enemy.canPickUpStuff(stuff[i])) {
        enemy.getBonus(stuff[i].role.name);
        stuff.splice(i, 1);
      }
    }
  }
}
