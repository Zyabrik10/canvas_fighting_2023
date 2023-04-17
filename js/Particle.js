import { randNum } from "./mathFunc.js";

export class Particle{
    constructor({player, index, particles}){
        this.pos = {
            x: player.pos.x, 
            y: player.pos.y + player.height
        };

        this.width = randNum(5, 15);
        this.height = this.width;

        this.color = "green";

        this.vel = {
            x: 0,
            y: randNum(-15, -10)
        }

        this.floor = canvas.height;

        this.isOnTHeFloor = false;

        this.end;
        this.index = index;

        this.particles = particles;

        this.thereIsTimer = false;
    }

    fall(){
        this.pos.y += this.vel.y;
        if (!this.isOnTHeFloor) this.vel.y += 0.8;

        if (this.pos.y + this.height >= this.floor && !this.isOnTHeFloor){
            this.vel.y = 0;
            this.vel.x = 0;
            this.pos.y = this.floor - this.height;
            this.isOnTHeFloor = true;
        }

        if (this.isOnTHeFloor && !this.thereIsTimer){
            setTimeout(()=>{
                this.particles.splice(this.particles.indexOf(this.index), 1);

                // for(let i = this.particles.length - 1; i > this.particles.indexOf(this.index); i--){
                //     this.particles[i].index -= 1;
                // }
            }, 1000);
        }
    }

    move(){
        this.pos.x += this.vel.x;

        if (this.pos.x + this.width >= canvas.width){
            this.vel.x = 0;
            this.pos.x = canvas.width - this.width;
        } else if (this.pos.x <= 0){
            this.vel.x = 0;
            this.pos.x = 0;
        }
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.stroke();
    }

    update(){
        this.fall();
        this.move();
        this.draw();
    }
}