// React libraries
import { EventEmitter } from 'fbemitter';

/** Function to manage chats from some files */
export const chatsStore = {
    // Chat collection
    chats: [],
    // Events manager
    eventEmitter: new EventEmitter(),
    // Replace all chats
    replaceChats(newChats) {
        this.chats = newChats;
        this.eventEmitter.emit('updateChats', this.chats);
    },
    // Add a new chat message
    addMessage(newChat) {
        this.chats.push(newChat);
        this.eventEmitter.emit('updateChats', this.chats);
    },
    // Get all chats
    getMessages() {
        return this.chats;
    }
};

/** Get chats */
export const getChats = (localUser, ws) => {
    // Interval
    const send = setInterval(() => {            // <---------------------
            clearInterval(send);
            ws.send(JSON.stringify({
                type: "get-chats",
                clientID: localUser
            }));
    }, 500);
};

/** Create new chat */
export const newChat = async (localUser, otherUser) => {
    // Set WebSocket
    const { getWebSocket } = await import('./websocket');
    // get WebSocket connection
    const ws = getWebSocket();
    // Message for socket
    ws.send(JSON.stringify({
        "type": "create-chat",
        "clientID": localUser,
        "otherClientID": otherUser
    }))
}