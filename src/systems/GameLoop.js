export default class GameLoop {

    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.lastTime = 0;
        this.running = false;
        this.update = this.update.bind(this);
    }

    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(
            this.update.bind(this)
        );
    }

    stop() {
        this.running = false;
    }

    update(now) {
        if (!this.running) {
            return;
        }

        const deltaTime =
            (now - this.lastTime) / 1000;
        this.lastTime = now;

        const environment =
        this.sceneManager.getManager(
            "environment"
        );
        if (environment) {
            environment.updateTime();
        }
        this.sceneManager.updateLighting();

        const character =
            this.sceneManager.getManager(
                "character"
            );
        if (
            character &&
            typeof character.update === "function"
        ) {
            character.update(deltaTime);
        }

        requestAnimationFrame(
            this.update.bind(this)
        );
    }
}