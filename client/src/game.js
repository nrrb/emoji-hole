const ws = new WebSocket('ws://localhost:3000');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const speedInput = document.getElementById('speed');
const angleInput = document.getElementById('angle');

let myPlayerId = null;
let gameState = { players: [] };

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
        gameState = data;
        drawGame();
    }
};

ws.onclose = () => {
    statusDiv.textContent = 'Disconnected';
};

// Game rendering
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    gameState.players.forEach(player => {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size * 10, 0, Math.PI * 2);
        ctx.fillStyle = player.player_id === myPlayerId ? '#0088ff' : '#ff0000';
        ctx.fill();
        ctx.stroke();
        
        // Draw player ID above the circle
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.player_id, player.x, player.y - 15);
    });
}

// Update loop
setInterval(() => {
    if (myPlayerId) {
        ws.send(JSON.stringify({
            type: 'update',
            player_id: myPlayerId,
            angle: (parseInt(angleInput.value) * Math.PI) / 180,
            speed: parseInt(speedInput.value) / 10,
            time: Date.now()
        }));
    }
}, 50); // Send updates every 50ms
