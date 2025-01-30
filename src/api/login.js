import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './connection';

export const signIn = async (email, password, onLogin) => {

    const jsonData = {
        "email": email,
        "password": password,
    };

    try {
        // Send data to api
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
        
        // Login success
        console.log('Login successful', data);
                   
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