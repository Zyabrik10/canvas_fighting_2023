import Sprite from "./Sprite.js";
import Particle from "./Particle.js";
import { random, cos, sin, pi, randInt, randFloat, randNum } from "../math.js";
import worldSettings from "../world-settings.js";
import { preloadSound } from "../sounds-func.js";

export default class Player extends Sprite {
  constructor({
    image,
    image_rev,
    pos,
    color,
    width,
    height,
    attackBox,
    hitBoxes,
    healthLine,
    sizeCof,
    floor = worldSettings.floor,
    imageOffset,
    imageOffsetRev,
    framesAmount = 1,
    upf = 2,
    sprites,
    sounds,
  }) {
    if (!image) throw new Error(image);
    super({
      image,
      image_rev,
      color,
      pos,
      width,
      height,
      sizeCof,
      imageOffset,
      imageOffsetRev,
      framesAmount,
      upf,
    });
    this.vel = {
      x: 0,
      y: 0,
    };

    this.lastKey = undefined;

    this.floor = floor;

    this.isAttacking = false;

    this.attackBox = attackBox;
    this.hitBoxes = hitBoxes;

    this.particles = [];

    this.healthLine = healthLine;

    this.maxHealth = 1000;
    this.health = this.maxHealth;

    this.power = 1;
    this.maxPower = this.power * 10;
    this.minPower = this.power;

    this.defence = 1;

    this.sprites = sprites;

    this.sound = undefined;

    this.sounds = {};

    for (let sound in sounds) {
      this.sounds[sound] = [];
      for (let i = 0; i < sounds[sound].length; i++) {
        this.sounds[sound][i] = new Audio(sounds[sound][i].src);
        preloadSound(this.sounds[sound][i]);
      }
    }

    this.attackCounter = 0;

    this.isDead = false;

    this.isOnTheGround = false;
    this.landed = false;

    this.playerSpeed = 10;
    this.jumpForce = 20;

    this.runSoundIndex = 0;
    this.albeToPlayRun = true;

    this.updateHitBoxes.call(this);

    console.log("Player instance created: ", this);
  }

  drawCollision(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
    ctx.stroke();

    // HEAD HITBOX
    ctx.beginPath();
    ctx.strokeStyle = this.hitBoxes.head.color;
    ctx.rect(
      this.hitBoxes.head.pos.x,
      this.hitBoxes.head.pos.y,
      this.hitBoxes.head.width,
      this.hitBoxes.head.height
    );
    ctx.stroke();

    // BODY HITBOX
    ctx.beginPath();
    ctx.strokeStyle = this.hitBoxes.body.color;
    ctx.rect(
      this.hitBoxes.body.pos.x,
      this.hitBoxes.body.pos.y,
      this.hitBoxes.body.width,
      this.hitBoxes.body.height
    );
    ctx.stroke();

    // LEGS HITBOX
    ctx.beginPath();
    ctx.strokeStyle = this.hitBoxes.legs.color;
    ctx.rect(
      this.hitBoxes.legs.pos.x,
      this.hitBoxes.legs.pos.y,
      this.hitBoxes.legs.width,
      this.hitBoxes.legs.height
    );
    ctx.stroke();

    // ATTACK HITBOX
    ctx.beginPath();
    ctx.strokeStyle = this.attackBox.color;
    ctx.fillStyle = this.attackBox.color;
    ctx.rect(
      this.attackBox.pos.x,
      this.attackBox.pos.y,
      this.attackBox.width,
      this.attackBox.height
    );
    ctx.stroke();
    if (this.isAttacking) {
      ctx.fill();
    }
  }

  fall() {
    this.pos.y += this.vel.y;
    this.vel.y += 0.8;

    if (this.pos.y + this.height >= this.floor) {
      this.vel.y = 0;
      this.pos.y = this.floor - this.height;
      if (!this.landed) {
        this.playSound("landing");
        this.landed = true;
        this.isOnTheGround = true;

        const partNum = randInt(10, 50);

        for (let i = 0; i < partNum; i++) {
          const vel = {
            x: randFloat(1, 10) * randNum(-1, 1),
            y: -randFloat(1, 10),
          };

          this.particles.push(
            new Particle({
              pos: {
                x: this.pos.x + this.width / 2,
                y: this.pos.y + this.height - 12,
              },
              vel,
              floor: worldSettings.floor,
            })
          );
        }

        // const num = 50;
        // const power = 15;

        // const radX_right = random() * (pi / 4) || 1;
        // const radX_left = random() * (pi - pi / 4 - pi / 2) + pi / 2 || 1;

        // const radY_right = random() * (pi / 2) || 1;
        // const radY_left = random() * (pi - pi / 2) + pi / 2 || 1;

        // for (let i = 0; i < num; i++) {
        //   this.particles.push(
        //     new Particle({
        //       pos: {
        //         x: this.pos.x + this.width / 2,
        //         y: this.pos.y + this.height - 12,
        //       },
        //       vel: {
        //         x:
        //           random() > 0.5
        //             ? cos(radX_left) * random() * power
        //             : cos(radX_right) * random() * power,
        //         y:
        //           random() > 0.5
        //             ? -sin(radY_left) * random() * power
        //             : -sin(radY_right) * random() * power,
        //       },
        //       floor: worldSettings.floor,
        //     })
        //   );
        // }
      }
    }
  }

  move(canvas) {
    this.pos.x += this.vel.x;

    if (this.pos.x + this.width >= canvas.width) {
      this.vel.x = 0;
      this.pos.x = canvas.width - this.width;
    } else if (this.pos.x <= 0) {
      this.vel.x = 0;
      this.pos.x = 0;
    }
  }

  attack() {
    this.isAttacking = true;

    if (this.attackCounter % 2 === 0) {
      this.switchSprite("attack1");
    } else {
      this.switchSprite("attack2");
    }
  }

  takeHit(part, power) {
    let powerHit;

    const bloodNumber = randInt(20, 50);
    const powerX = 5;
    const powerY = 10;
    const bloodColor = "rgba(228, 30, 30, 0.7)";

    switch (part) {
      case "head":
        powerHit = power * this.defence * 2;
        this.health -= powerHit;
        this.healthLine.style.width =
          (this.health / this.maxHealth) * 100 + "%";

        for (let i = 0; i < bloodNumber; i++) {
          const rad = random() * pi;

          this.particles.push(
            new Particle({
              pos: {
                x:
                  this.hitBoxes.head.pos.x +
                  this.hitBoxes.head.width / 2 +
                  (this.hitBoxes.head.width / 4) * (randInt(-10, 10) / 10),
                y:
                  this.hitBoxes.head.pos.y +
                  this.hitBoxes.head.height / 2 +
                  (this.hitBoxes.head.height / 4) * (randInt(-10, 10) / 10),
              },
              vel: {
                x: cos(rad) * random() * powerX,
                y: cos(rad) * random() * powerY,
              },
              color: bloodColor,
              floor: worldSettings.floor,
            })
          );
        }
        break;
      case "body":
        powerHit = power * this.defence;
        this.health -= powerHit;
        this.healthLine.style.width =
          (this.health / this.maxHealth) * 100 + "%";

        for (let i = 0; i < bloodNumber; i++) {
          const rad = random() * pi;

          this.particles.push(
            new Particle({
              pos: {
                x:
                  this.hitBoxes.body.pos.x +
                  this.hitBoxes.body.width / 2 +
                  (this.hitBoxes.body.width / 4) * (randInt(-10, 10) / 10),
                y:
                  this.hitBoxes.body.pos.y +
                  this.hitBoxes.body.height / 2 +
                  (this.hitBoxes.body.height / 4) * (randInt(-10, 10) / 10),
              },
              vel: {
                x: cos(rad) * random() * powerX,
                y: cos(rad) * random() * powerY,
              },
              color: bloodColor,
              floor: worldSettings.floor,
            })
          );
        }
        break;
      case "legs":
        powerHit = power * this.defence * 0.5;
        this.health -= powerHit;
        this.healthLine.style.width =
          (this.health / this.maxHealth) * 100 + "%";

        for (let i = 0; i < bloodNumber; i++) {
          const rad = random() * pi;

          this.particles.push(
            new Particle({
              pos: {
                x:
                  this.hitBoxes.body.pos.x +
                  this.hitBoxes.body.width / 2 +
                  (this.hitBoxes.body.width / 4) * (randInt(-10, 10) / 10),
                y:
                  this.hitBoxes.body.pos.y +
                  this.hitBoxes.body.height / 2 +
                  (this.hitBoxes.head.height / 4) * (randInt(-10, 10) / 10),
              },
              vel: {
                x: cos(rad) * random() * powerX,
                y: cos(rad) * random() * powerY,
              },
              color: bloodColor,
              floor: worldSettings.floor,
            })
          );
        }

        break;
    }

    console.log(powerHit);
  }

  getBonus(role) {
    switch (role) {
      case "kit":
        if (this.health + this.maxHealth * 0.2 >= this.maxHealth)
          this.health = this.maxHealth;
        else this.health += this.maxHealth * 0.2;

        this.healthLine.style.width =
          (this.health / this.maxHealth) * 100 + "%";

        console.log("picked up:", role);
        break;
      case "def":
        this.defence -= 0.3;

        if (this.defence < 0) {
          this.defence = 0;
        }

        setTimeout(() => {
          this.defence = 1;
          console.log("Def:", this.defence);
        }, 5000);

        console.log("picked up:", role);
        console.log("Def:", this.defence);
        break;
      case "pow":
        this.power *= 2;

        if (this.power > this.maxPower) {
          this.power = this.maxPower;
        }

        setTimeout(() => {
          this.power = this.minPower;
          console.log("Pow:", this.power);
        }, 5000);

        console.log("picked up:", role);
        console.log("Pow:", this.power);
        break;
    }
  }

  switchSprite(sprite) {
    if (
      this.isDead ||
      ((this.image === this.sprites.hit.image ||
        this.image === this.sprites.hit.image_rev) &&
        this.currentFrame !== this.sprites.hit.framesAmount - 1) ||
      ((this.image === this.sprites.attack1.image ||
        this.image === this.sprites.attack1.image_rev) &&
        this.currentFrame !== this.sprites.attack1.framesAmount - 1) ||
      ((this.image === this.sprites.attack2.image ||
        this.image === this.sprites.attack2.image_rev) &&
        this.currentFrame !== this.sprites.attack2.framesAmount - 1)
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (
          this.image !== this.sprites.idle.image &&
          this.image !== this.sprites.idle.image_rev
        ) {
          this.framesAmount = this.sprites.idle.framesAmount;
          this.upf = this.sprites.idle.upf;
          this.currentFrame = 0;
        }

        if (!this.flliped && this.image !== this.sprites.idle.image)
          this.image = this.sprites.idle.image;
        else if (this.flliped && this.image !== this.sprites.idle.image_rev)
          this.image = this.sprites.idle.image_rev;
        break;
      case "run":
        if (
          this.image !== this.sprites.run.image &&
          this.image !== this.sprites.run.image_rev
        ) {
          this.framesAmount = this.sprites.run.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.run.upf;
        }

        if (!this.flliped && this.image !== this.sprites.run.image)
          this.image = this.sprites.run.image;
        else if (this.flliped && this.image !== this.sprites.run.image_rev)
          this.image = this.sprites.run.image_rev;
        break;
      case "jump":
        if (
          this.image !== this.sprites.jump.image &&
          this.image !== this.sprites.jump.image_rev
        ) {
          this.framesAmount = this.sprites.jump.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.jump.upf;
        }

        if (!this.flliped && this.image !== this.sprites.jump.image)
          this.image = this.sprites.jump.image;
        else if (this.flliped && this.image !== this.sprites.jump.image_rev)
          this.image = this.sprites.jump.image_rev;
        break;
      case "fall":
        if (
          this.image !== this.sprites.fall.image &&
          this.image !== this.sprites.fall.image_rev
        ) {
          this.framesAmount = this.sprites.fall.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.fall.upf;
        }

        if (!this.flliped && this.image !== this.sprites.fall.image)
          this.image = this.sprites.fall.image;
        else if (this.flliped && this.image !== this.sprites.fall.image_rev)
          this.image = this.sprites.fall.image_rev;
        break;
      case "attack1":
        if (
          this.image !== this.sprites.attack1.image &&
          this.image !== this.sprites.attack1.image_rev
        ) {
          this.framesAmount = this.sprites.attack1.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.attack1.upf;
          this.attackCounter++;
        }

        if (!this.flliped && this.image !== this.sprites.attack1.image)
          this.image = this.sprites.attack1.image;
        else if (this.flliped && this.image !== this.sprites.attack1.image_rev)
          this.image = this.sprites.attack1.image_rev;
        break;
      case "attack2":
        if (
          this.image !== this.sprites.attack2.image &&
          this.image !== this.sprites.attack2.image_rev
        ) {
          this.framesAmount = this.sprites.attack2.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.attack2.upf;
          this.attackCounter++;
        }

        if (!this.flliped && this.image !== this.sprites.attack2.image)
          this.image = this.sprites.attack2.image;
        else if (this.flliped && this.image !== this.sprites.attack2.image_rev)
          this.image = this.sprites.attack2.image_rev;
        break;
      case "hit":
        if (
          this.image !== this.sprites.hit.image &&
          this.image !== this.sprites.hit.image_rev
        ) {
          this.framesAmount = this.sprites.hit.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.hit.upf;
        }

        if (!this.flliped && this.image !== this.sprites.hit.image)
          this.image = this.sprites.hit.image;
        else if (this.flliped && this.image !== this.sprites.hit.image_rev)
          this.image = this.sprites.hit.image_rev;
        break;
      case "death":
        if (
          this.image !== this.sprites.death.image &&
          this.image !== this.sprites.death.image_rev
        ) {
          this.framesAmount = this.sprites.death.framesAmount;
          this.upf = this.sprites.death.upf;
          this.isDead = true;
          this.currentFrame = 0;
        }

        if (!this.flliped && this.image !== this.sprites.death.image)
          this.image = this.sprites.death.image;
        else if (this.flliped && this.image !== this.sprites.death.image_rev)
          this.image = this.sprites.death.image_rev;
        break;
    }
  }

  playSound(sound) {
    switch (sound) {
      case "run":
        if (this.albeToPlayRun) {
          if (
            this.sound !== this.sounds.run[0] &&
            this.sound !== this.sounds.run[1]
          ) {
            this.sound = this.sounds.run[1];
            this.albeToPlayRun = false;

            setTimeout(() => {
              this.albeToPlayRun = true;
              // this.runSoundIndex++;

              // if (this.runSoundIndex >= this.sounds.run.length)
              //   this.runSoundIndex = 0;
            }, this.upf);
          }
        }

        break;
      case "jump":
        if (this.sound !== this.sounds.jump[0]) {
          this.sound = this.sounds.jump[0];
        }
        break;
      case "landing":
        if (this.sound !== this.sounds.landing[0]) {
          this.sound = this.sounds.landing[0];
        }
        break;
      case "hit":
        const soundIndex = randInt(0, this.sounds.get_hit.length - 1);

        if (this.sound !== this.sounds.get_hit[soundIndex]) {
          this.sound = this.sounds.get_hit[soundIndex];
        }
        break;
      case "attack":
        const attackSoundIndex = this.attackCounter % 2;
        if (this.sound !== this.sounds.attack[attackSoundIndex]) {
          this.sound = this.sounds.attack[attackSoundIndex];
        }
        break;
    }

    if (this.sound) this.sound.play();
    this.sound = null;
  }

  movePlayerOn(leftButton, rightButton) {
    const powerX = 1;
    const powerY = 10;

    if (leftButton.pressed && this.lastKey === leftButton.btn) {
      this.vel.x = -this.playerSpeed;
      if (this.isOnTheGround) {
        this.switchSprite("run");
        this.playSound("run");

        const radX = random() * (pi / 2);
        const radY = random() * (pi / 2 - pi / 8) + pi / 8;

        const velX = cos(radX) * random() * powerX;
        const velY = -sin(radY) * random() * powerY;

        this.particles.push(
          new Particle({
            pos: {
              x: this.pos.x + this.width / 2,
              y: this.pos.y + this.height - 12,
            },
            vel: {
              x: velX,
              y: velY,
            },
            floor: worldSettings.floor,
          })
        );
      }
    } else if (rightButton.pressed && this.lastKey === rightButton.btn) {
      this.vel.x = this.playerSpeed;
      if (this.isOnTheGround) {
        this.switchSprite("run");
        this.playSound("run");

        const radX = random() * (pi - pi / 2) + pi / 2;
        const radY = random() * (pi - pi / 8 - pi / 2) + pi / 2;

        const velX = cos(radX) * random() * powerX;
        const velY = -sin(radY) * random() * powerY;

        this.particles.push(
          new Particle({
            pos: {
              x: this.pos.x + this.width / 2,
              y: this.pos.y + this.height - 12,
            },
            vel: {
              x: velX,
              y: velY,
            },
            floor: worldSettings.floor,
          })
        );
      }
    } else if (this.isOnTheGround) {
      this.vel.x *= 0.85;
      this.switchSprite("idle");
    }
  }

  ifJumped() {
    if (this.vel.y < 0) {
      this.switchSprite("jump");
      if (this.isOnTheGround) {
        this.playSound("jump");
        this.isOnTheGround = false;
        this.landed = false;
      }
    } else if (this.vel.y > 0) {
      this.switchSprite("fall");
    }
  }

  checkHitBox(enemy, frame) {
    if (enemy.isAttacking && enemy.currentFrame === frame) {
      enemy.playSound("attack");

      const enemyHit = {
        head:
          enemy.attackBox.pos.x + enemy.attackBox.width >=
            this.hitBoxes.head.pos.x &&
          enemy.attackBox.pos.x <=
            this.hitBoxes.head.pos.x + this.hitBoxes.head.width &&
          enemy.attackBox.pos.y + enemy.attackBox.height >=
            this.hitBoxes.head.pos.y &&
          enemy.attackBox.pos.y <=
            this.hitBoxes.head.pos.y + this.hitBoxes.head.height,
        body:
          enemy.attackBox.pos.x + enemy.attackBox.width >=
            this.hitBoxes.body.pos.x &&
          enemy.attackBox.pos.x <=
            this.hitBoxes.body.pos.x + this.hitBoxes.body.width &&
          enemy.attackBox.pos.y + enemy.attackBox.height >=
            this.hitBoxes.body.pos.y &&
          enemy.attackBox.pos.y <=
            this.hitBoxes.body.pos.y + this.hitBoxes.body.height,
        legs:
          enemy.attackBox.pos.x + enemy.attackBox.width >=
            this.hitBoxes.legs.pos.x &&
          enemy.attackBox.pos.x <=
            this.hitBoxes.legs.pos.x + this.hitBoxes.legs.width &&
          enemy.attackBox.pos.y + enemy.attackBox.height >=
            this.hitBoxes.legs.pos.y &&
          enemy.attackBox.pos.y <=
            this.hitBoxes.legs.pos.y + this.hitBoxes.legs.height,
      };

      for (const hit in enemyHit) {
        if (enemyHit[hit] && hit === "head") {
          console.log("this hited:", hit);
          this.takeHit("head", enemy.power);

          if (this.health > 0) {
            this.switchSprite("hit");
          } else {
            this.switchSprite("death");
            // this.playSound("death");
            this.isDead = true;
          }

          this.playSound("hit");
          enemy.isAttacking = false;
          break;
        } else if (enemyHit[hit] && hit === "body") {
          console.log("this hited:", hit);
          this.takeHit("body", enemy.power);

          if (this.health > 0) {
            this.switchSprite("hit");
          } else {
            this.switchSprite("death");
            // this.playSound("death");
            this.isDead = true;
          }

          this.playSound("hit");
          enemy.isAttacking = false;
          break;
        } else if (enemyHit[hit] && hit === "legs") {
          console.log("this hited:", hit);
          this.takeHit("legs", enemy.power);

          if (this.health > 0) {
            this.switchSprite("hit");
          } else {
            this.switchSprite("death");
            // this.playSound("death");
            this.isDead = true;
          }

          this.playSound("hit");
          enemy.isAttacking = false;
          break;
        }
      }
    }
  }

  checkIfIsAttacking(frame) {
    if (
      (this.image === this.sprites.attack1.image ||
        this.image === this.sprites.attack2.image ||
        this.image === this.sprites.attack1.image_rev ||
        this.image === this.sprites.attack2.image_rev) &&
      this.currentFrame > frame
    ) {
      this.isAttacking = false;
    }
  }

  checkIfIsAlive(gameOver) {
    if (
      this.isDead &&
      this.currentFrame === this.sprites.death.framesAmount - 1
    ) {
      gameOver();
    }
  }

  canPickUpStuff(stuff) {
    return (
      this.pos.x + this.width >= stuff.pos.x &&
      this.pos.x <= stuff.pos.x + stuff.width &&
      this.pos.y + this.height >= stuff.pos.y &&
      this.pos.y <= stuff.pos.y + stuff.height
    );
  }

  isBehind(enemy) {
    if (this.pos.x >= enemy.pos.x) {
      if (
        this.image !== this.sprites.attack1.image &&
        this.image !== this.sprites.attack1.image_rev
      ) {
        this.attackBox.offset.x = -(this.width * 2 - this.width) - this.width;
        this.hitBoxes.head.offset.x =
          this.width -
          this.hitBoxes.head.buffOffset.x -
          this.hitBoxes.head.width;
        this.flliped = true;
      }
    } else {
      if (
        this.image !== this.sprites.attack1.image &&
        this.image !== this.sprites.attack1.image_rev
      ) {
        this.attackBox.offset.x = this.width;
        this.hitBoxes.head.offset.x = this.hitBoxes.head.buffOffset.x;
        this.flliped = false;
      }
    }
  }

  collidedWithWall() {
    return this.pos.x <= 0 || this.pos.x + this.width >= canvas.width;
  }

  updateHitBoxes() {
    this.attackBox.pos.x = this.pos.x + this.attackBox.offset.x;
    this.attackBox.pos.y = this.pos.y + this.attackBox.offset.y;
    this.hitBoxes.head.pos.x = this.pos.x + this.hitBoxes.head.offset.x;
    this.hitBoxes.head.pos.y = this.pos.y + this.hitBoxes.head.offset.y;
    this.hitBoxes.body.pos.x = this.pos.x + this.hitBoxes.body.offset.x;
    this.hitBoxes.body.pos.y = this.pos.y + this.hitBoxes.body.offset.y;
    this.hitBoxes.legs.pos.x = this.pos.x + this.hitBoxes.legs.offset.x;
    this.hitBoxes.legs.pos.y = this.pos.y + this.hitBoxes.legs.offset.y;
  }

  update(canvas, ctx) {
    this.fall();
    this.move(canvas);
    this.draw(ctx);
    this.particles.forEach((particle, index) => {
      particle.update(canvas, ctx);

      if (particle.alpha <= 0) this.particles.splice(index, 1);
    });
    this.updateFrame();
    // this.drawCollision(ctx);
    this.updateHitBoxes();
  }
}
