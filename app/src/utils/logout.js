import AsyncStorage from '@react-native-async-storage/async-storage';

export const logOut = async () => {
    try {
        await AsyncStorage.clear();
        console.log('Logged out')
    } catch(error) {
        console.log('error logging out: ', error)
    }
  }