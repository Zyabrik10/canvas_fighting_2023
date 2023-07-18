import Player from "./Player.js";
import { generalFloor } from "./init/initGlobalVariables.js";
import { canvas } from "./init/initCanvas.js";

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

export const playerWidth = 70;
export const playerHeight = 150;

export const playerJumpForce = 20;

export const playersUpf = 5;

export const playerSizeCof = 2.3;

export const player = new Player({
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
  floor: generalFloor,
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
      audiosSrc: [
        "./assets/audio/run/run_1.mp3",
        "./assets/audio/run/run_2.mp3",
      ],
    },
    jump: {
      audioSrc: "./assets/audio/jump/jump.mp3",
    },
    fall: {
      audioSrc: "./assets/audio/landing/landing.mp3",
    },
    attack1: {
      audioSrc: "./assets/audio/attack/attack_1.mp3",
    },
    attack2: {
      audioSrc: "./assets/audio/attack/attack_2.mp3",
    },
    hit: {
      audioSrc: "./assets/audio/get_hit/get_hit_1.mp3",
      audiosSrc: [
        "./assets/audio/get_hit/get_hit_1.mp3",
        "./assets/audio/get_hit/get_hit_2.mp3",
        "./assets/audio/get_hit/get_hit_3.mp3",
      ],
    },
    death: {
      audioSrc: "./assets/audio/get_hit/get_hit_3.mp3",
    },
  },
});

export const enemy = new Player({
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
  floor: generalFloor,
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
      audiosSrc: [
        "./assets/audio/run/run_1.mp3",
        "./assets/audio/run/run_2.mp3",
      ],
    },
    jump: {
      audioSrc: "./assets/audio/jump/jump.mp3",
    },
    fall: {
      audioSrc: "./assets/audio/landing/landing.mp3",
    },
    attack1: {
      audioSrc: "./assets/audio/attack/attack_1.mp3",
    },
    attack2: {
      audioSrc: "./assets/audio/attack/attack_2.mp3",
    },
    hit: {
      audioSrc: "./assets/audio/get_hit/get_hit_1.mp3",
      audiosSrc: [
        "./assets/audio/get_hit/get_hit_1.mp3",
        "./assets/audio/get_hit/get_hit_2.mp3",
        "./assets/audio/get_hit/get_hit_3.mp3",
      ],
    },
    death: {
      audioSrc: "./assets/audio/get_hit/get_hit_3.mp3",
    },
  },
});
