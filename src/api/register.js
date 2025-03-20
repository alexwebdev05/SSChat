// API
import { api } from './url';

// Utils
import { storeUserData } from '../utils/storeData';

/** Register */
export const register = async (username, email, password, onLogin) => {
    // JSON message
    const jsonData = {
        "username": username,
        "email": email,
        "password": password,
    };
    // Send data to api
    try {
        const response = await fetch(api.registerUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });
        // Parse response to JSON
        const data = await response.json();
        // If the response is an error, return
        if (!response.ok) {
            return data;
        }
        // Successful registration
        console.log('Registration successful', data);
        
        const storeData = {
            "username": username,
            "email": email
        };
        // Store data locally
        await storeUserData(storeData);
        // Login
        onLogin();
        // Return the server's success JSON response
        return data;
    } catch (error) {
        console.error('Error during registration:', error);
        // Handle network or parsing errors
        return { 
            status: 'error', 
            message: error.message || 'Unknown error' 
        };
    }
};