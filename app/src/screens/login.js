// React libraries
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Api
import { api } from '../api/connection';

// Assets
import logo from '../../assets/logo.png';


export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ----- Functions -----

    // Check the user and login
    const handleCredentials = async () => {

        // Input data array
        const jsonData = {
            "email": email,
            "password": password,
        };

        // Check data on the database
        try {
            // Sen data to api
            const response = await fetch(api.chaeckUsers, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            // Bad response
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            // Login success
            const data = await response.json();
            console.log('Login successful', data);
            
            // Make an array with user data
            const storeData = {
                "username": data.user,
                "email": email
            }

            // Store data locally
            storeUserData(storeData);

            // login function on /src/App.js named handleLogin
            onLogin();

            // Catch erros
        } catch (error) {
            console.error('Error during the loggin:', error);
        }
    };

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

    // ----- DOM -----
    return (
        <View style={style.container}>
            <StatusBar style="auto" />

            {/* Logo */}
            <Image source={logo} style={style.logo} />

            {/* Title and subtitle */}
            <Text style={style.title}>Sign in SSChat</Text>
            <Text style={style.subtitle}>Access to your account at SSChat</Text>

            {/* Form */}
            <View style={style.inputContainer}>
                {/* Mail */}
                <Text style={style.bold}>Email address</Text>
                <TextInput
                    style={style.input}
                    placeholder="example@example.com"
                    placeholderTextColor="gray"
                    onChangeText={setEmail}
                />

                {/* Password */}
                <Text style={style.bold}>Password</Text>
                <TextInput
                    style={style.input}
                    placeholder="**********"
                    placeholderTextColor="gray"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                />

                {/* Sign button */}
                <TouchableOpacity onPress={handleCredentials}>
                    <View style={style.button}>
                        <Text style={[style.bold, style.white]}>Sign in</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ----- Styles -----
const style = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        marginTop: 100
    },
    logo: {
        width: 100,
        height: 100,
        margin: 30,
        borderRadius: 20,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    bold: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        marginBottom: 20,
    },
    inputContainer: {
        width: 350,
        marginTop: 25,
    },
    input: {
        width: '100%',
        height: 50,
        marginTop: 5,
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        fontSize: 15,
        color: 'black',
        backgroundColor: 'white',
    },
    button: {
        marginTop: 20,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#2592ff'
    },
    white: {
        color: 'white'
    }
});
