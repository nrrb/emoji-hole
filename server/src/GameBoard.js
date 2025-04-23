const EmojiGroups = require('./EmojiTypes');
const { utils: EmojiUtils, ...EmojiTypes } = EmojiGroups;

class GameBoard {
    constructor(xMax = 800, yMax = 600) {
        this.xMax = xMax;
        this.yMax = yMax;
        this.objects = [];
        this.players = new Map();
        this.initializeObjects();
    }

    initializeObjects() {
        // Clear existing objects
        this.objects = [];
        console.log('Initializing objects...')

        // Helper function to get random objects from a group
        const getRandomObjectsFromGroup = (group, count) => {
            const objects = [];
            for (let i = 0; i < count; i++) {
                const emoji = group.emojis[Math.floor(Math.random() * group.emojis.length)];
                objects.push({
                    x: Math.random() * this.xMax,
                    y: Math.random() * this.yMax,
                    size: emoji.sizeValue || 1,
                    class: group.groupName,
                    emoji: emoji.emoji,
                    effect: emoji.effect,
                    ...emoji // Spread other properties like damageValue, duration, etc.
                });
            }
            return objects;
        };

        // Distribute 100 objects across different types
        const distribution = {
            BASIC_FOOD: 40,
            SPECIAL_FOOD: 30,
            HAZARDS: 20,
            POWERUPS: 10
        };

        // Create objects for each type based on distribution
        Object.entries(distribution).forEach(([type, count]) => {
            if (EmojiTypes[type]) {
                this.objects.push(...getRandomObjectsFromGroup(EmojiTypes[type], count));
                console.log(`Created ${count} ${type} objects`)
            }
        });
    }

    // Get current game state including both objects and players
    getState() {
        return {
            xMax: this.xMax,
            yMax: this.yMax,
            objects: this.objects,
            players: Array.from(this.players.values())
        };
    }

    // Add a player to the game
    addPlayer(player) {
        this.players.set(player.player_id, player);
    }

    // Remove a player from the game
    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    // Update a player's position
    updatePlayer(playerId, updates) {
        const player = this.players.get(playerId);
        if (player) {
            Object.assign(player, updates);
        }
    }
}

module.exports = GameBoard;
