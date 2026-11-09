import SceneManager from "./managers/SceneManager.js";
import SaveManager from "./managers/SaveManager.js";
import EnvironmentManager from "./managers/EnvironmentManager.js";
import AnimationManager from "./managers/AnimationManager.js";
import CharacterManager from "./managers/CharacterManager.js";
import DialogueManager from "./managers/DialogueManager.js";
import GameLoop from "./systems/GameLoop.js";

import StartScene from "./scenes/StartScene.js";
import LoadingScene from "./scenes/LoadingScene.js";
import HomeScene from "./scenes/HomeScene.js";
import MenuScene from "./scenes/MenuScene.js";


window.addEventListener("DOMContentLoaded", async () => {
    const game = document.getElementById("game");
    const managers = {};
    const sceneManager = new SceneManager(
        game,
        managers
    );

    managers.save = new SaveManager();
    managers.environment = new EnvironmentManager();
    managers.animation = new AnimationManager();
    await managers.animation.load();
    managers.character = new CharacterManager(sceneManager);
    const loop =
    new GameLoop(
        sceneManager
    );
    managers.loop = loop;

    managers.dialogue =
        new DialogueManager(
            sceneManager
        );
    managers.save.load();
    sceneManager.register(
        "start",
        StartScene
    );
    sceneManager.register(
        "loading",
        LoadingScene
    );
    sceneManager.register(
        "home",
        HomeScene
    );
    sceneManager.register(
        "menu",
        MenuScene
    );
    await sceneManager.change(
        "start"
    );
});