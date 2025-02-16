import AsyncStorage from '@react-native-async-storage/async-storage';

// Save user data
export const storeUserData = async (userData) => {
    try {
        // Saveing data
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        // catch errors
    } catch (error) {
        console.error('Error saving user data', error);
    }
};

// Get user data
export const getUserData = async () => {
    const localUserData = await AsyncStorage.getItem('userData');
    if (localUserData) {
        const userData = JSON.parse(localUserData);
        return userData
    }
};

// Check login status
export const checkLoginStatus = async (setIsLoggedIn) => {
    try {
        const loggedStatus = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedStatus === 'true');

    // Catch errors
    } catch (error) {
        console.log("Error checking login status: ", error);
    }
};