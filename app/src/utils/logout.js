import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export const logOut = async () => {
    const [data, setData] = useState(null);

    try {
        await AsyncStorage.clear();
        console.log('Logged out')
        setData(null);
    } catch(error) {
        console.log('error logging out: ', error)
    }
  }