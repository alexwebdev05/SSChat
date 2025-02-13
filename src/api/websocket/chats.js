import { socketConnection } from "./connection";

let ws;

// Verifie connection
const verifieConnection = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket not connected. Attempting to reconnect...');
        socketConnection();
    }
};

// Get chats
export const getChats = (user) => {
    verifieConnection();
    ws.send(JSON.stringify({
        type: "get-chats",
        clientID: user
    }));
};