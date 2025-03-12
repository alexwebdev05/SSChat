// React libraries
import UUID from 'react-native-uuid';
import { EventEmitter } from 'fbemitter';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Hot Message Store */
export const messagesStore = {

    // Message collection
    messages: {},

    // Events manager
    eventEmitter: new EventEmitter(),

    // Replace by new messages
    replaceMessages(clientUUID, newMessages) {
        // Replace
        this.messages[clientUUID] = newMessages;
        // Notify the update to other files
        this.eventEmitter.emit('updateMessages', this.messages);
    },

    // Add new message
    addMessage(clientUUID, newMessage) {
        // If the off messages array does not exist, a new one is created
        if (!this.messages[clientUUID]) {
            this.messages[clientUUID] = [];
        }
        // Add new message to array
        this.messages[clientUUID].push(newMessage);
        // Notify the update to other files
        this.eventEmitter.emit('updateMessages', this.messages);
    },

    // Get user messages
    getMessages(clientUUID) {
        return this.messages[clientUUID] || [];
    },
};

/** Get messages */
export const getMessages = async (localUser, receiver) => {
    // Get actual socket connection
    const { getWebSocket } = await import('./websocket');
    // Message to websocket
    const send = setInterval(() => {             // <--------------------
        clearInterval(send);
        const ws = getWebSocket()
        ws.send(JSON.stringify({
            type: "get-messages",
            clientID: localUser,
            otherClientID: receiver
        }));
    }, 500);
};

/** Send messages */
export const sendMessage = async (sender, receiver, roomToken, message) => {
    // Get actual socket connection
    const { getWebSocket } = await import('./websocket');
    // UUID maker
    const messageId = UUID.v4();
    // Message JSON
    const newMessage = {
        id: messageId,
        sender: sender,
        receiver: receiver,
        message: message,
        created_at: new Date()
    }
    // Save the message in hot
    messagesStore.addMessage(receiver, newMessage);
    // Save the message locally
    try {
        // Get saved messages
        const existingMessages = await AsyncStorage.getItem(receiver);
        // Parse messages
        const parsedMessages = existingMessages ? JSON.parse(existingMessages) : {};
        // Add new message into array
        parsedMessages.push(newMessage)
        // Save array changes locally
        await AsyncStorage.setItem(receiver, JSON.stringify(parsedMessages));
    } catch (error) {
        console.error('Error saving messages to AsyncStorage', error);
    }
    // Getting websocket
    const ws = getWebSocket();     // <-------------------
    // JSON message for websocket
    ws.send(JSON.stringify({
        type: "send-message",
        clientID: sender,
        otherClientID: receiver,
        roomToken: roomToken,
        message: message,
        id: messageId
    }));
};
