const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { generateId } = require('zoo-ids');
const GameBoard = require('./GameBoard');
const { UPDATE_INTERVAL } = require('../../shared/config.js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Initialize game board
const gameBoard = new GameBoard(3000, 2000); // Much larger game board

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'update') {
                // Handle player position updates
                const { player_id, angle, speed, time } = data;
                
                // Calculate new position
                const deltaTime = (Date.now() - time) / 1000; // Convert to seconds
                const distance = 50 *speed * deltaTime;
                const currentPos = gameBoard.players.get(player_id);
                const updates = {
                    x: currentPos.x + Math.cos(angle) * distance,
                    y: currentPos.y + Math.sin(angle) * distance
                };
                
                // Update player position
                gameBoard.updatePlayer(player_id, updates);
                
                // Queue broadcast if not already queued
                queueBroadcast();
            } else if (data.type === 'join') {
                // Generate a new silly unique player ID
                const player_id = generateId('dogs are literal angels');
                
                // Create new player with generated ID
                const newPlayer = {
                    player_id,
                    x: Math.random() * gameBoard.xMax,
                    y: Math.random() * gameBoard.yMax,
                    size: 1 // Default size
                };
                
                // Add player to game board
                gameBoard.addPlayer(newPlayer);
                
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
            gameBoard.removePlayer(ws.player_id);
            broadcastGameState();
        }
    });
    
    // Send initial game state to the new client
    ws.send(JSON.stringify({
        type: 'gameState',
        ...gameBoard.getState()
    }));
});

// Broadcast throttling
let broadcastQueued = false;
const BROADCAST_INTERVAL = UPDATE_INTERVAL; // ms between broadcasts

// Queue a broadcast if one isn't already queued
function queueBroadcast() {
    if (!broadcastQueued) {
        broadcastQueued = true;
        setTimeout(() => {
            broadcastGameState();
            broadcastQueued = false;
        }, BROADCAST_INTERVAL);
    }
}

// Broadcast game state to all connected clients
function broadcastGameState() {
    const gameState = gameBoard.getState();
    
    const message = JSON.stringify({
        type: 'gameState',
        ...gameState
    });
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
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
