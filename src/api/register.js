import { api } from './url';

import { storeUserData } from '../utils/storeData';

export const register = async (username, email, password, onLogin) => {
    const jsonData = {
        "username": username,
        "email": email,
        "password": password,
    };

    try {
        const response = await fetch(api.registerUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        // Always parse the response as JSON
        const data = await response.json();

        // If the response is an error, return the API's JSON response
        if (!response.ok) {
            return data;
        }

        // Successful registration
        console.log('Registration successful', data);
        
        const storeData = {
            "username": username,
            "email": email
        };

        await storeUserData(storeData);
        onLogin();

        return data; // Return the server's success JSON response

    } catch (error) {
        console.error('Error during registration:', error);

        // Handle network or parsing errors
        return { 
            status: 'error', 
            message: error.message || 'Unknown error' 
        };
    }
};