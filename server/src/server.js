const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { nanoid } = require('nanoid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Game state storage
const players = new Map();

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'update') {
                // Handle player position updates
                const { player_id, angle, speed, time } = data;
                const player = players.get(player_id);
                
                if (player) {
                    // Simple physics update based on angle and speed
                    const deltaTime = (Date.now() - time) / 1000; // Convert to seconds
                    const distance = speed * deltaTime;
                    
                    player.x += Math.cos(angle) * distance;
                    player.y += Math.sin(angle) * distance;
                    
                    // Broadcast updated positions to all clients
                    broadcastGameState();
                }
            } else if (data.type === 'join') {
                // Generate a new unique player ID
                const player_id = nanoid(8); // 8-character unique ID
                
                // Create new player with generated ID
                players.set(player_id, {
                    player_id,
                    x: Math.random() * 800, // Random starting position
                    y: Math.random() * 600,
                    size: 1 // Default size
                });
                
                // Send the player their ID
                ws.send(JSON.stringify({
                    type: 'player_id',
                    player_id
                }));
                
                // Store the player ID with the WebSocket connection
                ws.player_id = player_id;
                
                broadcastGameState();
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Remove player from game state when they disconnect
        if (ws.player_id) {
            players.delete(ws.player_id);
            broadcastGameState();
        }
    });
    
    // Send initial game state to the new client
    ws.send(JSON.stringify({
        type: 'gameState',
        players: Array.from(players.values())
    }));
});

// Broadcast game state to all connected clients
function broadcastGameState() {
    const gameState = {
        type: 'gameState',
        players: Array.from(players.values())
    };
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(gameState));
        }
    });
}

// Basic HTTP endpoint for health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
