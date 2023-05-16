import { generalFloor } from "./initGlobalVariables.js";
import { randNum } from "./mathFunc.js";
import Sprite from "./Sprite.js";

export default class Stuff extends Sprite {
  roles = [
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

  role = this.roles[Math.floor(Math.random() * this.roles.length)];

  constructor({ floor = generalFloor, size = 40 }) {
    super({
      width: size,
      height: size,
    });

    this.sizeCof = this.role.sizeCof;
    this.imageOffset = this.role.imageOffset;

    this.imageSrc = this.role.imageSrc;
    this.image = new Image();
    this.image.src = this.imageSrc;

    this.size = size;

    this.pos = {
      x: randNum(this.size, canvas.width - this.size),
      y: -this.size,
    };

    this.color = `hsl(${randNum(0, 360)}, 80%, 50%)`;

    switch (this.role.name) {
      case "kit":
        this.color = `red`;
        break;
      case "def":
        this.color = `blue`;
        break;
      case "pow":
        this.color = `gold`;
        break;
    }

    this.vel = {
      x: randNum(-10, 10),
      y: 0,
    };

    this.floor = floor;

    this.end = undefined;

    this.frameWidth = this.image.width / this.framesAmount;
  }

  fall() {
    this.pos.y += this.vel.y;
    this.vel.y += 0.8;

    if (this.pos.y + this.height >= this.floor) {
      this.vel.y = 0;
      this.vel.x = 0;
      this.pos.y = this.floor - this.height;
    }
  }

  move() {
    this.pos.x += this.vel.x;

    if (this.pos.x + this.width >= canvas.width) {
      this.vel.x = 0;
      this.pos.x = canvas.width - this.width;
    } else if (this.pos.x <= 0) {
      this.vel.x = 0;
      this.pos.x = 0;
    }
  }

  drawCollision() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
    ctx.stroke();
  }

  update() {
    this.fall();
    this.move();
    this.drawCollision();
    this.draw();
  }
}
