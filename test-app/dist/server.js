"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 3001 });
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (data) => {
        
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server running on port 3001');
