import { randNum } from "./mathFunc.js";

export class Stuff{
    #roles = ["kit", "def", "pow"];

    constructor({
        pos,
        width,
        height,
        floor = canvas.height
    }){
        this.pos = pos;

        this.width = width;
        this.height = height;

        this.role = this.#roles[Math.floor(Math.random() * this.#roles.length)];

        switch(this.role){
            case "kit":
                this.color = "pink";
                break;
            case "def":
                this.color = "blue";
                break;
            case "pow":
                this.color = "gold";
                break;
        }
        
        this.vel = {
            x: randNum(-10, 10),
            y: 0
        }

        this.floor = floor;

        this.end;
    }

    fall(timerCounter){
        this.pos.y += this.vel.y;
        this.vel.y += 0.8;

        if (this.pos.y + this.height >= this.floor){
            this.vel.y = 0;
            this.vel.x = 0;
            this.pos.y = this.floor - this.height;
            this.end = timerCounter - 10;
            this.isOnTHeFloor = true;
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
        ctx.strokeStyle = this.color;
        ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.stroke();
    }

    update(timerCounter){
        this.fall(timerCounter);
        this.move();
        this.draw();
    }
}