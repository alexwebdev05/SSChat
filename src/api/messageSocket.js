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

    // Create WebSocket connection
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

        // Handle join room
        if (incomingMessage.type === 'joined-room') {
            console.log('Joined room:', incomingMessage.message);

        // Handle obtained messages
        } else if (incomingMessage.type === 'obtained-messages') {
            actualChatMessages = incomingMessage.messages;
            setMessages(actualChatMessages);
            
        // Handle new message
        } else if (incomingMessage.type === 'sendmessage') {
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

// Enter the room
export const enterRoom = (sender, roomToken) => {
    verifieConnection();
    ws.send(JSON.stringify({
        type: "join-room",
        roomToken: roomToken,
        clientID: sender
    }));
};

// Get messages
export const getMessages = (sender, receiver) => {
    verifieConnection();
    ws.send(JSON.stringify({
        type: "get-messages",
        clientID: sender,
        otherClientID: receiver
    }));
};

// Send messages
export const sendMessage = (sender, receiver, message) => {

};