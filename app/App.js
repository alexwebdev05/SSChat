// react libraries
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Pages
import Login from './src/screens/login';
import Register from './src/screens/register';
import Main from './src/screens/main';
import Chat from './src/screens/chat';

// Navigation
const Stack = createStackNavigator();

// Utils
import { handleLogin } from './src/utils/session/handleLogin';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // ----- Functions -----

    // Check login status
    const checkLoginStatus = async () => {
        try {
            const loggedStatus = await AsyncStorage.getItem('isLoggedIn');
            setIsLoggedIn(loggedStatus === 'true');

        // Catch errors
        } catch (error) {
            console.log("Error checking login status: ", error);
        }
    };

    // ----- DOM -----
    return (

        // Navigation screens
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                headerShown: false,
                }}
            >
            {isLoggedIn ? (
                <>
                    {/* If is logged in, show Main and Chat */}
                    <Stack.Screen name="Main" component={Main} />
                    <Stack.Screen name="Chat" component={Chat} />
                </>
            ) : (
                <>
                    {/* If isn't logged ind, show Login */}
                    <Stack.Screen name="Login">
                        {() => <Login onLogin={() => handleLogin(setIsLoggedIn)} />}
                    </Stack.Screen>
                    <Stack.Screen name="Register">
                        {props => <Register {...props} onLogin={() => handleLogin(setIsLoggedIn)} />}
                    </Stack.Screen>
                </>
            )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}