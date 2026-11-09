export default class LoadingScene {

    constructor(sceneManager) {

        this.sceneManager = sceneManager;

        this.dialogueManager =
            sceneManager.getManager("dialogue");

    }

    async create() {

        const ui =
            this.sceneManager.getLayer("ui-layer");

        const loading =
            document.createElement("div");

        loading.id = "loading";

        loading.textContent = "Loading...";

        ui.appendChild(loading);

        await this.loadJSON();

        await this.sceneManager.change(
            "home"
        );

    }

    async loadJSON() {

        const files = [

            [
                "00_common",
                "./data/dialogues/00_common.json"
            ],

            [
                "01_mood",
                "./data/dialogues/01_mood.json"
            ],

            [
                "02_time",
                "./data/dialogues/02_time.json"
            ],

            [
                "03_weather",
                "./data/dialogues/03_weather.json"
            ],

            [
                "04_season",
                "./data/dialogues/04_season.json"
            ],

            [
                "05_calendar",
                "./data/dialogues/05_calendar.json"
            ],

            [
                "06_anniversary",
                "./data/dialogues/06_anniversary.json"
            ]

        ];

        let dialogues = [];

        for (const file of files) {
            const response = await fetch(file[1]);
            if (!response.ok) {
                throw new Error(`Failed to load JSON: ${file[1]}`);
            }
            const data = await response.json();
            dialogues.push(...data);
        }

        this.dialogueManager.setDialogues(
            dialogues
        );

    }

    async destroy() {

    }

}