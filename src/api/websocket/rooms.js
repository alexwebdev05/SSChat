/** Enter the room */
export const enterRoom = async ( localUser, roomToken) => {
    // Get actual socket connection
    const { getWebSocket } = await import('./websocket');
    const send = setInterval(() => {
        clearInterval(send);
        const ws = getWebSocket()
        ws.send(JSON.stringify({
            type: "join-room",
            roomToken: roomToken,
            clientID: localUser
        }));
    }, 500);
};

/** Leave the room */
export const leaveRoom = async (localUser, roomToken) => {
    // Get actual socket connection
    const { getWebSocket } = await import('./websocket');
    const send = setInterval(() => {
        clearInterval(send);
        const ws = getWebSocket()
        ws.send(JSON.stringify({
            type: "leave-room",
            roomToken: roomToken,
            clientID: localUser
        }));
    }, 500);
};
