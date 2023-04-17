import { randNum } from "./mathFunc.js";
import { Sprite } from "./Sprite.js";

export class Stuff extends Sprite{
    constructor({
        pos,
        width,
        height,
        floor = canvas.height,
        role
    }){
        
        super({
            pos,
            width,
            height,
            sizeCof: role.sizeCof,
            imageSrc: role.imageSrc,
            imageOffset: role.imageOffset
        });

        this.role = role;

        this.color = `hsl(${randNum(0, 360)}, 80%, 50%)`;

        switch(this.role.name){
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
            y: 0
        }

        this.floor = floor;

        this.end;
    }

    fall(){
        this.pos.y += this.vel.y;
        this.vel.y += 0.8;

        if (this.pos.y + this.height >= this.floor){
            this.vel.y = 0;
            this.vel.x = 0;
            this.pos.y = this.floor - this.height;
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

    drawCollision(){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.stroke();
    }

    update(){
        this.fall();
        this.move();
        this.drawCollision();
        this.draw();

    }
}