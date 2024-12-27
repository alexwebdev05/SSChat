import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogin = async (setIsLoggedIn) => {
    try {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    } catch (error) {
        console.log("Error saving login state: ", error);
    }
};