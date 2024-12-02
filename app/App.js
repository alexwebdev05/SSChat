import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Pages
import Login from './src/screens/login';
import Main from './src/screens/main';
import Chat from './src/screens/chat';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Función para verificar el estado de inicio de sesión
  const checkLoginStatus = async () => {
    try {
      const loggedStatus = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedStatus === 'true'); // Si es "true", establece `true`, si no, `false`.
    } catch (error) {
      console.log("Error checking login status: ", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Error saving login state: ", error);
    }
  };

  // Mientras se verifica el estado de inicio de sesión
  if (isLoggedIn === null) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false, // Oculta el header para todas las pantallas
      }}
      >
        {isLoggedIn ? (
          <>
            {/* Si está logueado, muestra Main y Chat */}
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          <>
            {/* Si no está logueado, muestra Login */}
            <Stack.Screen name="Login">
              {() => <Login onLogin={handleLogin} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
