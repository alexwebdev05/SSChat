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

/**
 * Register Component - Handles user registration
 * @param {Object} onLogin - Callback function to execute after successful registration
 * @returns {JSX.Element} Register screen component
 */
export default function Register({ onLogin }) {
    // ----- States -------------------------------------------------------------------------
    
    /** Username input */
    const [username, setUsername] = useState('');
    
    /** Email input */
    const [email, setEmail] = useState('');
    
    /** Password input */
    const [password, setPassword] = useState('');
    
    /** Confirm password input */
    const [confirmPassword, setConfirmPassword] = useState('');
    
    /** Error message to display */
    const [errorMessage, setErrorMessage] = useState('');

    // ----- Variables ----------------------------------------------------------------------
    
    /** Navigation hook for screen transitions */
    const navigation = useNavigation();

    // ----- Functions ----------------------------------------------------------------------
    
    /**
     * Navigate to Login screen
     */
    const handleNavigation = () => {
        navigation.navigate('Login');
    };

    /**
     * Handle registration process
     * Validates inputs and attempts to register user
     */
    const handleRegister = async () => {
        // Clear previous error message
        setErrorMessage('');

        // Validate password match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        // Attempt registration
        try {
            // Call API to register user
            const result = await register(username, email, password, onLogin);
            console.log(result);
            // If there's an error, display it
            if (result.status === 'error') {
                setErrorMessage(result.message);
            }
        } catch (error) {
            // Display unexpected errors
            setErrorMessage(error.message || 'An unexpected error occurred.');
        }
    };

    // ----- DOM ----------------------------------------------------------------------------
    return (
        <View style={style.screen}>
            {/* Logo */}
            <Image source={logo} style={style.logo} />

            {/* Title */}
            <Text style={style.title}>Register in SSChat</Text>

            {/* Input fields container */}
            <View style={style.blocksContainer}>
                {/* Username input */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Username</Text>
                    <TextInput
                        style={style.input}
                        placeholder="Set username"
                        placeholderTextColor={generalColors.input}
                        onChangeText={setUsername}
                    />
                </View>

                {/* Email input */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Email address</Text>
                    <TextInput
                        style={style.input}
                        placeholder="example@example.com"
                        placeholderTextColor={generalColors.input}
                        onChangeText={setEmail}
                    />
                </View>

                {/* Password input */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Password</Text>
                    <TextInput
                        style={style.input}
                        placeholder="••••••••••"
                        placeholderTextColor={generalColors.input}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                    />
                </View>

                {/* Confirm password input */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Confirm Password</Text>
                    <TextInput
                        style={style.input}
                        placeholder="••••••••••"
                        placeholderTextColor={generalColors.input}
                        secureTextEntry={true}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                {/* Error message display */}
                {errorMessage ? (
                    <Text style={style.error}>{errorMessage}</Text>
                ) : null}

                {/* Action buttons */}
                <View style={style.loginRegister}>
                    {/* Login button */}
                    <TouchableOpacity style={style.registerContainer}>
                        <Text style={style.register} onPress={handleNavigation}>Log in</Text>
                    </TouchableOpacity>
                    
                    {/* Register button */}
                    <TouchableOpacity onPress={handleRegister} style={style.signInContainer}>
                        <Text style={style.signIn}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// ----- Styles -----------------------------------------------------------------------------
const style = StyleSheet.create({
    // Main container
    screen: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: generalColors.back
    },

    // Logo styling
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },

    // Title text
    title: {
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 50,
        color: generalColors.color1
    },

    // Container for input fields
    blocksContainer: {
        width: '65%',
    },

    // Individual input block
    blocks: {
        marginBottom: 20,
    },

    // Input field label
    blockTitle: {
        fontSize: 18,
        color: generalColors.color1,
        marginBottom: 5,
        marginLeft: 15,
    },

    // Text input styling
    input: {
        height: 40,
        borderRadius: 20,
        fontSize: 17,
        borderWidth: 3,
        borderColor: generalColors.main,
        paddingLeft: 20,
        color: generalColors.color1
    },

    // Button container
    loginRegister: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        maxWidth: '100%',
        marginTop: 10,
    },

    // Register button container
    signInContainer: {
        flex: 0.5,
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: generalColors.palette1,
    },

    // Register button text
    signIn: {
        textAlign: 'center',
        fontSize: 16,
        color: generalColors.color1
    },

    // Login button container
    registerContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    // Login button text
    register: {
        fontSize: 16,
        borderRadius: 5,
        color: generalColors.link1,
        textDecorationLine: 'underline',
    },

    // Error message styling
    error: {
        color: 'red',
        marginTop: 10
    },
});