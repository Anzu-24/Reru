export default class SaveManager {

    constructor() {

        this.storageKey = "my-character-save";

        this.data = this.createDefaultData();

    }

    createDefaultData() {

        return {

            version: 1,

            login: {

                totalDays: 1,

                consecutiveDays: 1,

                lastLoginDate: null

            },

            status: {

                point: 0,

                mood: "normal"

            },

            dialogue: {

                date: null,

                played: []

            }

        };

    }

    load() {

        const json = localStorage.getItem(this.storageKey);

        if (!json) {

            this.save();

            return this.data;

        }

        try {

            const saveData = JSON.parse(json);

            this.data = this.mergeData(this.createDefaultData(), saveData);

        } catch (error) {

            console.error(error);

            this.data = this.createDefaultData();

            this.save();

        }

        return this.data;

    }

    save() {

        localStorage.setItem(

            this.storageKey,

            JSON.stringify(this.data)

        );

    }

    mergeData(defaultData, saveData) {

        const result = structuredClone(defaultData);

        this.deepMerge(result, saveData);

        return result;

    }

    deepMerge(target, source) {

        for (const key in source) {

            if (

                source[key] !== null &&

                typeof source[key] === "object" &&

                !Array.isArray(source[key])

            ) {

                if (!target[key]) {

                    target[key] = {};

                }

                this.deepMerge(target[key], source[key]);

            }

            else {

                target[key] = source[key];

            }

        }

    }

    get(path) {

        const keys = path.split(".");

        let value = this.data;

        for (const key of keys) {

            value = value[key];

            if (value === undefined) {

                return null;

            }

        }

        return value;

    }

    set(path, value) {

        const keys = path.split(".");

        let target = this.data;

        while (keys.length > 1) {

            const key = keys.shift();

            if (!(key in target)) {

                target[key] = {};

            }

            target = target[key];

        }

        target[keys[0]] = value;

        this.save();

    }

    export() {

        return JSON.stringify(this.data, null, 2);

    }

    import(json) {

        try {

            const data = JSON.parse(json);

            this.data = this.mergeData(

                this.createDefaultData(),

                data

            );

            this.save();

            return true;

        }

        catch (error) {

            console.error(error);

            return false;

        }

    }

}