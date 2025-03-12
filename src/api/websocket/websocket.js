// Api
import { api } from '../url';
import { handleMessageResponse } from './handler';

// Predefine ws variable
let ws = null;
/** WebSocket connection logic */
export const socketConnection = (setIsSocketConnected, setSocket) => {
    // Check if the socket is just connected
    if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
        console.log('🔄 WebSocket has just connected.');
        return Promise.resolve(ws);
    }
    // New connection
    ws = new WebSocket(api.websocket);
    // Open connection
    ws.onopen = () => {
        console.log('✅ WebSocket connection established.');
        // Set connection true in useState
        setIsSocketConnected(true);
        // Save connection into useState
        setSocket(ws);
    };
    // When connection is closed
    ws.onclose = () => {
        console.log('❌ WebSocket connection closed.');
        // Set connection false in useState
        setIsSocketConnected(false);
        // Clear socket useState
        setSocket(null);
        // Try to connect again
        setTimeout(() => {
            if (!ws || ws.readyState === WebSocket.CLOSED) socketConnection(setIsSocketConnected, setSocket);
        }, 1000);
    };
    // When error
    ws.onerror = (error) => {
        console.log('⚠️ WebSocket error:', error);
        // Clear all before close socket
        if (ws) {
            ws.onclose = null;
            ws.close();
            ws = null;
            setSocket?.(null);
        }
        // Try to connect again
        setTimeout(() => {
            console.log('🔄 Retrying the websocket connection after the error...');
            socketConnection(setIsSocketConnected, setSocket);
        }, 1000);
    }
    // When receive a message
    ws.onmessage = (event) => {
        try {
            // Parse received message
            const incomingMessage = JSON.parse(event.data);
            // Send message to handler
            handleMessageResponse(incomingMessage.type, incomingMessage.userID, incomingMessage.response);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };
    // Return websocket
    return ws
};
// Export websocket globally
export const getWebSocket = () => ws;
// Close websocket
export const closeWebSocket = () => {
    // Clear all before close socket
    if (ws) {
        console.log("🔌 Closing WebSocket manually...");
        ws.onclose = null;
        ws.close();
        ws = null;
    }
};