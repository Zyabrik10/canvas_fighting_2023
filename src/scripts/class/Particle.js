import Sprite from "./Sprite.js";
import { randInt } from "../math.js";

export default class Particle extends Sprite {
  constructor({
    pos,
    color = "rgba(100, 100, 100, 0.8)",
    vel,
    sizeCof = 1,
    imageOffset = { x: 0, y: 0 },
    framesAmount = 0,
    upf = 0,
    floor,
  }) {
    super({
      color,
      pos,
      floor,
      sizeCof,
      imageOffset,
      framesAmount,
      upf,
    });

    this.width = randInt(2, 10);
    this.height = this.width;

    this.vel = vel;

    this.alpha = 1;

    this.floor = floor;
  }

  move(canvas) {
    this.vel.y += 0.8;

    this.vel.x *= 0.99;
    this.vel.y *= 0.99;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    if (this.pos.y + this.height >= this.floor) {
      this.vel.y = 0;
      this.pos.y = this.floor - this.height;
      this.vel.x *= 0.6;
    }

    if (this.pos.x <= 0) {
      this.vel.x = 0;
      this.pos.x = 0;
    } else if (this.pos.x + this.width >= canvas.width) {
      this.vel.x = 0;
      this.pos.x = canvas.width - this.width;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    ctx.restore();
  }

  update(canvas, ctx) {
    this.move(canvas);
    this.draw(ctx);

    this.alpha -= 0.03;
  }
}
