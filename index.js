// TO DO LIST:
// -----------
// 1) MAKE SUPER HIT with charging
// 2) MAKE SHURICANS
// 3) MAKE SOUNDS
// 4) MAKE UI
// 5) MAKE PARTICKLES ABOVE FEET
// 6) MAKE MUSIC
// 7) REFACTOR CODE AND MAKE IT MODULES
// 8) APPLY PIXELS FONT
// 9) preload images
// 10) When player is hitted, he can`t hit back
// -----------

// ISSUE
// 1) When the last hit is in head, you die, but health bar is not changed
// 2) Sometimes first enemy hit doesn't change the health bar

import { Player } from "./js/Player.js";
import { keys } from "./js/keys.js";
import { Stuff } from "./js/Stuff.js";
import { randNum } from "./js/mathFunc.js";

//----------------------------------------------------------------
// INIT STUFF
//----------------------------------------------------------------
const playerWidth = 70;
const playerHeight = 150;

const playerJumpForce = 20;
const playerSpeed = 10;

const playersUpf = 5;

let gameLoop = true;
requestAnimationFrame(update);

document
  .querySelector(".start-game-button")
  .addEventListener("click", function startGame() {
    gameLoop = true;
    requestAnimationFrame(update);
    document
      .querySelector(".start-game-button")
      .removeEventListener("click", startGame);
    document.querySelector(".user-ui").classList.add("hidden");
    document.querySelector(".health-timer-box").classList.remove("hidden");
  });

let timerCounter = 60;
let maxTimerCounter = timerCounter;

const playerSizeCof = 2.3;

//----------------------------------------------------------------
// set timer value in html
//----------------------------------------------------------------
document.querySelector(".timer-value").textContent = timerCounter;

let forStuffCounter = 0;
let forStuffCountRemainder = 200;

const stuff = [];

const hitBoxes = {
  player: {
    head: {
      size: 20,
      offset: {
        x: 28,
        y: 20,
      },
    },
    body: {
      size: 40,
    },
    legs: {
      size: 50,
    },
  },
  enemy: {
    head: {
      size: 20,
      offset: {
        x: 20,
        y: 15,
      },
    },
    body: {
      size: 40,
    },
    legs: {
      size: 55,
    },
  },
};

//----------------------------------------------------------------
// INITIALIZE PLAYERS
//----------------------------------------------------------------
const player = new Player({
  pos: {
    x: canvas.width / 2 - canvas.width / 4 - playerWidth / 2,
    y: 100,
  },
  color: "brown",
  width: playerWidth,
  height: 130,
  attackBox: {
    pos: {
      x: canvas.width / 2 - canvas.width / 4 - playerWidth / 2,
      y: 0,
    },
    offset: {
      x: playerWidth,
      y: 50,
    },
    color: "green",
    width: playerWidth * 2,
    height: 20,
  },
  hitBoxes: {
    head: {
      pos: {
        x: 0,
        y: 0,
      },
      color: "red",
      offset: {
        x: hitBoxes.player.head.offset.x,
        y: hitBoxes.player.head.offset.y,
      },
      width: hitBoxes.player.head.size,
      height: hitBoxes.player.head.size,
    },
    body: {
      pos: {
        x: canvas.width / 2 - canvas.width / 4 - playerWidth / 2,
        y: 0,
      },
      color: "blue",
      offset: {
        x: 0,
        y: hitBoxes.player.head.size + hitBoxes.player.head.offset.y,
      },
      width: playerWidth,
      height: hitBoxes.player.body.size,
    },
    legs: {
      pos: {
        x: canvas.width / 2 - canvas.width / 4 - playerWidth / 2,
        y: 0,
      },
      color: "green",
      offset: {
        x: 0,
        y:
          hitBoxes.player.body.size +
          hitBoxes.player.head.size +
          hitBoxes.player.head.offset.y,
      },
      width: playerWidth,
      height: hitBoxes.player.legs.size,
    },
  },
  healthLine: document.querySelector(".player-health-line"),
  imageSrc: "./assets/sprites/players/samuraiMack/Idle.png",
  sizeCof: playerSizeCof,
  floor: canvas.height - 110,
  imageOffset: {
    x: -195,
    y: -155,
  },
  framesAmount: 8,
  upf: playersUpf,
  sprites: {
    idle: {
      imageSrc: "./assets/sprites/players/samuraiMack/Idle.png",
      framesAmount: 8,
      upf: playersUpf,
    },
    run: {
      imageSrc: "./assets/sprites/players/samuraiMack/Run.png",
      framesAmount: 8,
      upf: 2,
    },
    jump: {
      imageSrc: "./assets/sprites/players/samuraiMack/Jump.png",
      framesAmount: 2,
      upf: 8,
    },
    fall: {
      imageSrc: "./assets/sprites/players/samuraiMack/Fall.png",
      framesAmount: 2,
      upf: 8,
    },
    attack1: {
      imageSrc: "./assets/sprites/players/samuraiMack/Attack1.png",
      framesAmount: 6,
      upf: 5,
    },
    attack2: {
      imageSrc: "./assets/sprites/players/samuraiMack/Attack2.png",
      framesAmount: 6,
      upf: 5,
    },
    hit: {
      imageSrc: "./assets/sprites/players/samuraiMack/Take_Hit.png",
      framesAmount: 4,
      upf: 4,
    },
    death: {
      imageSrc: "./assets/sprites/players/samuraiMack/Death.png",
      framesAmount: 6,
      upf: 5,
    },
  },
  sounds: {
    run: {
      audioSrc: "./assets/audio/run/run_1.mp3",
      audiosSrc: ["./assets/audio/run/run_2.mp3"],
    },
    jump: {},
    fall: {},
    attack1: {},
    attack2: {},
    hit: {
      audioSrc: "./assets/audio/get_hit/get_hit_1.mp3",
      audiosSrc: [
        "./assets/audio/get_hit/get_hit_1.mp3",
        "./assets/audio/get_hit/get_hit_2.mp3",
        "./assets/audio/get_hit/get_hit_3.mp3",
      ],
    },
    death: {},
  },
});

const enemy = new Player({
  pos: {
    x: canvas.width / 2 + canvas.width / 4 - playerWidth / 2,
    y: 0,
  },
  color: "yellow",
  width: playerWidth,
  height: 130,
  attackBox: {
    pos: {
      x: canvas.width / 2 - canvas.width / 4 - playerWidth / 2,
      y: 0,
    },
    offset: {
      x: -(playerWidth * 2 - playerWidth) - playerWidth,
      y: 50,
    },
    color: "green",
    width: playerWidth * 2,
    height: 20,
  },
  hitBoxes: {
    head: {
      pos: {
        x: 0,
        y: 0,
      },
      color: "red",
      offset: {
        x: hitBoxes.enemy.head.offset.x,
        y: hitBoxes.enemy.head.offset.y,
      },
      width: hitBoxes.enemy.head.size,
      height: hitBoxes.enemy.head.size,
    },
    body: {
      pos: {
        x: canvas.width / 2 - canvas.width / 4 - playerWidth / 2,
        y: 0,
      },
      color: "blue",
      offset: {
        x: 0,
        y: hitBoxes.enemy.head.size + hitBoxes.enemy.head.offset.y,
      },
      width: playerWidth,
      height: hitBoxes.enemy.body.size,
    },
    legs: {
      pos: {
        x: canvas.width / 2 - canvas.width / 4 - playerWidth / 2,
        y: 0,
      },
      color: "green",
      offset: {
        x: 0,
        y:
          hitBoxes.enemy.body.size +
          hitBoxes.enemy.head.size +
          hitBoxes.enemy.head.offset.y,
      },
      width: playerWidth,
      height: hitBoxes.enemy.legs.size,
    },
  },
  healthLine: document.querySelector(".enemy-health-line"),
  imageSrc: "./assets/sprites/players/kenji/Idle.png",
  sizeCof: playerSizeCof,
  floor: canvas.height - 110,
  imageOffset: {
    x: -190,
    y: -167,
  },
  framesAmount: 4,
  upf: playersUpf,
  sprites: {
    idle: {
      imageSrc: "./assets/sprites/players/kenji/Idle.png",
      framesAmount: 4,
      upf: 8,
    },
    run: {
      imageSrc: "./assets/sprites/players/kenji/Run.png",
      framesAmount: 8,
      upf: 2,
    },
    jump: {
      imageSrc: "./assets/sprites/players/kenji/Jump.png",
      framesAmount: 2,
      upf: 8,
    },
    fall: {
      imageSrc: "./assets/sprites/players/kenji/Fall.png",
      framesAmount: 2,
      upf: 8,
    },
    attack1: {
      imageSrc: "./assets/sprites/players/kenji/Attack1.png",
      framesAmount: 4,
      upf: 8,
      // 8
    },
    attack2: {
      imageSrc: "./assets/sprites/players/kenji/Attack2.png",
      framesAmount: 4,
      upf: 8,
    },
    hit: {
      imageSrc: "./assets/sprites/players/kenji/Take_Hit.png",
      framesAmount: 4,
      upf: 4,
    },
    death: {
      imageSrc: "./assets/sprites/players/kenji/Death.png",
      framesAmount: 8,
      upf: 7,
    },
  },
  sounds: {
    run: {
      audioSrc: "./assets/audio/run/run_1.mp3",
      audiosSrc: ["./assets/audio/run/run_2.mp3"],
    },
    jump: {},
    fall: {},
    attack1: {},
    attack2: {},
    hit: {
      audioSrc: "./assets/audio/get_hit/get_hit_1.mp3",
      audiosSrc: [
        "./assets/audio/get_hit/get_hit_1.mp3",
        "./assets/audio/get_hit/get_hit_2.mp3",
        "./assets/audio/get_hit/get_hit_3.mp3",
      ],
    },
    death: {},
  },
});

//----------------------------------------------------------------
// INITIALIZE SPRITES
//----------------------------------------------------------------

//----------------------------------------------------------------
// INITIALIZE TIMER
//----------------------------------------------------------------
const gameTimer = setInterval(() => {
  if (!gameLoop) return;
  for (let i = stuff.length - 1; i >= 0; i--) {
    if (stuff[i].end === timerCounter) {
      stuff.splice(i, 1);
    }
  }

  timerCounter--;

  document.querySelector(".timer-value").textContent = timerCounter;

  if (timerCounter <= 0) {
    gameOver();
  }
}, 1000);

//----------------------------------------------------------------
// GAME LOOP
//----------------------------------------------------------------
function update() {
  //----------------------------------------------------------------
  // CLEAR CANVAS
  //----------------------------------------------------------------
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //----------------------------------------------------------------
  // UPDATES
  //----------------------------------------------------------------
  player.update();
  enemy.update();
  stuff.forEach((obj) => obj.update());

  //----------------------------------------------------------------
  // RESET PLAYERS VELOCITY
  //----------------------------------------------------------------
  player.vel.x = 0;
  enemy.vel.x = 0;

  //----------------------------------------------------------------
  // MOVE PLAYERS
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  // move player
  //----------------------------------------------------------------
  if (keys.a.pressed && player.lastKey === "a") {
    player.vel.x = -playerSpeed;
    if (player.vel.y === 0) {
      player.switchSprite("run");
      player.playSound("run");
    }
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.vel.x = playerSpeed;
    if (player.vel.y === 0) {
      player.switchSprite("run");
      player.playSound("run");
    }
  } else if (player.vel.y === 0) {
    player.switchSprite("idle");
  }

  //----------------------------------------------------------------
  // move enemy
  //----------------------------------------------------------------
  if (keys.arrowLeft.pressed && enemy.lastKey === "arrowLeft") {
    enemy.vel.x = -playerSpeed;
    if (enemy.vel.y === 0) {
      enemy.switchSprite("run");
      enemy.playSound("run");
    }
  } else if (keys.arrowRight.pressed && enemy.lastKey === "arrowRight") {
    enemy.vel.x = playerSpeed;
    if (enemy.vel.y === 0) {
      enemy.switchSprite("run");
      enemy.playSound("run");
    }
  } else if (enemy.vel.y === 0) {
    enemy.switchSprite("idle");
  }

  //----------------------------------------------------------------
  // PLYEARS JUMP
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  // player jump
  //----------------------------------------------------------------
  if (player.vel.y < 0) {
    player.switchSprite("jump");
  } else if (player.vel.y > 0) {
    player.switchSprite("fall");
  }

  //----------------------------------------------------------------
  // enemy jump
  //----------------------------------------------------------------

  if (enemy.vel.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.vel.y > 0) {
    enemy.switchSprite("fall");
  }

  //----------------------------------------------------------------
  // ATTACK BOXES
  //----------------------------------------------------------------
  const playerAB = player.attackBox;
  const enemyAB = enemy.attackBox;

  //----------------------------------------------------------------
  // PLAYERS ATTACKING
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  // player hitbox
  //----------------------------------------------------------------

  if (player.isAttacking && player.currentFrame === 4) {
    const playerHit = {
      head:
        playerAB.pos.x + playerAB.width >= enemy.hitBoxes.head.pos.x &&
        playerAB.pos.x <=
          enemy.hitBoxes.head.pos.x + enemy.hitBoxes.head.width &&
        playerAB.pos.y + playerAB.height >= enemy.hitBoxes.head.pos.y &&
        playerAB.pos.y <=
          enemy.hitBoxes.head.pos.y + enemy.hitBoxes.head.height,
      body:
        playerAB.pos.x + playerAB.width >= enemy.hitBoxes.body.pos.x &&
        playerAB.pos.x <=
          enemy.hitBoxes.body.pos.x + enemy.hitBoxes.body.width &&
        playerAB.pos.y + playerAB.height >= enemy.hitBoxes.body.pos.y &&
        playerAB.pos.y <=
          enemy.hitBoxes.body.pos.y + enemy.hitBoxes.body.height,
      legs:
        playerAB.pos.x + enemyAB.width >= enemy.hitBoxes.legs.pos.x &&
        playerAB.pos.x <=
          enemy.hitBoxes.legs.pos.x + enemy.hitBoxes.legs.width &&
        playerAB.pos.y + enemyAB.height >= enemy.hitBoxes.legs.pos.y &&
        playerAB.pos.y <=
          enemy.hitBoxes.legs.pos.y + enemy.hitBoxes.legs.height,
    };

    //----------------------------------------------------------------
    // check what has been hitted
    //----------------------------------------------------------------
    for (const hit in playerHit) {
      if (playerHit[hit] && hit === "head") {
        console.log("Enemy hited: ", hit);
        enemy.takeHit("head", player.power);
        enemy.playSound("hit");

        if (enemy.health > 0) {
          enemy.switchSprite("hit");
        } else {
          enemy.switchSprite("death");
          enemy.isDead = true;
        }

        player.isAttacking = false;
        break;
      } else if (playerHit[hit] && hit === "body") {
        console.log("Enemy hited: ", hit);
        enemy.takeHit("body", player.power);
        enemy.playSound("hit");

        if (enemy.health > 0) {
          enemy.switchSprite("hit");
        } else {
          enemy.switchSprite("death");
          enemy.isDead = true;
        }

        player.isAttacking = false;
        break;
      } else if (playerHit[hit] && hit === "legs") {
        console.log("Enemy hited: ", hit);
        enemy.takeHit("legs", player.power);
        enemy.playSound("hit");

        if (enemy.health > 0) {
          enemy.switchSprite("hit");
        } else {
          enemy.switchSprite("death");
          enemy.isDead = true;
        }

        player.isAttacking = false;
        break;
      }
    }
  }

  //----------------------------------------------------------------
  // enemy hitbox
  //----------------------------------------------------------------
  if (enemy.isAttacking && enemy.currentFrame === 1) {
    const enemyHit = {
      head:
        enemyAB.pos.x + enemyAB.width >= player.hitBoxes.head.pos.x &&
        enemyAB.pos.x <=
          player.hitBoxes.head.pos.x + player.hitBoxes.head.width &&
        enemyAB.pos.y + enemyAB.height >= player.hitBoxes.head.pos.y &&
        enemyAB.pos.y <=
          player.hitBoxes.head.pos.y + player.hitBoxes.head.height,
      body:
        enemyAB.pos.x + enemyAB.width >= player.hitBoxes.body.pos.x &&
        enemyAB.pos.x <=
          player.hitBoxes.body.pos.x + player.hitBoxes.body.width &&
        enemyAB.pos.y + enemyAB.height >= player.hitBoxes.body.pos.y &&
        enemyAB.pos.y <=
          player.hitBoxes.body.pos.y + player.hitBoxes.body.height,
      legs:
        enemyAB.pos.x + enemyAB.width >= player.hitBoxes.legs.pos.x &&
        enemyAB.pos.x <=
          player.hitBoxes.legs.pos.x + player.hitBoxes.legs.width &&
        enemyAB.pos.y + enemyAB.height >= player.hitBoxes.legs.pos.y &&
        enemyAB.pos.y <=
          player.hitBoxes.legs.pos.y + player.hitBoxes.legs.height,
    };

    //----------------------------------------------------------------
    // check what has been hitted
    //----------------------------------------------------------------
    for (const hit in enemyHit) {
      if (enemyHit[hit] && hit === "head") {
        console.log("Player hited:", hit);
        player.takeHit("head", enemy.power);
        player.playSound("hit");

        if (player.health > 0) {
          player.switchSprite("hit");
        } else {
          player.switchSprite("death");
          player.isDead = true;
        }

        enemy.isAttacking = false;
        break;
      } else if (enemyHit[hit] && hit === "body") {
        console.log("Player hited:", hit);
        player.takeHit("body", enemy.power);
        player.playSound("hit");

        if (player.health > 0) {
          player.switchSprite("hit");
        } else {
          player.switchSprite("death");
          player.isDead = true;
        }

        enemy.isAttacking = false;
        break;
      } else if (enemyHit[hit] && hit === "legs") {
        console.log("Player hited:", hit);
        player.takeHit("legs", enemy.power);
        player.playSound("hit");

        if (player.health > 0) {
          player.switchSprite("hit");
        } else {
          player.switchSprite("death");
          player.isDead = true;
        }

        enemy.isAttacking = false;
        break;
      }
    }
  }

  //----------------------------------------------------------------
  // IS ATTACKING
  //----------------------------------------------------------------
  if (
    (player.image === player.sprites.attack1.image ||
      player.image === player.sprites.attack2.image) &&
    player.currentFrame > 3
  ) {
    player.isAttacking = false;
  }

  if (
    (enemy.image === enemy.sprites.attack1.image ||
      enemy.image === enemy.sprites.attack2.image) &&
    enemy.currentFrame > 0
  ) {
    enemy.isAttacking = false;
  }

  //----------------------------------------------------------------
  // IS ALIVE
  //----------------------------------------------------------------
  if (
    player.isDead &&
    player.currentFrame === player.sprites.death.framesAmount - 1
  ) {
    player.frameCounter = 0;
    gameOver();
  }
  if (
    enemy.isDead &&
    enemy.currentFrame === enemy.sprites.death.framesAmount - 1
  ) {
    gameOver();
  }

  //----------------------------------------------------------------
  // SPAWN STUFF
  //----------------------------------------------------------------
  if (
    forStuffCounter % forStuffCountRemainder === 0 &&
    Math.random() > 0.9 &&
    timerCounter <= maxTimerCounter - 10
  ) {
    const size = 40;
    const roles = [
      {
        name: "kit",
        imageSrc: "./assets/sprites/stuff/pickup/kit.png",
        sizeCof: 2,
        imageOffset: {
          x: -11,
          y: -11,
        },
      },
      {
        name: "def",
        imageSrc: "./assets/sprites/stuff/pickup/def.png",
        sizeCof: 2,
        imageOffset: {
          x: -11,
          y: -11,
        },
      },
      {
        name: "pow",
        imageSrc: "./assets/sprites/stuff/pickup/pow.png",
        sizeCof: 2,
        imageOffset: {
          x: -11,
          y: -11,
        },
      },
    ];

    stuff.push(
      new Stuff({
        pos: {
          x: randNum(size, canvas.width - size),
          y: -size,
        },
        width: size,
        height: size,
        floor: canvas.height - 110,
        role: roles[Math.floor(Math.random() * roles.length)],
      })
    );
  }

  //----------------------------------------------------------------
  // PICK UP STUFF
  //----------------------------------------------------------------
  if (stuff.length > 0) {
    for (let i = stuff.length - 1; i >= 0; i--) {
      const playerPickedUpStuff =
        player.pos.x + player.width >= stuff[i].pos.x &&
        player.pos.x <= stuff[i].pos.x + stuff[i].width &&
        player.pos.y + player.height >= stuff[i].pos.y &&
        player.pos.y <= stuff[i].pos.y + stuff[i].height;

      const enemyPickedUpStuff =
        enemy.pos.x + enemy.width >= stuff[i].pos.x &&
        enemy.pos.x <= stuff[i].pos.x + stuff[i].width &&
        enemy.pos.y + enemy.height >= stuff[i].pos.y &&
        enemy.pos.y <= stuff[i].pos.y + stuff[i].height;

      if (playerPickedUpStuff) {
        player.getBonus(stuff[i].role.name);
        stuff.splice(i, 1);
        continue;
      }

      if (enemyPickedUpStuff) {
        enemy.getBonus(stuff[i].role.name);
        stuff.splice(i, 1);
      }
    }
  }

  //----------------------------------------------------------------
  // REVERCE PLAYERS IF PLAYER IS BEHIND
  //----------------------------------------------------------------
  const isBehind = player.pos.x >= enemy.pos.x;

  if (isBehind) {
    player.attackBox.offset.x = -(playerWidth * 2 - playerWidth) - playerWidth;
    enemy.attackBox.offset.x = playerWidth;
  } else {
    player.attackBox.offset.x = playerWidth;
    enemy.attackBox.offset.x = -(playerWidth * 2 - playerWidth) - playerWidth;
  }

  //----------------------------------------------------------------
  // increase stuff counter
  //----------------------------------------------------------------
  forStuffCounter++;

  if (gameLoop) requestAnimationFrame(update);
}

function gameOver() {
  gameLoop = false;
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
