// React libraries
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Api
import { register } from '../utils/api/register';

// Assets
import logo from '../../assets/logo.webp';

// Theme
import generalColors from '../styles/generalColors'

export default function Register({ onLogin }) {
    const [username, setUsernamel] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    // Functions
    const handleNavigation = () => {
        navigation.navigate('Login');
    }


    return(
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
                            onChangeText={setUsernamel}
                        />
                    </View>
    
                    {/* Email */}
                    <View style={style.blocks}>
                        <Text style={style.blockTitle}>Email adress</Text>
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
    
                    {/* Sign and register buttons */}
                    <View style={style.loginRegister}>
                        <TouchableOpacity style={style.registerContainer}>
                            <Text style={style.register} onPress={handleNavigation}>Log in</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => register(username, email, password, onLogin)} style={style.signInContainer}>
                            <Text style={style.signIn}>Register</Text>
                        </TouchableOpacity>
                    </View>
    
    
                </View>
    
            </View>
        )
}

const style = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    logo: {
        width: 100,
        height: 100,
        marginBottom: 10
    },

    title: {
        fontSize: 30,
        fontWeight: 800,
        marginBottom: 50
    },

    blocksContainer: {
        width: '65%'
    },

    blocks: {
        marginBottom: 20
    },

    blockTitle: {
        fontSize: 18,
        marginBottom: 5
    },

    input: {
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: generalColors.input,
        paddingLeft: 20
    },

    loginRegister: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: '100%',
        marginTop: 10,
    },

    signInContainer: {
        flex: 0.5,
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#c0c0c0'
    },

    signIn: {
        textAlign: 'center',
        fontSize: 16
    },

    registerContainer: {
        flex: 1,
        justifyContent: 'center'
    },

    register: {
        fontSize: 16,
        borderRadius: 5,
        color: 'blue',
        textDecorationLine: 'underline'
    }
})