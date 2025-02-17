import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWebSocket } from "./websocket";

// Get messages
export const getMessages = async (localUser, receiver) => {
    const send = setInterval(() => {
        clearInterval(send);
        const ws = getWebSocket()
        ws.send(JSON.stringify({
            type: "get-messages",
            clientID: localUser,
            otherClientID: receiver
        }));
}, 500);
};

// Send messages
export const sendMessage = async (sender, receiver, roomToken, message) => {

    // Getting websocket
    const ws = getWebSocket()
    console.log('enviando mensaje')
    // Sending data
    ws.send(JSON.stringify({
        type: "send-message",
        clientID: sender,
        otherClientID: receiver,
        roomToken: roomToken,
        message: message
    }));

    // Pushing message locally
    // try {
    //     // Get stored messages
    //     const storedMessages = await AsyncStorage.getItem(receiver)

    //     // If the array of messages does not exist, it makes a new one
    //     let messages = storedMessages ? JSON.parse(storedMessages) : [];

    //     // Add new message
    //     messages.push({
    //         sender: sender,
    //         receiver: receiver,
    //         message: message,
    //         created_at: new Date()
    //     });

    //     // Replace old messages with new messages
    //     await AsyncStorage.setItem(receiver, JSON.stringify(messages));
        

    // } catch(error) {
    //     console.log('Error pushing message.')
    // }
};