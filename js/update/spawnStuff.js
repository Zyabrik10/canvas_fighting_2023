import { stuff, generalFloor } from "../init/initGlobalVariables.js";
import forStuff from "../init/stuff.js";
import Stuff from "../Stuff.js";

export default function spawnStuff() {
  if (
    forStuff.forStuffCounter % forStuff.forStuffCountRemainder === 0 &&
    Math.random() > 0.8
  ) {
    stuff.push(new Stuff({ floor: generalFloor }));
  }
}
