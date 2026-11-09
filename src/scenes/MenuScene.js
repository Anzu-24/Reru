export default class MenuScene {

    constructor(sceneManager) {

        this.sceneManager = sceneManager;

        this.saveManager =
            sceneManager.getManager("save");

        this.container = null;

    }

    async create() {

        const layer =
            this.sceneManager.getLayer(
                "menu-layer"
            );

        this.container =
            document.createElement("div");

        this.container.id = "menu";

        const title =
            document.createElement("h2");

        title.textContent = "MENU";

        this.container.appendChild(title);

        const exportButton =
            document.createElement("button");

        exportButton.textContent =
            "JSONを書き出す";

        exportButton.addEventListener(
            "click",
            () => this.exportSave()
        );

        this.container.appendChild(
            exportButton
        );

        const importButton =
            document.createElement("button");

        importButton.textContent =
            "JSONを読み込む";

        importButton.addEventListener(
            "click",
            () => this.importSave()
        );

        this.container.appendChild(
            importButton
        );

        const closeButton =
            document.createElement("button");

        closeButton.textContent = "閉じる";

        closeButton.addEventListener(
            "click",
            () => {

                this.sceneManager.change(
                    "home"
                );

            }
        );

        this.container.appendChild(
            closeButton
        );

        layer.appendChild(
            this.container
        );

    }

    exportSave() {

        const json =
            this.saveManager.export();

        const blob =
            new Blob(
                [json],
                {
                    type: "application/json"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = "save.json";

        link.click();

        URL.revokeObjectURL(url);

    }

    importSave() {

        const input =
            document.createElement("input");

        input.type = "file";

        input.accept = ".json";

        input.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                if (!file) {

                    return;

                }

                const reader =
                    new FileReader();

                reader.onload = () => {

                    const success =
                        this.saveManager.import(
                            reader.result
                        );

                    if (success) {

                        alert(
                            "読み込みが完了しました。"
                        );

                        this.sceneManager.change(
                            "home"
                        );

                    }

                    else {

                        alert(
                            "JSONの読み込みに失敗しました。"
                        );

                    }

                };

                reader.readAsText(file);

            }
        );

        input.click();

    }

    async destroy() {

        if (!this.container) {

            return;

        }

        this.container.remove();

        this.container = null;

    }

}