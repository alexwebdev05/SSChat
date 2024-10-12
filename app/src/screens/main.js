import { useEffect, useState } from 'react';
import { StyleSheet, Platform, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar  } from 'expo-status-bar';

// Icons
import options from '../../assets/icons/options.png'
import plus from '../../assets/icons/plus.png'

const chatApi = 'http://192.168.1.33:3000/api/chats/newchat/'

export default function Main() {
    const [username, setUsername] = useState('');

    const [isNewChatVisible, setIsNewChatVisible] = useState(false);
    const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#5eb1ff'); // Hacer la barra de navegación transparente
      }, []);

      const showMenu = async () => {
        if (isOptionMenuVisible === true) {
            setIsOptionMenuVisible(false)
        } else {
            setIsOptionMenuVisible(true)
        }
      }

      const plusHandle = async () => {
        setIsNewChatVisible(true);
      }

      const prueba = async () => {
        const localData = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(localData)
        const user1 = userData.username
        console.log(user1)
      }
      
      const newUser = async () => {
        const localData = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(localData)
        const user1 = JSON.stringify(userData.username)

        const jsonData = {
            "user1": userData.username,
            "user2": username
        };

        try {
            const response = await fetch(chatApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

        } catch(error) {
            console.log('[ CLIENT ] Error settin new chat: ', error);
            throw error
        }
        setIsNewChatVisible(false);
      }

      const logOut = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Logged out')
            setData(null);
        } catch(error) {
            console.log('error logging out: ', error)
        }
      }

    return (
        <View style={style.container}>
            <StatusBar barStyle="auto" />
            <View style={style.topBar}></View>

            {/* Tab */}
            <View style={style.tab}>
                <Text style={style.title}>SSChat</Text>
                <View style={style.optionsContainer}>
                    <TouchableOpacity onPress={showMenu}>
                        <Image source={options} style={style.optionIcon}></Image>
                    </TouchableOpacity>
                    
                    {isOptionMenuVisible && (
                        <View style={style.optionButtons}>
                            <TouchableOpacity onPress={logOut}>
                                <Text>Log out</Text>
                            </TouchableOpacity>
                            
                        </View>
                    )}
                </View>
                
            </View>

            {/* Search and chat */}
            <View style={style.searchChatContainer}>
                {/* Search tab */}
                <View style={style.searchContainer}>
                    <Text>Search</Text>
                </View>

                {/* Chats */}
                <View style={style.chatContainer}>
                    <Text>Chats</Text>
                </View>
            </View>
            
            {/* Plus button */}
            <TouchableOpacity onPress={plusHandle} style={style.plusContainer}>
                <Image source={plus} style={style.plusIcon}></Image>
            </TouchableOpacity>

            {/* New Chat */}
            {isNewChatVisible && (
            <View style={style.newChatContainer}>
                <Text>New Chat</Text>
                <View style={style.inputEnter}>
                    <TextInput
                    placeholder="recipient username"
                    placeholderTextColor="gray"
                    onChangeText={setUsername}
                    style={style.newChatInput}
                    ></TextInput>

                    <TouchableOpacity onPress={newUser} onChangeText={setUsername} style={style.newChatButton}>
                        <Text style={style.newChatButtonText}>Start</Text>
                    </TouchableOpacity>

                </View>
            </View>
            )}

        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

        backgroundColor: '#5eb1ff'
    },
    topBar: {
        backgroundColor: 'white',
        height: 40,
        width: '100%'
    },

    // Tab
    tab: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',

        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,

        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#004584'
    },
    optionsContainer: {
        position: 'absolute',
        right: 30
    },
    optionIcon: {
        width: 20,
        height: 20,
    },
    optionButtons: {
        position: 'absolute',
        right: 0,
        top: 25,
        width: 80,
        padding: 10,
        alignItems: 'flex-end',
        backgroundColor: '#5eb1ff'
    },
    
    // Search and chat
    searchChatContainer: {
        flex: 1,
        width: '100%',
        padding: 15,
        marginBottom: 50
    },

    // Search bar
    searchContainer: {
        padding: 10,
        borderRadius: 20,

        backgroundColor: 'white',
    },

    // Chats
    chatContainer: {
        height: '100%',
        padding: 10,
        borderRadius: 20,
        marginVertical: 15,

        backgroundColor: 'white'
    },
    // Plus button
    plusContainer: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#5eb1ff'
    },
    plusIcon: {
        width: 40,
        height: 40,
    },
    // New chat
    newChatContainer: {
        display: 'auto',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(90, 177, 255, 0.5)'
    },
    newChatInput: {
        height: 50,
        marginTop: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        backgroundColor: 'white'
    },
    newChatButton: {
        marginTop: 10,
        height: 50,
        width: 50,
        borderRadius: 15,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5eb1ff'
    },
    newChatButtonText: {
        fontWeight: 'bold',
        color: 'white'
    },
    inputEnter: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})