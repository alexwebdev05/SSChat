import { api } from './connection';

let ws;
let actualChatMessages = [];

// Verifie connection
const verifieConnection = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket not connected. Attempting to reconnect...');
        socketConnection();
    }
};

// Create connection
export const socketConnection = (setMessages, setIsSocketConnected) => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket(api.websocket);

        ws.onopen = () => {
            console.log('WebSocket connection established.');
            setIsSocketConnected(true);
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed.');
            setIsSocketConnected(false);
            setTimeout(() => socketConnection(setMessages, setIsSocketConnected), 1000);
        };
        ws.onerror = (error) => console.error('WebSocket error:', error);
    }

    // Message handler
    ws.onmessage = (event) => {
        const incomingMessage = JSON.parse(event.data);

        if (incomingMessage.action === 'getmessages') {
            actualChatMessages = incomingMessage.response;
            setMessages(actualChatMessages);
            console.log(incomingMessage.response);

        } else if (incomingMessage.action === 'sendmessage') {
            actualChatMessages = actualChatMessages.concat(incomingMessage.response);
            setMessages(actualChatMessages);
        }
    };

    // Cleanup WebSocket connection on unmount
    return () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    };
};

// Get messages
export const getMessages = (sender, receiver) => {
    verifieConnection();

    // Set message
    const getMessagesMessage = {
        action: 'getmessages',
        sender: sender,
        receiver: receiver
    };

    // Send message
    ws.send(JSON.stringify(getMessagesMessage));
};

// Send messages
export const sendMessage = (sender, receiver, message) => {
    verifieConnection();

    // Set message
    const sendMessageMessage = {
        action: 'sendmessage',
        sender: sender,
        receiver: receiver,
        message: message
    };

    // Send message
    ws.send(JSON.stringify(sendMessageMessage));
};