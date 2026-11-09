// EventManager.js
class EventManager {
    build(gameState) {
        gameState.events = [];
        if (gameState.calendar.timeZone) {
            gameState.events.push({
                id: gameState.calendar.timeZone,
                category: "time"
            });
        }

        if (gameState.calendar.season) {
            gameState.events.push({
                id: gameState.calendar.season,
                category: "season"
            });
        }

        if (gameState.weather.weather) {
            gameState.events.push({
                id: gameState.weather.weather,
                category: "weather"
            });
        }

        if (gameState.mood.id) {
            gameState.events.push({
                id: gameState.mood.id,
                category: "mood"
            });
        }

        if (gameState.login.events) {
            gameState.events.push(
                ...gameState.login.events
            );
        }
    }
}

export default new EventManager();