export default class EnvironmentManager {

    constructor() {
        this.weather = null;
        this.temperature = null;
        this.time = new Date();
    }

    updateTime() {
        this.time = new Date();
    }

    getDate() {
        return this.time;
    }

    getHour() {
        return this.time.getHours();
    }

    getMinute() {
        return this.time.getMinutes();

    }

    getTimePeriod() {
        const hour = this.getHour();
        if (hour >= 0 && hour < 6) {
            return "lateNight";
        }

        if (hour < 11) {
            return "morning";
        }

        if (hour < 17) {
            return "day";
        }

        if (hour < 19) {
            return "evening";
        }
        return "night";

    }


    setWeather(weather, temperature) {

        this.weather = weather;

        this.temperature = temperature;

    }

    getWeather() {

        return this.weather;

    }

    getTemperature() {

        return this.temperature;

    }

}