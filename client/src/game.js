import { UPDATE_INTERVAL } from '../../shared/config.mjs';

const ws = new WebSocket('ws://localhost:3000');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
let mouseX = 0;
let mouseY = 0;

// Track mouse movement
// Helper function to check if a point is in or near the viewport
function isInViewport(x, y) {
    const margin = 100; // Draw slightly outside viewport for smooth scrolling
    return x >= viewport.x - margin &&
           x <= viewport.x + viewport.width + margin &&
           y >= viewport.y - margin &&
           y <= viewport.y + viewport.height + margin;
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    // Add viewport offset to mouse coordinates
    mouseX = e.clientX - rect.left + viewport.x;
    mouseY = e.clientY - rect.top + viewport.y;
});

let myPlayerId = null;
let gameState = { players: [], objects: [], xMax: 3000, yMax: 2000 };
let previousGameState = null;
let lastUpdateTime = Date.now();
let viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

// Interpolation settings
const INTERPOLATION_DURATION = UPDATE_INTERVAL; // Match server's broadcast interval

// Handle window resizing
window.addEventListener('resize', () => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
});

// Initial canvas size
canvas.width = viewport.width;
canvas.height = viewport.height;

// WebSocket message handling
ws.onopen = () => {
    statusDiv.textContent = 'Connected! Joining game...';
    ws.send(JSON.stringify({ type: 'join' }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'player_id') {
        myPlayerId = data.player_id;
        statusDiv.textContent = `Playing as: ${myPlayerId}`;
    } else if (data.type === 'gameState') {
        previousGameState = gameState;
        gameState = data;
        lastUpdateTime = Date.now();
        // Ensure first update has smooth start
        if (!previousGameState) {
            previousGameState = JSON.parse(JSON.stringify(gameState));
        }
    }
};

ws.onclose = () => {
    statusDiv.textContent = 'Disconnected';
};

// Game rendering
function updateViewport(interpolatedPlayer) {
    const player = interpolatedPlayer || gameState.players.find(p => p.player_id === myPlayerId);
    if (!player) return;

    // Calculate target viewport position (centered on player)
    const targetX = player.x - viewport.width / 2;
    const targetY = player.y - viewport.height / 2;

    // Clamp viewport to game bounds
    viewport.x = Math.max(0, Math.min(targetX, gameState.xMax - viewport.width));
    viewport.y = Math.max(0, Math.min(targetY, gameState.yMax - viewport.height));
}

// Interpolate between two values
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Get interpolated position for an object
function getInterpolatedPosition(current, previous) {
    if (!previous) return current;

    const timeSinceUpdate = Date.now() - lastUpdateTime;
    const t = Math.min(timeSinceUpdate / INTERPOLATION_DURATION, 1);

    return {
        x: lerp(previous.x, current.x, t),
        y: lerp(previous.y, current.y, t),
        size: current.size // Don't interpolate size
    };
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update viewport position using interpolated player position
    if (previousGameState) {
        const currentPlayer = gameState.players.find(p => p.player_id === myPlayerId);
        const previousPlayer = previousGameState.players.find(p => p.player_id === myPlayerId);
        if (currentPlayer && previousPlayer) {
            const interpolatedPlayer = getInterpolatedPosition(currentPlayer, previousPlayer);
            updateViewport(interpolatedPlayer);
        } else {
            updateViewport();
        }
    } else {
        updateViewport();
    }

    // Save context state
    ctx.save();
    
    // Translate context to implement viewport scrolling
    ctx.translate(-viewport.x, -viewport.y);
    
    // Draw game objects that are in or near the viewport
    if (gameState.objects) {
        gameState.objects.forEach(obj => {
            if (isInViewport(obj.x, obj.y)) {
                const objFontSize = obj.size * 20;
                ctx.font = `${objFontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw the emoji
                ctx.fillText(obj.emoji, obj.x, obj.y);
                
                // Draw object info above the emoji
                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                ctx.fillText(`${obj.class} (${obj.size.toFixed(1)})`, obj.x, obj.y - (objFontSize / 2 + 10));
            }
        });
    }

    // Draw players with interpolation
    if (gameState.players && previousGameState?.players) {
        gameState.players.forEach(player => {
            const prevPlayer = previousGameState.players.find(p => p.player_id === player.player_id);
            if (prevPlayer && isInViewport(player.x, player.y)) {
                const interpolated = getInterpolatedPosition(player, prevPlayer);
                
                // Set font size based on player size
                const fontSize = player.size * 20;
                ctx.font = `${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw the emoji
                ctx.fillText('🕳️', interpolated.x, interpolated.y);
                
                // Draw player info above the emoji
                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                const displayName = myPlayerId === player.player_id && myPlayerId ? "YOU" : player.player_id;
                ctx.fillText(`${displayName} (${player.size.toFixed(1)})`, interpolated.x, interpolated.y - (fontSize / 2 + 10));
            }
        });
    }

    // Restore context state
    ctx.restore();
}

// Animation frame loop
function animate() {
    drawGame();
    requestAnimationFrame(animate);
}

// Start animation loop
animate();

// Update loop for sending position updates
setInterval(() => {
    if (myPlayerId) {
        // Find my current position
        const player = gameState.players.find(p => p.player_id === myPlayerId);
        if (player) {
            // Calculate angle and speed based on mouse position
            const dx = mouseX - player.x;
            const dy = mouseY - player.y;
            const angle = Math.atan2(dy, dx);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = distance;
            
            const update = {
                type: 'update',
                player_id: myPlayerId,
                angle: angle,
                speed: speed,
                time: Date.now(),
                viewport: {
                    x: viewport.x,
                    y: viewport.y,
                    width: viewport.width,
                    height: viewport.height
                }
            };
            ws.send(JSON.stringify(update));
        }
    }
}, 50); // Send updates every 50ms
