import { api } from '../api/connection';

export const getMessages = (sender, receiver, onMessagesUpdate) => {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(api.getMessages, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: sender, receiver: receiver }),
      });

      if (!response.ok) {
        throw new Error('Error in fetching messages');
      }

      const data = await response.json();
      onMessagesUpdate(data);
    } catch (error) {
      console.error('Error getting messages:', error);
    }
  }, 1000);

  return interval;
};