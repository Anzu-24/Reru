import { PLACES, getGridPosition } from "../config.js";

export default class CharacterManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.animationManager = sceneManager.getManager("animation");
        this.image = null;
        this.state = "wait";
        this.currentAnimation = null;
        this.queue = null;
        this.waitMin = 2;
        this.waitMax = 6;
        this.waitTimer = 0;
        this.position = {
            x: 0,
            y: 0
        };
        this.targetPosition = null;
        this.sprite = null;
        this.walkTarget = null;
        this.speed = 55;
        this.direction = "right";
        this.isSleeping = false;
        this.sleepCheckedDate = "";
        this.sleepDecision = false;
        this.isSleeping = false;
        this.sleepDecision = false;
        this.sleepCheckedDate = "";
        this.wakeUpTime = null;
        this.wakeTimeDecided = false;
    }

    create() {
        const layer =
        this.sceneManager.getLayer("character-layer");
        this.image = document.createElement("div");
        this.image.id = "character";
        this.sprite = document.createElement("img");
        this.sprite.id = "character-sprite";
        this.image.appendChild(this.sprite);
        layer.appendChild(this.image);
        this.position = getGridPosition(
            PLACES.center
        );
        this.updateTransform();

        this.animationManager.play(
            "idle",
            this.sprite
        );
        this.enterWait();
        this.image.addEventListener(
            "click",
            () => this.onTap()
        );
    }

    updateTransform() {
        this.image.style.left = `${this.position.x * 100}%`;
        this.image.style.top = `${this.position.y * 100}%`;

        this.image.style.transform =
        this.direction === "right"
        ? "translate(-50%, -50%) scaleX(1)"
        : "translate(-50%, -50%) scaleX(-1)";
    }

    enterWait() {
        this.state = "wait";

        this.waitTimer =
        this.waitMin +
        Math.random() *
        (this.waitMax - this.waitMin);

        if (this.isSleeping) {
            return;
        }
        this.play("idle");
    }

    getElement() {
        return this.image;
    }

    getEmotion() {
        return this.emotion;
    }

    onClick(callback) {
        if (!this.image) return;
        this.image.addEventListener(
            "click",
            callback
        );
    }

    destroy() {
        if (!this.image) return;
        this.image.remove();
        this.image = null;
        this.sprite = null;
    }

    update(deltaTime) {
        if (!this.image) {
            return;
        }
        this.animationManager.update(deltaTime);
        this.updateSleep();
        if (this.targetPosition) {

            this.updateMove(deltaTime);
            return;
        }

        if (this.state !== "wait") {
            return;
        }

        this.waitTimer -= deltaTime;
        if (this.waitTimer <= 0) {
            this.chooseIdle();
        }
    }

    //Sleep//
    updateSleep(){
        const now =
        this.sceneManager
        .getManager("environment")
        .getDate();
        const date =
        now.toDateString();

        const hour =
        now.getHours();
        if(
            date !== this.sleepCheckedDate
        ){

            this.sleepCheckedDate =
            date;

            this.sleepDecision =
            Math.random() < 0.95;
        }
        if(
            hour < 6
        ){

            if(
                this.sleepDecision &&
                !this.isSleeping
            ){
                this.startSleep();
            }
            return;
        }
        if(
            hour < 8
        ){
            if(
                this.sleepDecision &&
                Math.random()<0.3 &&
                !this.isSleeping
            ){
                this.startSleep();
            }

            if(
                this.isSleeping &&
                Math.random()>0.3
            ){
                this.wakeUp();
            }
            return;
        }
        if(
            this.isSleeping
        ){
            this.wakeUp();
        }
    }

    async startSleep(){
        await this.sceneManager.fade(
            async () => {
                this.play("sleep");
                this.isSleeping = true;
            }
        );
    }

    async wakeUp(){
        await this.sceneManager.fade(
            async () => {
                this.animationManager.stop();
                this.isSleeping = false;
                this.enterWait();
            }
        );
    }

    //Awake//
    chooseIdle(){
        const animation =
        this.sceneManager.getManager(
            "animation"
        );
        const list = [];

        if(
            this.isSleeping
        ){
            return;
        }

        for(
            const key in
            animation.animations
        ){
            const a =
            animation.animations[key];

            if(
                a.weight
            ){

                list.push({
                    name:key,
                    weight:a.weight
                });
            }
        }

        list.push({
            name:null,
            weight:5
        });
        const total =
        list.reduce(
            (
                s,
                a
            )=>
                s+a.weight,
                0
        );

        let r =
        Math.random() *
        total;

        for(
            const item of list
        ){
            r -=
            item.weight;
            if(
                r<=0
            ){
                if(
                    item.name
                ){
                    if(item.name==="walk"){

                        const places=[
                            "window",
                            "bookshelf",
                            "food"
                        ];
                        const target=
                        places[
                            Math.floor(
                                Math.random()*
                                places.length
                            )
                        ];
                        this.walkTo(target);
                    }
                    else{
                        this.play(item.name);
                    }
                }
                else{
                    this.enterWait();
                }
                return;
            }
        }
    }

    updateMove(deltaTime){
        const move = this.speed * deltaTime;

        const dx =
        this.targetPosition.x -
        this.position.x;

        const dy =
        this.targetPosition.y -
        this.position.y;

        const distance =
        Math.hypot(dx,dy);

        this.position.x += dx / distance * move;
        this.position.y += dy / distance * move;
        this.direction = dx >= 0 ? "right" : "left";
        this.updateTransform();

        if (distance < 2) {

            this.position = {
                ...this.targetPosition
            };

            this.targetPosition = null;

            if (this.walkTarget === "window") {
                this.direction = "right";
                this.updateTransform();
                this.play("watching_outside");
                return;
            }
            this.finish();
            return;
        }
    }

    walkTo(name) {
        this.walkTarget = name;
        this.moveTo(name);

        this.state = "walk";
        this.currentAnimation = "walk";

        this.animationManager.play(
            "walk",
            this.sprite
        );
    }

    play(name){
        this.state = name;
        this.currentAnimation = name;        
        this.animationManager.play(
            name,
            this.sprite,
            () => {
                if (this.state === "walk") {
                    if (this.walkTarget === "window") {
                        this.direction = "right";
                        this.updateTransform();
                        this.play("watching_outside");
                        return;
                    }
                }
                this.finish();
            }
        );
    }

    moveTo(name) {
        this.targetPosition =
        getGridPosition(
            PLACES[name]
        );
    }


    finish() {
        if (this.queue) {
            const job = this.queue;
            this.queue = null;
            if (job.type === "animation") {
                this.play(job.name);
                return;
            }

            if (job.type === "conversation") {
                this.startConversation();
                return;
            }
        }
        this.enterWait();
    }

    onTap() {
        if(
            this.isSleeping
        ){
            this.startConversation();
            return;
        }
        if (this.state === "wait") {
            this.startConversation();
            return;
        }
        this.handleInterrupt();
    }

    handleInterrupt() {
        const animation =
        this.animationManager.get(
            this.currentAnimation
        );

        if (!animation) {
            return;
        }

        switch (animation.interrupt) {
            case "ignore":
            return;
            case "queue":
            this.queue = {
                type: "conversation"
            };
            return;

            case "cancel":
            this.animationManager.stop();
            this.startConversation();
            return;
        }
    }

    startConversation() {
       console.log("Conversation");
       this.playEmotion("happy");
    }

    playEmotion(name) {
        if (this.state === "wait") {
            this.play(name);
            return;
        }
        this.queueAnimation(name);
    }

    queueAnimation(name) {
        this.queue = {
            type: "animation",
            name
        };
    }
}