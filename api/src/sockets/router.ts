import { Server } from 'ws';

// Controllers
import { MessageController } from './controllers/message.controller';

const router = (wss: Server) => {

    // On connect
    wss.on('connection', (ws) => {
        console.log('Client connected');

        // On receive a message
        ws.on('message', async (message) => {
            const messageJson = JSON.parse(message.toString());

            if ( messageJson.action == "getmessages" ) {
                const response = await MessageController.getmessages(messageJson)
                ws.send(JSON.stringify(response));
            }

        });

        // On Log out
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

export default router;