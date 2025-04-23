const EmojiGroups = require('./EmojiTypes');
const { utils: EmojiUtils } = EmojiGroups;

class GameBoard {
    constructor(xMax = 3000, yMax = 2000) {
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
        const totalObjects = 100;
        
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
    // Check if an object is in viewport
    isInViewport(obj, viewport) {
        const margin = 100; // Add margin for smooth transitions
        return obj.x >= viewport.x - margin &&
               obj.x <= viewport.x + viewport.width + margin &&
               obj.y >= viewport.y - margin &&
               obj.y <= viewport.y + viewport.height + margin;
    }

    getState(viewport) {
        let filteredPlayers = Array.from(this.players.values());
        let filteredObjects = this.objects;

        // If viewport is provided, filter objects and players
        if (viewport) {
            filteredPlayers = filteredPlayers.filter(player => this.isInViewport(player, viewport));
            filteredObjects = this.objects.filter(obj => this.isInViewport(obj, viewport));
        }

        return {
            players: filteredPlayers,
            objects: filteredObjects,
            xMax: this.xMax,
            yMax: this.yMax
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

    // Check if two circles overlap
    checkCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate radii based on size (20px is base font size)
        const r1 = circle1.size * 10; // Half of font size
        const r2 = circle2.size * 10;
        
        return distance < (r1 + r2);
    }

    // Spawn a new object based on player size
    spawnNewObject(playerSize) {
        const spawnableEmojis = EmojiUtils.getSpawnableEmojis(playerSize);
        const emoji = spawnableEmojis[Math.floor(Math.random() * spawnableEmojis.length)];
        
        return {
            x: Math.random() * this.xMax,
            y: Math.random() * this.yMax,
            size: emoji.sizeValue,
            class: emoji.name,
            emoji: emoji.emoji,
            points: emoji.points
        };
    }

    // Update a player's position
    updatePlayer(playerId, updates) {
        if (!this.players.has(playerId)) return;
        
        const player = this.players.get(playerId);
        
        // Update player position
        player.x = Math.max(0, Math.min(updates.x, this.xMax));
        player.y = Math.max(0, Math.min(updates.y, this.yMax));

        // Check for collisions with objects
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (this.checkCollision(player, obj)) {
                if(player.size > obj.size) {
                    // Increase player size
                    player.size += 0.1 * obj.size;
                    
                    // Remove the collected object
                    this.objects.splice(i, 1);
                    
                    // Spawn a new object based on the player's new size
                    this.objects.push(this.spawnNewObject(player.size));
                }
            }
        }
    }
}

module.exports = GameBoard;
