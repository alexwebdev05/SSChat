// React libraries
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Api
import { register } from '../api/register';

// Assets
import logo from '../assets/logo.webp';

// Theme
import generalColors from '../styles/generalColors';

export default function Register({ onLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    // Functions
    const handleNavigation = () => {
        navigation.navigate('Login');
    };

    const handleRegister = async () => {
        setErrorMessage(''); // Limpiar el mensaje de error previo

        // Check if the passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        // Register
        try {
            const result = await register(username, email, password, onLogin);
            console.log(result);
            if (result.status === 'error') {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
        }
    };

    return (
        <View style={style.screen}>
            {/* Logo */}
            <Image source={logo} style={style.logo} />

            {/* Title */}
            <Text style={style.title}>Register in SSChat</Text>

            {/* Inputs */}
            <View style={style.blocksContainer}>
                {/* Username */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Username</Text>
                    <TextInput
                        style={style.input}
                        placeholder="Set username"
                        placeholderTextColor="gray"
                        onChangeText={setUsername}
                    />
                </View>

                {/* Email */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Email address</Text>
                    <TextInput
                        style={style.input}
                        placeholder="example@example.com"
                        placeholderTextColor="gray"
                        onChangeText={setEmail}
                    />
                </View>

                {/* Password */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Password</Text>
                    <TextInput
                        style={style.input}
                        placeholder="••••••••••"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                    />
                </View>

                {/* Confirm Password */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Confirm Password</Text>
                    <TextInput
                        style={style.input}
                        placeholder="••••••••••"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                {/* Errors */}
                {errorMessage ? (
                    <Text style={style.error}>{errorMessage}</Text>
                ) : null}

                {/* Sign and register buttons */}
                <View style={style.loginRegister}>
                    <TouchableOpacity style={style.registerContainer}>
                        <Text style={style.register} onPress={handleNavigation}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRegister} style={style.signInContainer}>
                        <Text style={style.signIn}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: generalColors.back
    },

    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 50,
        color: 'white'
    },

    blocksContainer: {
        width: '65%',
    },

    blocks: {
        marginBottom: 20,
    },

    blockTitle: {
        fontSize: 18,
        marginBottom: 5,
        color: 'white'
    },

    input: {
        height: 35,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: generalColors.input,
        paddingLeft: 20,
    },

    loginRegister: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        maxWidth: '100%',
        marginTop: 10,
    },

    signInContainer: {
        flex: 0.5,
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: generalColors.palette1,
    },

    signIn: {
        textAlign: 'center',
        fontSize: 16,
    },

    registerContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    register: {
        fontSize: 16,
        borderRadius: 5,
        color: generalColors.palette1,
        textDecorationLine: 'underline',
    },

    error: {
        color: 'red',
        marginTop: 10
    },
});