// TO DO LIST:
// -----------
// 1) MAKE SUPER HIT with charging
// 2) MAKE SHURICANS
// 3) MAKE PARTICKLES ABOVE FEET
// 4) MAKE MUSIC
// 5) PREALOAD IMAGES
// -----------

// BUGS
// 1) When the last hit is in head, you die, but health bar is not changed

import { keys } from "./js/keys.js";
import { Stuff } from "./js/Stuff.js";
import { generalFloor } from "./js/initGlobalVariables.js";
import { hideUserInterFace } from "./js/userInterface.js";
import { player, enemy, playerJumpForce } from "./js/players.js";

let gameLoop = false;
// requestAnimationFrame(update);

// INITIALIZE TIMER
let gameTimer;
let isButtonClicked = false;

function initGame() {
  gameLoop = true;
  isButtonClicked = true;

  update();
  hideUserInterFace();

  gameTimer = setInterval(() => {
    if (!gameLoop) return;
    for (let i = stuff.length - 1; i >= 0; i--) {
      if (stuff[i].end === timerCounter) stuff.splice(i, 1);
    }
    timerCounter--;
    document.querySelector(".timer-value").textContent = timerCounter;
    if (timerCounter <= 0) gameOver();
  }, 1000);
}

let timerCounter = 60;
const maxTimerCounter = timerCounter;

let forStuffCounter = 0;
let forStuffCountRemainder = 200;

const stuff = [];

document
  .querySelector(".start-game-button")
  .addEventListener("click", function startGame() {
    if (isButtonClicked) return;
    document.querySelector(".timer-value").textContent = timerCounter;
    initGame();
  });

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // UPDATES
  player.update();
  enemy.update();
  stuff.forEach((obj) => obj.update());

  // RESET PLAYERS VELOCITY
  player.vel.x = 0;
  enemy.vel.x = 0;

  // MOVE PLAYERS
  player.movePlayerOn(keys.a, keys.d);
  enemy.movePlayerOn(keys.arrowLeft, keys.arrowRight);

  // PLYEARS JUMP
  player.ifJumped();
  enemy.ifJumped();

  // PLAYERS ATTACKING
  player.checkHitBox(enemy, 1);
  enemy.checkHitBox(player, 4);

  // IS ATTACKING
  player.checkIfIsAttacking(3);
  enemy.checkIfIsAttacking(0);

  // IS ALIVE
  player.checkIfIsAlive(gameOver);
  enemy.checkIfIsAlive(gameOver);

  // SPAWN STUFF
  if (forStuffCounter % forStuffCountRemainder === 0 && Math.random() > 0.7) {
    stuff.push(new Stuff({ floor: generalFloor }));
  }

  // PICK UP STUFF
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

  // REVERCE PLAYERS IF PLAYER IS BEHIND
  player.isBehind(enemy);

  forStuffCounter++;

  if (gameLoop) requestAnimationFrame(update);
}

function gameOver() {
  gameLoop = false;
  isButtonClicked = false;
  timerCounter = maxTimerCounter;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(gameTimer);
}

window.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "KeyD":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "KeyW":
      if (player.pos.y + player.height >= player.floor)
        player.vel.y = -playerJumpForce;
      break;
    case "Space":
      if (!keys.space.pressed) {
        player.attack();

        keys.space.pressed = true;

        setTimeout(() => {
          keys.space.pressed = false;
        }, 500);
      }
  }

  switch (code) {
    case "ArrowRight":
      keys.arrowRight.pressed = true;
      enemy.lastKey = "arrowRight";
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      enemy.lastKey = "arrowLeft";
      break;
    case "ArrowUp":
      if (enemy.pos.y + enemy.height >= enemy.floor)
        enemy.vel.y = -playerJumpForce;
      break;
    case "KeyF":
      if (!keys.f.pressed) {
        enemy.attack();
        keys.f.pressed = true;

        setTimeout(() => {
          keys.f.pressed = false;
        }, 500);
      }
  }
});

window.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "KeyW":
      keys.w.pressed = false;
      break;
  }

  switch (code) {
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.arrowUp.pressed = false;
      break;
  }
});

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  player.floor = canvas.height;
  enemy.floor = canvas.height;

  stuff.forEach((stf) => (stf.floor = canvas.height));
});
