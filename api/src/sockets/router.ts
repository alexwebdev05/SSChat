import { Server } from 'ws';

const router = (wss: Server) => {

    // On connect
    wss.on('connection', (ws) => {
        console.log('Client connected');

        // On receive a message
        ws.on('message', (message) => {

            

            // console.log(`Received: ${message}`);
            // ws.send(`Echo: ${message}`);
        });

        // On Log out
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

export default router;