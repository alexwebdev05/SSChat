// Get chats
export const getChats = (user) => {
    verifieConnection();
    ws.send(JSON.stringify({
        type: "get-chats",
        clientID: user
    }));
};