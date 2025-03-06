import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar  } from 'expo-status-bar';

// Functions
import { signIn } from '../api/login';

// Assets
import logo from '../assets/logo.webp';

// Theme
import generalColors from '../styles/generalColors';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    const handleSignIn = async () => {
        try {
            setErrorMessage(''); // Limpiar error previo
            const result = await signIn(email, password, onLogin);
            // Si hay un error, lo mostramos
            if (result.status === 'error') {
                setErrorMessage(result.message); // Mostrar el mensaje de error
            }
        } catch (error) {
            setErrorMessage(error.message || 'Error inesperado'); // Mostrar el error
        }
    };

    // Functions
    const handleNavigation = () => {
        navigation.navigate('Register');
    }

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
        marginBottom: 10
    },

    title: {
        fontSize: 30,
        fontWeight: 800,
        marginBottom: 50,
        color: generalColors.color1
    },

    blocksContainer: {
        width: '65%'
    },

    blocks: {
        marginBottom: 20
    },

    blockTitle: {
        fontSize: 18,
        marginBottom: 5,
        marginLeft: 15,
        color: generalColors.color1
    },

    input: {
        height: 40,
        borderRadius: 20,
        fontSize: 17,
        borderWidth: 4,
        borderColor: generalColors.palette1,
        paddingLeft: 20,
                color: generalColors.color1
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
        backgroundColor: generalColors.palette1
    },

    signIn: {
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 16,
        color: generalColors.color1
    },

    registerContainer: {
        flex: 1,
        justifyContent: 'center'
    },

    register: {
        fontSize: 16,
        borderRadius: 5,
        color: generalColors.link1,
        textDecorationLine: 'underline'
    },

    error: {
        color: 'red',
        marginTop: -15
    }
})