import { api } from './url';

import { storeUserData } from '../utils/storeData';

export const signIn = async (email, password, onLogin) => {

    const jsonData = {
        "email": email,
        "password": password,
    };

    try {
        // Send data to api
        console.log(api.checkUsers)
        const response = await fetch(api.checkUsers, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

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
        
        // login function on /src/App.js named handleLogin
        onLogin();
        
    // Catch erros
    } catch (error) {
        console.error('Error during login:', error);
        return { status: 'error', message: error.message };
    }
}