export default class SceneManager {

    constructor(game, managers = {}) {
        this.game = game;
        this.managers = managers;
        this.sceneClasses = new Map();
        this.currentScene = null;
        this.isFading = false;
    }

    register(name, SceneClass) {
        this.sceneClasses.set(name, SceneClass);
    }

    async change(name, data = null) {
        const SceneClass = this.sceneClasses.get(name);
        if (!SceneClass) {
            console.error(`Scene "${name}" is not registered.`);
            return;
        }

        if (this.currentScene) {
            if (typeof this.currentScene.destroy === "function") {
                await this.currentScene.destroy();
            }
        }

        this.clearLayers();
        this.currentScene = new SceneClass(this, data);
        if (typeof this.currentScene.create === "function") {
            await this.currentScene.create();
        }
    }

    getCurrentScene() {
        return this.currentScene;
    }

    getGame() {
        return this.game;
    }

    getManager(name) {
        return this.managers[name] || null;
    }

    getLayer(id) {
        return this.game.querySelector(`#${id}`);
    }

    clearLayer(id) {
        const layer = this.getLayer(id);
        if (layer) {
            layer.innerHTML = "";
        }
    }

    clearLayers() {
        const ids = [
            "background-layer",
            "room-layer",
            "lighting-layer",
            "character-layer",
            "effect-layer",
            "ui-layer",
            "dialog-layer",
            "menu-layer"
        ];
        ids.forEach(id => this.clearLayer(id));
    }

    updateLighting() {
        const hour =
        this.getManager("environment")
        .getHour();
        const effectLayer =
        this.getLayer("effect-layer");
        if (hour < 6) {
            effectLayer.style.opacity = "0.35";
        } else {
            effectLayer.style.opacity = "0";
        }
    }

    async fadeOut(duration = 500) {
        if (this.isFading) return;
        this.isFading = true;
        const layer =
        this.getLayer("fade-layer");

        layer.style.transition =
        `opacity ${duration}ms`;

        layer.style.opacity = "1";

        await new Promise(resolve =>
            setTimeout(resolve, duration)
        );
    }

    async fadeIn(duration = 500) {
        const layer =
        this.getLayer("fade-layer");

        layer.style.transition =
        `opacity ${duration}ms`;

        layer.style.opacity = "0";
        await new Promise(resolve =>
            setTimeout(resolve, duration)
        );
        this.isFading = false;
    }

    async fade(callback, duration = 500) {
        await this.fadeOut(duration);
        if (callback) {
            await callback();
        }
        await this.fadeIn(duration);
    }
}