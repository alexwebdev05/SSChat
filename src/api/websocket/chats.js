// Get chats
export const getChats = (localUser, ws) => {
    const send = setInterval(() => {
            clearInterval(send);
            ws.send(JSON.stringify({
                type: "get-chats",
                clientID: localUser
            }));
    }, 500);
};