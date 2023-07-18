import { player, enemy } from "../players.js";
import { stuff, particles } from "../init/initGlobalVariables.js";

export default function globalUpdate() {
  player.update();
  enemy.update();
  stuff.forEach((obj) => obj.update());
  if (particles.length) {
    particles.forEach((particle, index) => {
      particle.update();

      if (particle.alpha <= 0) {
        particles.splice(index, 1);
      }
    });
  }
}
