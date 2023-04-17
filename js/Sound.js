export class Sound{
    constructor(soundSrc){
        this.sound = new Audio();
        this.sound.src = this.soundSrc;
    }

    play(){
        this.sound.play();
    }

    pause(){
        this.sound.pause();
    }
}