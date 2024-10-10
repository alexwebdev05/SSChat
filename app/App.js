import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pages
import Login from './src/screens/login';
import Main from './src/screens/main'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const loggedStatus = await AsyncStorage.getItem('isLoggedIn');
      if (loggedStatus === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("Error checking the login status: " + error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Error saving the login state: " + error);
    }
  };

  if (isLoggedIn === null) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  } else {
    return (
      <Main />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
