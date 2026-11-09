export default class StartScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.container = null;
        this.onClick = this.onClick.bind(this);
    }

    async create() {

        const layer =
            this.sceneManager.getLayer("ui-layer");

        this.container =
            document.createElement("div");

        this.container.id = "start-screen";

        this.container.classList.add("fade-in");

        this.container.innerHTML = `
            <div id="start-message">
                <h1>コンコン…</h1>
                <p>画面をタップして部屋に入る</p>
            </div>
        `;

        layer.appendChild(this.container);

        this.container.onclick = this.onClick;
    }

    async onClick() {
        this.container.classList.remove("fade-in");
        this.container.classList.add("fade-out");

        await new Promise(resolve =>
            setTimeout(resolve, 350)
        );

        await this.sceneManager.change(
            "loading"
        );

    }

    async destroy() {
        if (!this.container) {
            return;
        }

        this.container.removeEventListener(
            "click",
            this.onClick
        );
        this.container.remove();
        this.container = null;
    }
}