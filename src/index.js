import "./index.css";

import sprites from "./sprites.js";
import sounds from "./sounds.js";

import { createAndPrealodImagesForSprites } from "./scripts/images-func.js";
import { createAndPrealodSounds } from "./scripts/sounds-func.js";

import createInstances from "./scripts/createInstances.js";
import worldSettings from "./scripts/world-settings.js";
import gameLoop from "./scripts/game-loop";
import keys from "./keys.js";
import instances from "./scripts/instances.js";

let canvas, ctx;
const cWidth = 1200,
  cHeight = 600;

let currentTime = 0,
  ml = 1000;

const FPSToMs = (fps) => ml / fps;

const images = {};
const audios = {};

// UI
let loaderElement,
  loaderElementText,
  loaderElementBox,
  allElToLoad = 41,
  elLoaded = { loaded: 0 },
  userUI,
  buttonStartGame,
  timerUI,
  healthTimerBox;

function toggleUI(state) {
  !state ? userUI.classList.add("hidden") : userUI.classList.remove("hidden");
}

function toggleGameUI(state) {
  !state
    ? healthTimerBox.classList.add("hidden")
    : healthTimerBox.classList.remove("hidden");
}

function setCanvasControl(player, enemy) {
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
          player.vel.y = -player.jumpForce;
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
          enemy.vel.y = -enemy.jumpForce;
        break;
      case "KeyL":
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
}

const fpstoms = FPSToMs(worldSettings.fps);

function update(time) {
  worldSettings.deltaTime = time - currentTime;

  if (worldSettings.deltaTime > fpstoms) {
    gameLoop(canvas, ctx, keys);
    currentTime = time;
  }

  worldSettings.updateCanvas = requestAnimationFrame(update);
}

function resetGameSettings() {
  worldSettings.timer = undefined;
  worldSettings.updateCanvas = undefined;
  worldSettings.isGameRunning = false;
  worldSettings.time = 60;
}

function startGame() {
  toggleUI(false);
  toggleGameUI(true);
  resetGameSettings();
  timerUI.innerText = worldSettings.time;

  worldSettings.timer = setInterval(() => {
    worldSettings.time--;
    timerUI.innerText = worldSettings.time;

    if (worldSettings.time <= 0) {
      clearInterval(worldSettings.timer);
      cancelAnimationFrame(worldSettings.updateCanvas);
      return;
    }
  }, 1000);

  worldSettings.updateCanvas = requestAnimationFrame(update);
}

async function preStartUpdate() {
  await createAndPrealodImagesForSprites(
    sprites,
    images,
    loaderElementText,
    loaderElementBox,
    allElToLoad,
    elLoaded
  );
  await createAndPrealodSounds(
    sounds,
    audios,
    loaderElementText,
    loaderElementBox,
    allElToLoad,
    elLoaded
  );

  loaderElement.classList.add("hidden");
  toggleUI(true);

  createInstances(canvas, images, audios);
  setCanvasControl(instances.player, instances.enemy);

  console.log("All assets were loaded!");
}

window.addEventListener("load", () => {
  canvas = document.querySelector("#canvas-game-fighting");
  if (!canvas) throw new Error("canvas is not defined");

  canvas.width = cWidth;
  canvas.height = cHeight;

  ctx = canvas.getContext("2d");

  worldSettings.floor = canvas.height - 105;

  loaderElement = document.querySelector(".loader-element");
  loaderElementText = document.querySelector(".loader-element-text");
  loaderElementBox = document.querySelector(".loader-element-box");
  userUI = document.querySelector(".user-ui");
  buttonStartGame = document.querySelector(".start-game-button");
  timerUI = document.querySelector(".timer-value");
  healthTimerBox = document.querySelector(".health-timer-box");

  preStartUpdate()
    .then(() => {
      buttonStartGame.addEventListener("click", () => {
        startGame();
      });
    })
    .catch((e) => {
      console.log(e);
    });
});
