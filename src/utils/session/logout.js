// React Native libraries
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Log out user from the application
 * Clears all data from AsyncStorage to remove user session information
 * 
 * @returns {Promise<void>} Promise that resolves when logout is complete
 */
export const logOut = async () => {
    try {
        // Clear all stored data from AsyncStorage
        await AsyncStorage.clear();
        console.log('Logged out');
    } catch(error) {
        // Log any errors that occur during the logout process
        console.log('error logging out: ', error)
    }
}