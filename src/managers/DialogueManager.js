export default class DialogueManager {

    constructor(sceneManager) {

        this.sceneManager = sceneManager;

        this.dialogues = [];

    }

    setDialogues(dialogues) {

        if (Array.isArray(dialogues)) {

            this.dialogues = dialogues;

        }

    }

    getDialogue(context = {}) {

        const candidates = this.dialogues.filter(dialogue => {

            return this.checkRequire(dialogue.require, context)
                && this.checkExclude(dialogue.exclude, context);

        });

        if (candidates.length === 0) {

            return null;

        }

        return this.selectByWeight(candidates);

    }

    checkRequire(require = {}, context = {}) {

        for (const key in require) {

            const value = require[key];

            if (value === undefined || value === null) {

                continue;

            }

            if (Array.isArray(value)) {

                if (value.length === 0) {

                    continue;

                }

                if (!value.includes(context[key])) {

                    return false;

                }

            } else {

                if (context[key] !== value) {

                    return false;

                }

            }

        }

        return true;

    }

    checkExclude(exclude = {}, context = {}) {

        for (const key in exclude) {

            const value = exclude[key];

            if (value === undefined || value === null) {

                continue;

            }

            if (Array.isArray(value)) {

                if (value.includes(context[key])) {

                    return false;

                }

            } else {

                if (context[key] === value) {

                    return false;

                }

            }

        }

        return true;

    }

    selectByWeight(dialogues) {

        const total = dialogues.reduce((sum, dialogue) => {

            return sum + (dialogue.weight || 1);

        }, 0);

        let random = Math.random() * total;

        for (const dialogue of dialogues) {

            random -= (dialogue.weight || 1);

            if (random <= 0) {

                return dialogue;

            }

        }

        return dialogues[0];

    }

}