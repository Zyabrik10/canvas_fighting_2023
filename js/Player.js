import { Sprite } from "./Sprite.js";

export class Player extends Sprite {
  constructor({
    pos,
    color,
    width,
    height,
    attackBox,
    hitBoxes,
    healthLine,
    imageSrc,
    sizeCof,
    floor = canvas.height,
    imageOffset,
    framesAmount = 1,
    upf = 2,
    sprites,
    sounds,
  }) {
    super({
      color,
      pos,
      width,
      height,
      imageSrc,
      sizeCof,
      imageOffset,
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

    this.maxHealth = 200;
    this.health = this.maxHealth;

    this.power = 10;
    this.maxPower = this.power * 4;
    this.minPower = this.power;

    this.defence = 1;

    this.sprites = sprites;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

    this.sound = undefined;

    this.sounds = sounds;

    for (const sound in sounds) {
      sounds[sound].audio = new Audio(sounds[sound].audioSrc);

      if (sounds[sound].audiosSrc) {
        sounds[sound].audios = [];

        sounds[sound].audiosSrc.forEach((audioSrc) => {
          sounds[sound].audios.push(new Audio(audioSrc));
        });
      }
    }

    this.sounds.run.ableToPlay = true;

    this.attackCounter = 0;

    this.isDead = false;

    this.isOnTheGround = false;
    this.landed = false;

    this.playerSpeed = 10;
  }

  drawCollision() {
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

    this.particles.forEach((particle) => {
      particle.update();
    });
  }

  fall() {
    this.pos.y += this.vel.y;
    this.vel.y += 0.8;

    if (this.pos.y + this.height >= this.floor) {
      this.vel.y = 0;
      this.pos.y = this.floor - this.height;
      if (!this.landed) {
        // refactor
        this.playSound("fall");
        this.landed = true;
        this.isOnTheGround = true;
      }
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
    switch (part) {
      case "head":
        powerHit = power * this.defence * 2;
        this.health -= powerHit;
        this.healthLine.style.width =
          (this.health / this.maxHealth) * 100 + "%";
        break;
      case "body":
        powerHit = power * this.defence;
        this.health -= powerHit;
        this.healthLine.style.width =
          (this.health / this.maxHealth) * 100 + "%";
        break;
      case "legs":
        powerHit = power * this.defence * 0.5;
        this.health -= powerHit;
        this.healthLine.style.width =
          (this.health / this.maxHealth) * 100 + "%";
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
      (this.image === this.sprites.hit.image &&
        this.currentFrame !== this.sprites.hit.framesAmount - 1) ||
      (this.image === this.sprites.attack1.image &&
        this.currentFrame !== this.sprites.attack1.framesAmount - 1) ||
      (this.image === this.sprites.attack2.image &&
        this.currentFrame !== this.sprites.attack2.framesAmount - 1)
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesAmount = this.sprites.idle.framesAmount;
          this.upf = this.sprites.idle.upf;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesAmount = this.sprites.run.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.run.upf;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesAmount = this.sprites.jump.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.jump.upf;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesAmount = this.sprites.fall.framesAmount;
          this.currentFrame = 0;
          this.upf = this.sprites.fall.upf;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesAmount = this.sprites.attack1.framesAmount;
          this.upf = this.sprites.attack1.upf;
          this.currentFrame = 0;
          this.attackCounter++;
        }
        break;
      case "attack2":
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesAmount = this.sprites.attack2.framesAmount;
          this.upf = this.sprites.attack2.upf;
          this.currentFrame = 0;
          this.attackCounter++;
        }
        break;
      case "hit":
        if (this.image !== this.sprites.hit.image) {
          this.image = this.sprites.hit.image;
          this.framesAmount = this.sprites.hit.framesAmount;
          this.upf = this.sprites.hit.upf;
          this.currentFrame = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesAmount = this.sprites.death.framesAmount;
          this.upf = this.sprites.death.upf;
          this.isDead = true;
          this.currentFrame = 0;
        }
        break;
    }
  }

  playSound(sound) {
    if (this.sound === this.sounds.death.audio) return;

    switch (sound) {
      case "run":
        if (
          this.sounds.run.ableToPlay &&
          this.sounds.run.audio !== this.sound
        ) {
          this.sound = this.sounds.run.audios[1];
          this.sounds.run.ableToPlay = true;
          setTimeout(() => {
            this.sounds.run.ableToPlay = true;
          }, 5);
        }
        break;
      case "jump":
        if (this.sound !== this.sounds.jump.audio) {
          this.sound = this.sounds.jump.audio;
        }
        break;
      case "fall":
        if (this.sound !== this.sounds.fall.audio) {
          this.sound = this.sounds.fall.audio;
        }
        break;
      case "attack1":
        if (this.sound !== this.sounds.attack1.audio) {
          this.sound = this.sounds.attack1.audio;
        }
        break;
      case "attack2":
        if (this.sound !== this.sounds.attack2.audio) {
          this.sound = this.sounds.attack2.audio;
        }
        break;
      case "hit":
        if (this.sound !== this.sounds.hit.audio) {
          this.sound =
            this.sounds.hit.audios[
              Math.floor(Math.random() * this.sounds.hit.audios.length)
            ];
        }
        break;
      case "death":
        if (this.sound !== this.sounds.death.audio) {
          this.sound = this.sounds.death.audio;
        }
        break;
    }

    this.sound.play();
  }

  movePlayerOn(leftButton, rightButton) {
    if (leftButton.pressed && this.lastKey === leftButton.btn) {
      this.vel.x = -this.playerSpeed;
      if (this.vel.y === 0) {
        this.switchSprite("run");
        this.playSound("run");
      }
    } else if (rightButton.pressed && this.lastKey === rightButton.btn) {
      this.vel.x = this.playerSpeed;
      if (this.vel.y === 0) {
        this.switchSprite("run");
        this.playSound("run");
      }
    } else if (this.vel.y === 0) {
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
      enemy.attackCounter % 2 === 0
        ? enemy.playSound("attack1")
        : enemy.playSound("attack2");

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
            this.playSound("death");
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
            this.playSound("death");
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
            this.playSound("death");
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
        this.image === this.sprites.attack2.image) &&
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
      this.attackBox.offset.x =
        -(this.playerWidth * 2 - this.width) - this.width;
      enemy.attackBox.offset.x = this.width;
    } else {
      this.attackBox.offset.x = this.width;
      enemy.attackBox.offset.x =
        -(this.playerWidth * 2 - this.width) - this.width;
    }
  }

  update() {
    this.fall();
    this.move();
    this.draw();
    this.updateFrame();
    this.drawCollision();

    this.attackBox.pos.x = this.pos.x + this.attackBox.offset.x;
    this.attackBox.pos.y = this.pos.y + this.attackBox.offset.y;

    this.hitBoxes.head.pos.x = this.pos.x + this.hitBoxes.head.offset.x;
    this.hitBoxes.head.pos.y = this.pos.y + this.hitBoxes.head.offset.y;

    this.hitBoxes.body.pos.x = this.pos.x + this.hitBoxes.body.offset.x;
    this.hitBoxes.body.pos.y = this.pos.y + this.hitBoxes.body.offset.y;

    this.hitBoxes.legs.pos.x = this.pos.x + this.hitBoxes.legs.offset.x;
    this.hitBoxes.legs.pos.y = this.pos.y + this.hitBoxes.legs.offset.y;
  }
}
