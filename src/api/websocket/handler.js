import AsyncStorage from '@react-native-async-storage/async-storage';
import { messagesStore } from './messages';
import { chatsStore } from './chats';

// Function to handle different message types
export function handleMessageResponse(type, userID, response) {

    switch (type) {
        case 'joined-room':
            console.log("🔹 Joined Room:", response);
            break;
        case 'left-room':
            console.log("🚪 Left Room:", response);
            break;
        case 'obtained-messages':
            messagesStore.replaceMessages(userID, response);
            const storeMessages = async (response) => {
                try {
                    await AsyncStorage.removeItem(userID);
                    await AsyncStorage.setItem(userID, JSON.stringify(response));
                    console.log('New messages updated');
                } catch(error) {
                    console.error('Error saving messages', error);
                }
            }
            storeMessages(response);
            break;
        case 'received-message':
            console.log("📨 New Message:", response);
            messagesStore.addMessage(response.sender, response)
            break;
        case 'obtained-chats':
            chatsStore.replaceChats(response)
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
        case 'created-chat':
            console.log("🔹 Created chat:", response);

            // Añadir el chat a chatsStore
            chatsStore.addMessage(response);

            chatsStore.eventEmitter.emit('updateChats');

            break
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
        default:
            console.warn("⚠️ Unknown message type received:", type);
    }
}