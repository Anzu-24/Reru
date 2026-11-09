export default class AnimationManager {
    constructor() {
        this.animations = {};
        this.current = null;
        this.image = null;
        this.frame = 0;
        this.timer = 0;
        this.finished = false;
    }

    async load(path = "./data/animation.json") {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(
                `Animation JSON not found : ${path}`
            );
        }
        this.animations =
            await response.json();
    }

    get(name) {
        return this.animations[name] || null;
    }

    
    play(name, sprite, onFinish = null) {
        const animation = this.get(name);
        if (!animation) {
            return;
        }

        this.current = animation;
        this.image = sprite;
        this.frame = 0;
        this.frameTimer = 0;
        this.finished = false;
        this.onFinish = onFinish;
        this.frameDuration =
        1 / animation.fps;

        sprite.src = animation.sheet;
        sprite.style.position = "absolute";
        sprite.style.left = "0px";
        sprite.style.top = "0px";
        sprite.style.width =
        `${animation.frameWidth * animation.frames}px`;
        sprite.style.height =
        `${animation.frameHeight}px`;

        

        this.updateFrame();
    }

    update(deltaTime){
        if(!this.current){
            return;
        }
        if (this.current.frames === 1) {
            return;
        }
        this.frameTimer += deltaTime;
        if(
            this.frameTimer <
            this.frameDuration
        ){
            return;
        }
        this.frameTimer -=
        this.frameDuration;
        this.frame++;

        if(
            this.frame >=
            this.current.frames
        ){

            if(this.current.loop){
                this.frame = 0;
            }
            else{
                this.frame =
                this.current.frames-1;
                this.finish();
                return;
            }
        }
        this.updateFrame();
    }

    updateFrame() {
        const x =
        this.frame *
        this.current.frameWidth;
        this.image.style.left =
        `-${x}px`;
    }


    async finish(){
        const hold =
        this.current.holdLastFrame;
        if(hold){
            const time =
            typeof hold === "object"

            ?

            hold.min +
            Math.random() *
            (
                hold.max -
                hold.min
            )
            :
            hold;
            await new Promise(resolve=>

                setTimeout(
                    resolve,
                    time
                )
            );
        }

        this.finished = true;
        this.current = null;
        if(this.onFinish){
            this.onFinish();
        }
    }

    isPlaying() {
        return this.current !== null;
    }

    stop() {
        this.current = null;
        this.finished = true;
    }
}