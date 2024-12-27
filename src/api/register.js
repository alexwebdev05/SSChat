import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from './connection';

export const register = async (username, email, password, onLogin) => {
    const jsonData = {
        "username": username,
        "email": email,
        "password": password,
    };

    try {
        // Send data to api
        const response = await fetch(api.registerUser, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        // Bad response
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        // Register success
        const data = await response.json();
            console.log('Register successful', data);
                   
            // Make an array with user data
            const storeData = {
                "username": username,
                "email": email
            }
        
            // Store data locally
            storeUserData(storeData);
        
            // login function on /src/App.js named handleLogin
            onLogin();
        
        // Catch erros
        } catch(error) {
            console.error('Error during the register:', error);
    }

}


// Save data locally
const storeUserData = async (userData) => {
    try {
        // Saveing data
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data saved locally');
        // catch errors
    } catch (error) {
        console.error('Error saving user data', error);
    }
};