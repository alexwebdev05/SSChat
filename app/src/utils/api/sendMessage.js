import { api } from '../../api/connection';

export const sendMessage = async (sender, receiver, message) => {

    try {
        const response = await fetch(api.sendMessage, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: sender, receiver: receiver, message: message }),
        });

        if (!response.ok) {
            throw new Error('Error in fetching messages');
        }
    } catch(error) {
        console.error('Error sending messages:', error);
    }

}