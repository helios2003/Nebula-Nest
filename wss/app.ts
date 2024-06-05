import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    console.log("Client connected");

    ws.on('message', message => {
        console.log('Received message:', message.toString());
    });

    ws.on('close', () => {
        console.log('Connection is closed');
    });
});

function sendMessage(message: string) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}
