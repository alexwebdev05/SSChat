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