import { api } from '../url';
import AsyncStorage from '@react-native-async-storage/async-storage';

let ws = null;

// Create connection
export const socketConnection = (setIsSocketConnected, setSocket) => {

    if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
        console.log('🔄 WebSocket ya está conectado.');
        return Promise.resolve(ws);
    }

    ws = new WebSocket(api.websocket);

    ws.onopen = () => {
        console.log('✅ WebSocket connection established.');
        setIsSocketConnected(true);
        setSocket(ws)
    };

    ws.onclose = () => {
        console.log('❌ WebSocket connection closed.');
        setIsSocketConnected(false);
        setSocket(null)
        setTimeout(() => {
            if (!ws || ws.readyState === WebSocket.CLOSED) socketConnection(setIsSocketConnected, setSocket);
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
            console.log("🔌 Cleaning up WebSocket connection...");
            ws.onclose = null;
            ws.close();
            ws = null;
            setSocket(null);
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
        case 'obtained-chats':
            const storeData = async (response) => {
                try {
                    await AsyncStorage.setItem('chats', JSON.stringify(response));
                    console.log('Chats saved locally');
                } catch(error) {
                    console.error('Error saving chats', error);
                }
            }
            storeData(response);
            
            break;
        case 'checked-token':
            const { token, username} = response;
            const updateOtherUsername = async (token, username) => {
                try {
                    // Get stored chats
                    const storedChats = await AsyncStorage.getItem('chats');
                    if (!storedChats) return console.log('No chats found');

                    let chats = JSON.parse(storedChats);

                    // Replace other user ID by his name
                    chats = chats.map(chat => ({
                        ...chat,
                        user1: chat.user1 === uuid ? newName : chat.user1,
                        user2: chat.user2 === uuid ? newName : chat.user2
                    }));

                    await AsyncStorage.setItem('chats', JSON.stringify(chats));
                    console.log('Chats updated successfully:', chats);
                } catch(error) {
                    console.error('Error updating chats:', error);
                }
            }
            updateOtherUsername
        default:
            console.warn("⚠️ Unknown message type received:", type);
    }
}

// Verifie connection
const verifieConnection = () => {
    if (ws && ws.readyState === WebSocket.CLOSED && ws.readyState === WebSocket.CLOSING) {
        console.warn('WebSocket not connected. Attempting to reconnect...');
        socketConnection();
    }
};

// Check token
export const checkToken = (otherUserToken) => {
    verifieConnection();
    const data = JSON.parse(otherUserToken);
    ws.send(JSON.stringify({
        type: "check-token",
        clientID: clientID,
        otherClientID: data
    }))
    
}