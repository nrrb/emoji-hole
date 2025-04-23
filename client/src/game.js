const ws = new WebSocket('ws://localhost:3000');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const speedInput = document.getElementById('speed');
const angleInput = document.getElementById('angle');

let myPlayerId = null;
let gameState = { players: [], objects: [], xMax: 800, yMax: 600 };

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
    // Update canvas size if needed
    if (canvas.width !== gameState.xMax || canvas.height !== gameState.yMax) {
        canvas.width = gameState.xMax;
        canvas.height = gameState.yMax;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game objects
    gameState.objects?.forEach(obj => {
        ctx.font = `${obj.size * 20}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.emoji, obj.x, obj.y);
    });

    // Draw players
    gameState.players.forEach(player => {
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
        if(myPlayerId === player.player_id  && myPlayerId) {
            ctx.fillText("YOU", player.x, player.y - (fontSize / 2 + 10));
        } else {
            ctx.fillText(player.player_id, player.x, player.y - (fontSize / 2 + 10));
        }
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
