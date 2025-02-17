import { api } from '../url';
import { handleMessageResponse } from './handler';

let ws = null;

// Crear y mantener la conexión WebSocket globalmente
export const socketConnection = (setIsSocketConnected, setSocket) => {
    if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
        console.log('🔄 WebSocket ya está conectado.');
        return Promise.resolve(ws);
    }

    ws = new WebSocket(api.websocket);

    ws.onopen = () => {
        console.log('✅ WebSocket connection established.');
        setIsSocketConnected(true);
        setSocket(ws);
    };

    ws.onclose = () => {
        console.log('❌ WebSocket connection closed.');
        setIsSocketConnected(false);
        setSocket(null);
        setTimeout(() => {
            if (!ws || ws.readyState === WebSocket.CLOSED) socketConnection(setIsSocketConnected, setSocket);
        }, 1000);
    };

    ws.onerror = (error) => {
        console.log('⚠️ WebSocket error:', error);

        if (ws) {
            ws.onclose = null;
            ws.close();
            ws = null;
            setSocket(null);
        }
    
        setTimeout(() => {
            console.log('🔄 Reintentando conexión WebSocket después de error...');
            socketConnection(setIsSocketConnected, setSocket);
        }, 1000);
    }

    ws.onmessage = (event) => {
        try {
            const incomingMessage = JSON.parse(event.data);
            handleMessageResponse(incomingMessage.type, incomingMessage.userID, incomingMessage.response);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    // Cleanup cuando el componente se desmonte
    return () => {
        if (ws) {
            console.log("🔌 Cleaning up WebSocket connection...");
            ws.onclose = null;
            ws.close();
            ws = null;
            setSocket(null);
        }
    };
};

// Función para acceder al WebSocket global
export const getWebSocket = () => ws;