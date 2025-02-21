// react libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shadow } from 'react-native-shadow-2';

// Api
import { api } from '../../api/url';
import { chatsStore, newChat } from '../../api/websocket/chats';

// Assets
import plus from '../../../assets/phoneIcons/addChat.png'

export const ChatMaker = () => {

    const [username, setUsername] = useState('');
    const [isNewChatVisible, setIsNewChatVisible] = useState(false);
    const [localUser, setLocalUser] = useState('');
    
    // ----- UseEffect -----

    // Fetch local user data from AsyncStorage
    useEffect(() => {

        const localUser = async () => {
            const userData = await AsyncStorage.getItem('userData');
            const parsedData = JSON.parse(userData)
            setLocalUser(parsedData.token);
        };
    
        localUser();
        
    }, []);
    
    // ----- Functions -----

    // Show chat maker
    const plusHandle = async () => {
        setIsNewChatVisible(true);
    }

    // Make chat maker invisible
    const returnHandler = async () => {
        setIsNewChatVisible(false);
    }

    // Chat maker function
    const newUser = () => {
        
        // Create new chat
        newChat(localUser, username)
        
        // Make chat maker invisible
        setIsNewChatVisible(false);
      }

    // ----- DOM -----
    return(
        <View style={style.container}>

            {/* Button to make chat maker visible */}
            <TouchableOpacity onPress={plusHandle} style={style.plusContainer}>
                <Image source={plus} style={style.plusIcon}></Image>
            </TouchableOpacity>

            {/* Chat maker */}
            {isNewChatVisible && (
                <View style={style.makerContainer}>
                    {/* Returner */}
                    <TouchableOpacity onPress={returnHandler} style={style.returnHandler} />

                        <View  style={style.newChatContainer}>
                            <Shadow
                            startColor={generalColors.start}
                            endColor={generalColors.finish}
                            distance={30}
                            >
                                {/* Input */}
                                <View style={style.inputEnter}>
                                    <TextInput
                                    placeholder="recipient username"
                                    placeholderTextColor="gray"

                                    // Set input name
                                    onChangeText={setUsername}
                                    style={style.newChatInput}
                                    ></TextInput>

                                    {/* Button to finish */}
                                    <TouchableOpacity onPress={newUser} onChangeText={setUsername} style={style.newChatButton}>
                                        <Text style={style.newChatButtonText}>Start</Text>
                                    </TouchableOpacity>
                                </View>
                            </Shadow>
                        </View>
                </View>
            )}
        </View>
    )
}

// ----- Style -----
const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    // Plus button
    plusContainer: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#5eb1ff'
    },
    plusIcon: {
        width: 40,
        height: 40,
    },

    // New chat
    makerContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },

    newChatContainer: {
        position: 'absolute',
        bottom: 50,
        left: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'

    },
    newChatInput: {
        height: 50,
        width: 180,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: 'white'
    },
    newChatButton: {
        height: 50,
        width: 50,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5eb1ff'
    },
    newChatButtonText: {
        fontWeight: 'bold',
        color: 'white'
    },
    inputEnter: {
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    returnHandler: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1
    },
    shadow: {
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
    }
})