import { api } from '../../api/connection';

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

		if ( incomingMessage.action == 'getmessages' ) {
			console.log('[ WebSocket ] ' + incomingMessage.response)
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

// Get messages
export const getMessages = (sender, receiver, setMessages) => {

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
		sender: sender,
		receiver: receiver,
		message: message
	}

	// Send message
	ws.send(JSON.stringify(sendMessage));

}