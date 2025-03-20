// API
import { api } from './url';

// Utils
import { storeUserData } from '../utils/storeData';

/** Sign in function */
export const signIn = async (email, password, onLogin) => {
    // JSON message
    const jsonData = {
        "email": email,
        "password": password,
    };
    // Send message to api
    try {
        console.log(api.checkUsers)
        const response = await fetch(api.checkUsers, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });
        // Send message
        const data = await response.json();
        // Bad response
        if (!response.ok) {
            throw data;
        }
        // Make an array with user data
        const storeData = {
            "username": data.username,
            "email": email,
            "photo": data.photo,
            "token": data.token
        }
        // Store data locally
        storeUserData(storeData);
        // login function
        onLogin();
    // Catch errors
    } catch (error) {
        console.error('Error during login:', error);
        return { status: 'error', message: error.message };
    }
}