// React Native libraries
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Handle user login process
 * Sets login state in AsyncStorage and updates application state
 * 
 * @param {Function} setIsLoggedIn - State setter function to update login status
 * @returns {Promise<void>} Promise that resolves when login is handled
 */
export const handleLogin = async (setIsLoggedIn) => {
    try {
        // Store login state in persistent storage
        await AsyncStorage.setItem('isLoggedIn', 'true');
        // Update application state to reflect logged in status
        setIsLoggedIn(true);
    } catch (error) {
        // Log any errors that occur during the login process
        console.log("Error saving login state: ", error);
    }
};