// Get chats
export const getChats = (user, ws) => {
    const send = setInterval(() => {
            clearInterval(send);
            ws.send(JSON.stringify({
                type: "get-chats",
                clientID: user
            }));
    }, 500);
};

// Get messages
export const getMessages = (ws, sender, receiver) => {
    const send = setInterval(() => {
        clearInterval(send);
        ws.send(JSON.stringify({
            type: "get-messages",
            clientID: sender,
            otherClientID: receiver
        }));
}, 500);
};