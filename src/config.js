export const GAME = {
    width: 540,
    height: 960
};
export const GRID = {
    cols: 9,
    rows: 16
};

export const CONFIG = {

    // App

    APP_NAME: "My Character",
    VERSION: "0.1.0",

    // Save

    SAVE_KEY: "my_character_save",

    // Time

    TIME_ZONE: "Asia/Tokyo",

    // Dialogue

    DIALOG_DURATION: 5000,

};

export const LAYERS = {

    BACKGROUND: "background-layer",
    ROOM: "room-layer",
    EFFECT: "effect-layer",
    CHARACTER: "character-layer",
    UI: "ui-layer",
    MENU: "menu-layer",
    DIALOG: "dialog-layer",
    FADE: "fade-layer",
        LIGHTING: "lighting-layer"


};

export const SCENES = {

    START: "StartScene",
    HOME: "HomeScene",
    MENU: "MenuScene"

};

export const TIME_PERIOD = {

    LATE_NIGHT: "lateNight",
    MORNING: "morning",
    DAY: "day",
    EVENING: "evening",
    NIGHT: "night"

};

export const PLACES = {
    center: { col: 4, row: 10.5, },
    window: { col: 5, row: 8.5 },
    food: { col: 8, row: 14 },
    bookshelf: { col: 1, row: 8.5 }
};

export function getTimePeriod(date = new Date()) {
    const hour = date.getHours();
    if (hour >= 0 && hour <= 5) {
        return TIME_PERIOD.LATE_NIGHT;
    }
    if (hour <= 10) {
        return TIME_PERIOD.MORNING;
    }
    if (hour <= 16) {
        return TIME_PERIOD.DAY;
    }
    if (hour <= 18) {
        return TIME_PERIOD.EVENING;
    }
    return TIME_PERIOD.NIGHT;
}

export function getGridPosition(place) {
    return {
        x: (place.col + 0.5) / GRID.cols,
        y: (place.row + 0.5) / GRID.rows
    };
}

export function createGrid(layer) {

    // 縦線
    for (let c = 0; c <= GRID.cols; c++) {

        const line = document.createElement("div");

        line.style.position = "absolute";
        line.style.left = `${(c / GRID.cols) * 100}%`;
        line.style.top = "0";
        line.style.width = "1px";
        line.style.height = "100%";
        line.style.background = "rgba(255,0,0,.5)";
        line.style.pointerEvents = "none";

        layer.appendChild(line);
    }

    // 横線
    for (let r = 0; r <= GRID.rows; r++) {

        const line = document.createElement("div");

        line.style.position = "absolute";
        line.style.left = "0";
        line.style.top = `${(r / GRID.rows) * 100}%`;
        line.style.width = "100%";
        line.style.height = "1px";
        line.style.background = "rgba(255,0,0,.5)";
        line.style.pointerEvents = "none";

        layer.appendChild(line);
    }
}

export function createPlaceDebug(layer) {

    for (const key in PLACES) {

        const pos = getGridPosition(PLACES[key]);

        const dot = document.createElement("div");

        dot.style.position = "absolute";
        dot.style.left = `${pos.x * 100}%`;
        dot.style.top = `${pos.y * 100}%`;

        dot.style.width = "8px";
        dot.style.height = "8px";

        dot.style.background = "blue";
        dot.style.borderRadius = "50%";
        dot.style.transform = "translate(-50%, -50%)";
        dot.style.pointerEvents = "none";

        layer.appendChild(dot);
    }
}
