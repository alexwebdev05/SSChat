// React libraries
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar  } from 'expo-status-bar';

// Api
import { signIn } from '../api/login';

// Assets
import logo from '../../assets/icon.png';

// Theme
import generalColors from '../styles/generalColors';

// Login
export default function Login({ onLogin }) {
    // ----- States -------------------------------------------------------------------------

    /** User email input */
    const [email, setEmail] = useState('');
    /** User password input */
    const [password, setPassword] = useState('');
    /** Error message to display */
    const [errorMessage, setErrorMessage] = useState('');

    // ----- Variables ----------------------------------------------------------------------

    /** Navigation hook for screen transitions */
    const navigation = useNavigation();

    // ----- Functions ----------------------------------------------------------------------

    // Handle sign in
    const handleSignIn = async () => {
        try {
            //Clear previous error
            setErrorMessage('');
            // Call API to sign in
            const result = await signIn(email, password, onLogin);
            // If there's an error, display it
            if (result.status === 'error') {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage(error.message || 'Error');
        }
    };

    // Navigate to register screen
    const handleNavigation = () => {
        navigation.navigate('Register');
    }

    // ----- DOM ----------------------------------------------------------------------------

    return (
        <View style={style.screen}>

            {/* Transparent StatusBar */}
            <View>
                <StatusBar style='light' />
            </View>

            {/* Logo */}
            <Image source={logo} style={style.logo} />

            {/* Title */}
            <Text style={style.title}>Sign in SSChat</Text>

            {/* Inputs */}
            <View style={style.blocksContainer}>

                {/* Email */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Email address</Text>
                    <TextInput
                        style={style.input}
                        placeholder="example@example.com"
                        placeholderTextColor={generalColors.input2}
                        onChangeText={setEmail}
                    />
                </View>

                {/* Password */}
                <View style={style.blocks}>
                    <Text style={style.blockTitle}>Password</Text>
                    <TextInput
                        style={style.input}
                        placeholder="••••••••••"
                        placeholderTextColor={generalColors.input2}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                    />
                </View>

                {/* Errors */}
                {errorMessage ? (
                    <Text style={style.error}>{errorMessage}</Text>
                ) : null}

                {/* Sign and register buttons */}
                <View style={style.loginRegister}>
                    <TouchableOpacity style={style.registerContainer}>
                        <Text style={style.register} onPress={handleNavigation}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSignIn} style={style.signInContainer}>
                        <Text style={style.signIn}>Sign in</Text>
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
        marginBottom: 10
    },

    // Title text
    title: {
        fontSize: 30,
        fontWeight: 800,
        marginBottom: 50,
        color: generalColors.color1
    },

    // Container for input fields
    blocksContainer: {
        width: '65%'
    },

    // Individual input block
    blocks: {
        marginBottom: 20
    },

    // Input field label
    blockTitle: {
        fontSize: 18,
        marginBottom: 5,
        marginLeft: 15,
        color: generalColors.color1
    },

    // Text input styling
    input: {
        height: 40,
        borderRadius: 20,
        fontSize: 17,
        borderWidth: 4,
        borderColor: generalColors.palette1,
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

    // Sign in button container
    signInContainer: {
        flex: 0.5,
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: generalColors.palette1
    },

    // Sign in button text
    signIn: {
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 16,
        color: generalColors.color1
    },

    // Register button container
    registerContainer: {
        flex: 1,
        justifyContent: 'center'
    },

    // Register button text
    register: {
        fontSize: 16,
        borderRadius: 5,
        color: generalColors.link1,
        textDecorationLine: 'underline'
    },

    // Error message styling
    error: {
        color: 'red',
        marginTop: -15
    }
})