// Enter the room
export const enterRoom = (ws, localUser, roomToken) => {
    const send = setInterval(() => {
        clearInterval(send);
        ws.send(JSON.stringify({
            type: "join-room",
            roomToken: roomToken,
            clientID: localUser
        }));
    }, 500);
};

// Leave the room
export const leaveRoom = (ws, localUser, roomToken) => {
    const send = setInterval(() => {
        clearInterval(send);
        ws.send(JSON.stringify({
            type: "leave-room",
            roomToken: roomToken,
            clientID: localUser
        }));
    }, 500);
};
