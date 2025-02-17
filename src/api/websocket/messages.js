import { getWebSocket } from "./websocket";

// Get messages
export const getMessages = (localUser, receiver) => {
    console.log('getting messages');
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

// Send messages repaiiiiiiir
export const sendMessage = (ws, sender, receiver, roomToken, message) => {

    ws.send(JSON.stringify({
       type: "send-room-message",
        clientID: sender,
       otherClientID: receiver,
        roomToken: roomToken,
        message: message
    }));
};