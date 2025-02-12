import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './connection';

// ----- Exported functions ----- //

// Sign in function
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

// Handle login function
export const handleLogin = async (setIsLoggedIn) => {
    try {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    } catch (error) {
        console.log("Error saving login state: ", error);
    }
};

// Log out function
export const logOut = async () => {
    try {
        await AsyncStorage.clear();
        console.log('Logged out')
    } catch(error) {
        console.log('error logging out: ', error)
    }
  }

// ----- File functions ----- //

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