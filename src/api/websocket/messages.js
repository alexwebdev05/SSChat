// Send messages
export const sendMessage = (ws, sender, receiver, roomToken, message) => {
    verifieConnection();
    ws.send(JSON.stringify({
       type: "send-room-message",
        clientID: sender,
       otherClientID: receiver,
        roomToken: roomToken,
        message: message
    }));
};