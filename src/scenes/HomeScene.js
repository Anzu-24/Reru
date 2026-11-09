import { createGrid, createPlaceDebug} from "../config.js";
export default class HomeScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.saveManager =
            sceneManager.getManager("save");
        this.environmentManager =
            sceneManager.getManager("environment");
        this.imageManager =
            sceneManager.getManager("character");
        this.animationManager =
            sceneManager.getManager("animation");
    }

    async create() {
        this.environmentManager.updateTime();
        this.createBackground();
        this.createRoom();
        this.createLighting();
        this.createCharacter();
        this.createUI();
        this.createDialogue();
        this.sceneManager
        .getManager("loop")
        .start();
         createGrid(
        this.sceneManager.getLayer("ui-layer")
    );

    createPlaceDebug(
        this.sceneManager.getLayer("ui-layer")
    );
    }

    createBackground() {
        this.createImage(
            "background-layer",
            "./assets/backgrounds/day.png",
            "background"
        );
    }


    createRoom() {
        this.createImage(
            "room-layer",
            "./assets/room/room.png",
            "room"
        );
    }

    createLighting() {
        const hour =
        this.environmentManager.getHour();

        const src =
        hour >= 0 && hour < 6
        ? "./assets/room/lamp_off.png"
        : "./assets/room/lamp_on.png";

        const image =
        this.createImage(
            "lighting-layer",
            src,
            "lamp"
        );

        if (hour >= 0 && hour < 6) {
            this.sceneManager
            .getLayer("lighting-layer")
            .classList.add("night");
        }
    }

    createCharacter() {
         this.imageManager.create();
    }

    createUI() {
        const layer =
        this.sceneManager.getLayer(
            "ui-layer"
        );

        const ui =
        document.createElement("img");

        ui.id = "ui-base";
        ui.src =
        "./assets/ui/ui-base.png";
        layer.appendChild(ui);

        const days =
        document.createElement("span");
        days.id = "login-days";
        days.textContent =
        this.saveManager.get("login.totalDays");
        layer.appendChild(days);

        const menu =
        document.createElement("button");
        menu.id = "menu-button";
        layer.appendChild(menu);

        menu.addEventListener(
            "click",
            () => {
                console.log("menu clicked");
                this.sceneManager.change(
                    "menu"
                );
            }
        );
        layer.appendChild(menu);
    }

    createDialogue() {

        const layer =
            this.sceneManager.getLayer(
                "dialog-layer"
            );

        const dialogue =
            document.createElement("div");

        dialogue.id = "dialogue";

        layer.appendChild(dialogue);
    }
    async destroy() {
    }

    createImage(layerName, src, className) {
        const layer =
        this.sceneManager.getLayer(layerName);

        const image =
        document.createElement("img");
        image.src = src;
        image.className = className;
        layer.appendChild(image);
        return image;
    }
}