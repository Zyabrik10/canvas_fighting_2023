export default class Sprite {
  constructor({
    image,
    image_rev,
    pos,
    color,
    width,
    height,
    sizeCof = 1,
    imageOffset = { x: 0, y: 0 },
    imageOffsetRev = { x: 0, y: 0 },
    framesAmount = 1,
    upf = 2,
  }) {
    this.image = image;

    this.sizeCof = sizeCof;

    this.pos = pos;

    this.color = color;

    this.width = width;
    this.height = height;

    this.imageOffset = imageOffset;
    this.imageOffsetRev = imageOffsetRev;

    this.framesAmount = framesAmount;
    this.currentFrame = 0;

    this.frameCounter = 0;

    this.upf = upf;

    this.frameWidth = this.image ? this.image.width / this.framesAmount : 0;

    this.flliped = false;
    this.image_rev = image_rev;
  }

  draw(ctx) {
    const k = this.flliped ? 0 : this.imageOffsetRev.x;
    ctx.drawImage(
      this.image,
      this.frameWidth * this.currentFrame,
      0,
      this.frameWidth,
      this.image.height,
      this.pos.x + this.imageOffset.x - k,
      this.pos.y + this.imageOffset.y,
      this.frameWidth * this.sizeCof,
      this.image.height * this.sizeCof
    );
  }

  updateFrame() {
    if (this.frameCounter % this.upf === 0) {
      this.currentFrame += 1;

      if (this.currentFrame >= this.framesAmount) this.currentFrame = 0;
    }
    this.frameCounter++;
  }

  update(ctx) {
    this.updateFrame();
    this.draw(ctx);
  }
}
