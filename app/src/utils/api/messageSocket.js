import { api } from './connection';

let ws;
let actualChatMessages;

// Verifie connection
const verifieConnection = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket not connected. Attempting to reconnect...');
        socketConnection();
    }
};

// Create connection
export const socketConnection = (setMessages) => {
	if (!ws || ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket(api.websocket);

        ws.onopen = () => console.log('WebSocket connection established.');
        ws.onclose = () => console.log('WebSocket connection closed.');
        ws.onerror = (error) => console.error('WebSocket error:', error);
    }

	// Message handler
	ws.onmessage = (event) => {
		const incomingMessage = JSON.parse(event.data)

		if (incomingMessage.action === "join") {

			// Create or find room
			const roomName = incomingMessage.token
			if (!rooms[roomName]) {
                rooms[roomName] = [];
            }

			rooms[roomName].push(ws)
			ws.room = roomName
			console.log(`Cliente unido a la sala`)

		} else if ( incomingMessage.action == 'getmessages' ) {
			actualChatMessages = incomingMessage.response
			setMessages(actualChatMessages)
		}

		else if ( incomingMessage.action == 'sendmessage' ) {
			actualChatMessages = actualChatMessages.concat(incomingMessage.response)
			setMessages(actualChatMessages)
		}
	}

    // Cleanup WebSocket connection on unmount
    return () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    };
}

// Join room
export const joinRoom = (token) => {

	verifieConnection()

	// Set message
	const joinRoom = {
		action: 'join',
		token: token
	}

	// Send message
	ws.send(JSON.stringify(joinRoom));
}

// Get messages
export const getMessages = (sender, receiver) => {

	verifieConnection()

  	// Set message
  	const getmessages = {
		action: 'getmessages',
		sender: sender,
		receiver: receiver
  	};

	// Send message
	ws.send(JSON.stringify(getmessages));
}


// Send messages
export const sendMessage = (sender, receiver, message) => {

	verifieConnection()



	// Set message
	let sendMessage = {
		action: 'sendmessage',
		room: roomName,
		sender: sender,
		receiver: receiver,
		message: message,
		token: token
	}

	// Send message
	ws.send(JSON.stringify(sendMessage));

}