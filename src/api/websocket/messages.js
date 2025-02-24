import UUID from 'react-native-uuid';
import { EventEmitter } from 'fbemitter';  // Cambia a FBEmitter

export const messagesStore = {

    // Message collection
    messages: {},

    // Events manager
    eventEmitter: new EventEmitter(),  // Usamos FBEmitter aquí

    // Replace by new messages
    replaceMessages(clientUUID, newMessages) {
        this.messages[clientUUID] = newMessages;
        this.eventEmitter.emit('updateMessages', this.messages);
    },

    // Add new message
    addMessage(clientUUID, newMessage) {
        if (!this.messages[clientUUID]) {
            this.messages[clientUUID] = [];
        }
        this.messages[clientUUID].push(newMessage);
        this.eventEmitter.emit('updateMessages', this.messages);
    },

    // Get user messages
    getMessages(clientUUID) {
        return this.messages[clientUUID] || [];
    },
};

// Get messages
export const getMessages = async (localUser, receiver) => {
    const { getWebSocket } = await import('./websocket');
    console.log('gettin new messages')
    const send = setInterval(() => {
        clearInterval(send);
        const ws = getWebSocket()
        ws.send(JSON.stringify({
            type: "get-messages",
            clientID: localUser,
            otherClientID: receiver
        }));
    }, 500);
};

// Send messages
export const sendMessage = async (sender, receiver, roomToken, message) => {
    const { getWebSocket } = await import('./websocket');
    const messageId = UUID.v4();
    // Add message to event manager
    messagesStore.addMessage(receiver, {
        id: messageId,
        sender: sender,
        receiver: receiver,
        message: message,
        created_at: new Date()
    });

    // Getting websocket
    const ws = getWebSocket();

    ws.send(JSON.stringify({
        type: "send-message",
        clientID: sender,
        otherClientID: receiver,
        roomToken: roomToken,
        message: message,
        id: messageId
    }));
};
