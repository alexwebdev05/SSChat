import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to handle different message types
export function handleMessageResponse(type, response) {
    switch (type) {
        case 'joined-room':
            console.log("🔹 Joined Room:", response);
            break;
        case 'left-room':
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