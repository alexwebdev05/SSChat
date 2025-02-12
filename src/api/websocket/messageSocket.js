import { api } from '../connection';

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
export const socketConnection = (setIsSocketConnected) => {

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
            setTimeout(() => socketConnection(setIsSocketConnected), 1000);
        };
        ws.onerror = (error) => console.error('WebSocket error:', error);
    }

    // Message handler
    ws.onmessage = (event) => {
        try {
            const incomingMessage = JSON.parse(event.data);
            const { type, response } = incomingMessage; // Destructuración
    
            handleMessageResponse(type, response);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    // Cleanup WebSocket connection on unmount
    return () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    };
};

// Function to handle different message types
function handleMessageResponse(type, response) {
    switch (type) {
        case 'joined-room':
            console.log("🔹 Joined Room:", response);
            break;
        case 'leave-room':
            console.log("🚪 Left Room:", response);
            break;
        case 'obtained-messages':
            console.log("📩 Obtained Messages:", response);
            break;
        case 'received-message':
            console.log("📨 New Message:", response);
            break;
        default:
            console.warn("⚠️ Unknown message type received:", type);
    }
}

// Enter the room
export const enterRoom = (sender, roomToken) => {
    verifieConnection();
    ws.send(JSON.stringify({
        type: "join-room",
        roomToken: roomToken,
        clientID: sender
    }));
};

// Leave the room
export const leaveRoom = (sender, roomToken) => {
    verifieConnection();
    ws.send(JSON.stringify({
        type: "leave-room",
        roomToken: roomToken,
        clientID: sender
    }));
};

// // Get messages
// export const getMessages = (sender, receiver) => {
//     verifieConnection();
//     ws.send(JSON.stringify({
//         type: "get-messages",
//         clientID: sender,
//         otherClientID: receiver
//     }));
// };

// // Send messages
// export const sendMessage = (sender, receiver, roomToken, message) => {
//     verifieConnection();
//     ws.send(JSON.stringify({
//         type: "send-room-message",
//         clientID: sender,
//         otherClientID: receiver,
//         roomToken: roomToken,
//         message: message
//     }));
// };

// // Close websocket
// export const closeWebSocket = () => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.close();
//     }
// }