const express = require('express');
const http = require('http');
const WebSocket = require('ws');

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
                // Handle new player joining
                const { player_id } = data;
                players.set(player_id, {
                    player_id,
                    x: Math.random() * 800, // Random starting position
                    y: Math.random() * 600,
                    size: 30 // Default size
                });
                broadcastGameState();
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Could add player cleanup here if needed
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
