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
        console.log('Initializing objects...');

        // Get spawnable emojis based on initial player size (1.0)
        const spawnableEmojis = EmojiUtils.getSpawnableEmojis(1.0);
        
        // Create 20 random objects from the spawnable emojis
        const totalObjects = 20;
        
        for (let i = 0; i < totalObjects; i++) {
            const emoji = spawnableEmojis[Math.floor(Math.random() * spawnableEmojis.length)];
            this.objects.push({
                x: Math.random() * this.xMax,
                y: Math.random() * this.yMax,
                size: emoji.sizeValue,
                class: emoji.name,
                emoji: emoji.emoji,
                points: emoji.points
            });
        }
        
        console.log(`Created ${this.objects.length} objects`);
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
