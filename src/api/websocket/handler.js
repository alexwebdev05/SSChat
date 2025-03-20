// React libraries
import AsyncStorage from '@react-native-async-storage/async-storage';

// Api
import { messagesStore } from './messages';
import { chatsStore } from './chats';

// Function to handle different message types from WebSocket
export function handleMessageResponse(type, userID, response) {
    switch (type) {
        // When a user has joined the room
        case 'joined-room':
            console.log("🔹 Joined Room:", response);
            break;
        // When a user has left the room
        case 'left-room':
            console.log("🚪 Left Room:", response);
            break;
        // When receive chat messages
        case 'obtained-messages':
            // Replace old messages with new ones
            messagesStore.replaceMessages(userID, response);
            // Store messages locally
            const storeMessages = async (response) => {
                try {
                    // Remove old messages
                    await AsyncStorage.removeItem(userID);
                    // Save new messages
                    await AsyncStorage.setItem(userID, JSON.stringify(response));
                } catch(error) {
                    console.error('Error saving messages', error);
                }
            }
            storeMessages(response);
            break;
        // When receive a single message
        case 'received-message':
            console.log("📨 New Message:", response);
            // Store new message in warm
            messagesStore.addMessage(response.sender, response)
            break;
        // When receive user chats
        case 'obtained-chats':
            // Replace old chats with new ones in warm
            chatsStore.replaceChats(response)
            // Store new messages locally
            const storeData = async (response) => {
                try {
                    await AsyncStorage.setItem('chats', JSON.stringify(response));
                } catch(error) {
                    console.error('Error saving chats', error);
                }
            }
            storeData(response);
            break;
        // When a chat has been created
        case 'created-chat':
            // Add chat to chats array in warm
            chatsStore.addMessage(response);
            // Emit an update for chats globally
            chatsStore.eventEmitter.emit('updateChats');
            break
        // When a token has been checked
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
            break
        case 'user-joined':
            console.log(response)
            break
        default:
            console.warn("⚠️ Unknown message type received:", type);
    }
}