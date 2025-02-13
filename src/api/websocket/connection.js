import { api } from '../connection';

let ws = null;

// Create connection
export const socketConnection = (setIsSocketConnected) => {

    if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
        console.log('🔄 WebSocket ya está conectado.');
        
        return;
    }

    ws = new WebSocket(api.websocket);

    ws.onopen = () => {

        console.log('✅ WebSocket connection established.');
        setIsSocketConnected(true);
    };

    ws.onclose = () => {
        console.log('❌ WebSocket connection closed.');
        setIsSocketConnected(false);
        ws = null;
        setTimeout(() => {
            if (!ws) socketConnection(setIsSocketConnected);
        }, 1000);
    };

    ws.onerror = (error) => console.error('⚠️ WebSocket error:', error);
    
    // Message handler
    ws.onmessage = (event) => {
        try {

            // Parse message
            const incomingMessage = JSON.parse(event.data);

            // Manage message
            const { type, response } = incomingMessage;
    
            // Handle message response
            handleMessageResponse(type, response);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    // Cleanup WebSocket connection on unmount
    return () => {
        if (ws) {

            // Prevent automatic reconnections
            ws.onclose = null;

            // Close WebSocket connection
            ws.close();
            ws = null;
        }
    };
}

    

    

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
        case 'get-chats':
            console.log("🔹 Chats:");
            break;
        default:
            console.warn("⚠️ Unknown message type received:", type);
    }
}