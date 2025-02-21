import { EventEmitter } from 'fbemitter';

export const chatsStore = {
    // Chat collection (array en lugar de objeto)
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

// Get chats
export const getChats = (localUser, ws) => {
    const send = setInterval(() => {
            clearInterval(send);
            ws.send(JSON.stringify({
                type: "get-chats",
                clientID: localUser
            }));
    }, 500);
};

export const newChat = async (localuser, otherUser) => {
    const { getWebSocket } = await import('./websocket');

    const ws = getWebSocket();
    ws.send(JSON.stringify({
        "type": "create-chat",
        "clientID": localuser,
        "otherClientID": otherUser
    }))
}