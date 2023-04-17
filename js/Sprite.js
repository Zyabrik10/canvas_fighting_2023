export class Sprite {
  constructor({ imageSrc, pos, color, width, height, sizeCof = 1, imageOffset = {x: 0, y: 0}, framesAmount = 1, upf = 2 }) {
    this.imageSrc = imageSrc;
    this.image = new Image();
    this.image.src = this.imageSrc;

    this.sizeCof = sizeCof;

    this.pos = pos;

    this.color = color;

    this.width = width;
    this.height = height;

    this.imageOffset = imageOffset;

    this.framesAmount = framesAmount;
    this.currentFrame = 0;

    this.frameCounter = 0;

    this.upf = upf;

    this.frameWidth = this.image.width / this.framesAmount;
  }

  draw() {
     ctx.drawImage(
      this.image,
      this.frameWidth * this.currentFrame,
      0,
      this.frameWidth, 
      this.image.height,
      this.pos.x + this.imageOffset.x, 
      this.pos.y + this.imageOffset.y, 
      this.frameWidth * this.sizeCof, 
      this.image.height * this.sizeCof
    );
  }

  updateFrame() {
    if (this.frameCounter % this.upf === 0){
      this.currentFrame += 1;

      if (this.currentFrame >= this.framesAmount) this.currentFrame = 0;
    }

    this.frameCounter++;
  }

  update() {
    this.updateFrame();
    this.draw();
  }
}
