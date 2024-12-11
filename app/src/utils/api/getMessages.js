import { api } from '../../api/connection';

export const getMessages = (sender, receiver, setMessages) => {
  const ws = new WebSocket(api.websocket);

  // Handle connection open
  ws.onopen = () => {
    console.log('WebSocket connection established.');

    // Set message
    const message = {
      action: 'getmessages',
      sender: sender,
      receiver: receiver
    };

    // Send message
    ws.send(JSON.stringify(message));
  };

  // Handle incoming messages
  ws.onmessage = (event) => {
    const incomingMessage = JSON.parse(event.data);
    
    // If receive a lot of messages
    if (Array.isArray(incomingMessage)) {
      setMessages((prevMessages) => [...prevMessages, ...incomingMessage]);

    // If receive one message
    } else {
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    }
  };

  // Handle errors
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Handle connection close
  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };

  // Cleanup WebSocket connection on unmount
  return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };
};