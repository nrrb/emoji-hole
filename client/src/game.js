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
    console.log('Mouse moved:', { mouseX, mouseY });
});

let myPlayerId = null;
let gameState = { players: [], objects: [], xMax: 3000, yMax: 2000 };
let viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

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
        console.log('Received game state:', data);
        gameState = data;
        drawGame();
    }
};

ws.onclose = () => {
    statusDiv.textContent = 'Disconnected';
};

// Game rendering
function updateViewport() {
    const player = gameState.players.find(p => p.player_id === myPlayerId);
    if (!player) return;

    // Calculate target viewport position (centered on player)
    const targetX = player.x - viewport.width / 2;
    const targetY = player.y - viewport.height / 2;

    // Clamp viewport to game bounds
    viewport.x = Math.max(0, Math.min(targetX, gameState.xMax - viewport.width));
    viewport.y = Math.max(0, Math.min(targetY, gameState.yMax - viewport.height));
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update viewport position
    updateViewport();

    // Save context state
    ctx.save();
    
    // Translate context to implement viewport scrolling
    ctx.translate(-viewport.x, -viewport.y);
    
    // Draw game objects that are in or near the viewport
    gameState.objects?.forEach(obj => {
        if (isInViewport(obj.x, obj.y)) {
            ctx.font = `${obj.size * 20}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(obj.emoji, obj.x, obj.y);
        }
    });

    // Draw players
    gameState.players.forEach(player => {
        if (isInViewport(player.x, player.y)) {
            // Set font size based on player size
            const fontSize = player.size * 20;
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw the emoji
            ctx.fillText('🕳️', player.x, player.y);
            
            // Draw player ID above the emoji
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            if(myPlayerId === player.player_id && myPlayerId) {
                ctx.fillText("YOU", player.x, player.y - (fontSize / 2 + 10));
            } else {
                ctx.fillText(player.player_id, player.x, player.y - (fontSize / 2 + 10));
            }
        }
    });

    // Restore context state
    ctx.restore();
}

// Update loop
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
                time: Date.now()
            };
            console.log('Sending update:', update);
            ws.send(JSON.stringify(update));
        }
    }
}, 50); // Send updates every 50ms
