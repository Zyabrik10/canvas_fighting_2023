import Player from "./class/Player";
import instances from "./instances";
import worldSettings from "./world-settings";

export default function createInstances(
  canvas,
  { player: playerImg, enemy: enemyImg },
  { attack, get_hit, jump, landing, run }
) {
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
          x: 30,
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

  const playerWidth = 70;
  const playerHeight = 150;

  const playerJumpForce = 20;

  const playersUpf = 5;

  const playerSizeCof = 2.3;

  instances.player = new Player({
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
        buffOffset: {
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
    image: playerImg.idle,
    image_rev: playerImg.idle_rev,
    sizeCof: playerSizeCof,
    floor: worldSettings.floorlFloor,
    imageOffset: {
      x: -195,
      y: -155,
    },
    imageOffsetRev: {
      x: 0,
      y: 0,
    },
    framesAmount: 8,
    upf: playersUpf,
    sprites: {
      idle: {
        image: playerImg.idle,
        image_rev: playerImg.idle_rev,
        framesAmount: 8,
        upf: playersUpf,
      },
      run: {
        image: playerImg.run,
        image_rev: playerImg.run_rev,
        framesAmount: 8,
        upf: 2,
      },
      jump: {
        image: playerImg.jump,
        image_rev: playerImg.jump_rev,
        framesAmount: 2,
        upf: 8,
      },
      fall: {
        image: playerImg.fall,
        image_rev: playerImg.fall_rev,
        framesAmount: 2,
        upf: 8,
      },
      attack1: {
        image: playerImg.attack1,
        image_rev: playerImg.attack1_rev,
        framesAmount: 6,
        upf: 5,
      },
      attack2: {
        image: playerImg.attack2,
        image_rev: playerImg.attack2_rev,
        framesAmount: 6,
        upf: 5,
      },
      hit: {
        image: playerImg.hit,
        image_rev: playerImg.hit_rev,
        framesAmount: 4,
        upf: 4,
      },
      death: {
        image: playerImg.death,
        image_rev: playerImg.death_rev,
        framesAmount: 6,
        upf: 5,
      },
    },
    sounds: {
      attack,
      get_hit,
      jump,
      landing,
      run,
      death: get_hit,
    },
  });

  instances.enemy = new Player({
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
        buffOffset: {
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
    image: enemyImg.idle,
    image_rev: enemyImg.idle_rev,
    sizeCof: playerSizeCof,
    floor: worldSettings.floorlFloor,
    imageOffset: {
      x: -190,
      y: -167,
    },
    imageOffsetRev: {
      x: 10,
      y: 0,
    },
    framesAmount: 4,
    upf: playersUpf,
    sprites: {
      idle: {
        image: enemyImg.idle,
        image_rev: enemyImg.idle_rev,
        framesAmount: 4,
        upf: 8,
      },
      run: {
        image: enemyImg.run,
        image_rev: enemyImg.run_rev,
        framesAmount: 8,
        upf: 2,
      },
      jump: {
        image: enemyImg.jump,
        image_rev: enemyImg.jump_rev,
        framesAmount: 2,
        upf: 8,
      },
      fall: {
        image: enemyImg.fall,
        image_rev: enemyImg.fall_rev,
        framesAmount: 2,
        upf: 8,
      },
      attack1: {
        image: enemyImg.attack1,
        image_rev: enemyImg.attack1_rev,
        framesAmount: 4,
        upf: 8,
      },
      attack2: {
        image: enemyImg.attack2,
        image_rev: enemyImg.attack2_rev,
        framesAmount: 4,
        upf: 8,
      },
      hit: {
        image: enemyImg.hit,
        image_rev: enemyImg.hit_rev,
        framesAmount: 4,
        upf: 4,
      },
      death: {
        image: enemyImg.death,
        image_rev: enemyImg.death_rev,
        framesAmount: 8,
        upf: 7,
      },
    },
    sounds: {
      attack,
      get_hit,
      jump,
      landing,
      run,
      death: get_hit,
    },
  });
}
