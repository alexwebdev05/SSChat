// React libraries
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Dimensions, ScrollView  } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shadow } from 'react-native-shadow-2';

// Theme
import generalColors from '../styles/generalColors';
import { StatusBar  } from 'expo-status-bar';

// Api
import { socketConnection, joinRoom, getMessages, sendMessage } from '../utils/api/messageSocket';

// Utils
import { dateFormatter } from '../utils/dateFormatter';

export default function Chat({route}) {
    const [localUser, setLocalUser] = useState('');
    const [messages, setMessages] = useState([]);
    const [promisedMessage, setPromisedMessage] = useState('')
    const scrollViewRef = useRef(null);

    // Other user name
    const { user, token } = route.params
    
    // Get local user data
    useEffect(() => {
        const getLocalUser = async () => {
            const localData = await AsyncStorage.getItem('userData');
            const userData = JSON.parse(localData);
            setLocalUser(userData.username);
        };
        getLocalUser();

        // Socket connection
        socketConnection(setMessages)

        // Join chat room
        // joinRoom(token)
    }, []);

    

    // Get messages
    useEffect(() => {

        // Checks if the users are loaded
        if (!user || !localUser) return;

        const cleanupWebSocket = getMessages(localUser, user, setMessages);
        return cleanupWebSocket

    }, [user, localUser])

    // Send message
    const send = (promisedMessage) => {
        sendMessage(localUser, user, promisedMessage)
        setPromisedMessage('');
    }

    // Move to bottom of the chat
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // ----- DOM -----
    return (
        <View style={style.screen}>

            {/* Transparent StatusBar */}
            <StatusBar barStyle="auto" />
            
            {/* Header */}
            <Shadow
                startColor={generalColors.start}
                endColor={generalColors.finish}
                distance={30}
            >
                <View style={style.header}>

                    {/* Image */}
                    <Image source={require('app/assets/icons/profile.png')} style={{width: 45, height: 45, marginRight: 10}} />

                    {/* Username */}
                    <Text style={style.username}>{user}</Text>

                </View>
                
            </Shadow>

            {/* Messages */}
            <ScrollView
                style={style.messageContainer}
                ref={scrollViewRef} // Asignamos la referencia
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })} // Desplazar al final automáticamente
            >

                {messages.map((message) => {  
                    if (message.sender == user) {
                        return (
                            <View
                            style={style.message}
                            key={message.id}
                            >
                                <Text style={style.messageText}>{message.message}</Text>
                                <Text style={style.messageDate}>{dateFormatter(message.created_at)}</Text>
                            </View>
                        )
                    }                  
                    return (
                        <View
                        key={message.id}
                        style={style.userHost}>
                            <View style={style.messageHost}>
                                <Text style={style.messageText}>{message.message}</Text>
                                <Text style={style.messageDate}>{dateFormatter(message.created_at)}</Text>
                            </View>
                        </View>
                    )
                })}
                
            </ScrollView>

                



            {/* Message creator */}
            <View style={style.messageCreator}>

                {/* Message setter */}
                <TextInput 
                placeholder='Message'
                onChangeText={setPromisedMessage}
                value={promisedMessage}
                style={style.messageInput}
                />

                {/* Send button */}
                <TouchableOpacity
                onPress={() => send(promisedMessage)}
                onFocus={() => setPromisedMessage('')}
                style={style.sendButton}
                >
                    <Image source={require('app/assets/icons/send.png')} style={{width: 30, height: 30, marginRight: 3}} />
                </TouchableOpacity>
            </View>

        </View>
    )

}

// ----- Styles -----
const { width } = Dimensions.get('window');

const style = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%'
    },

    // Header
    header: {
        width: width,
        paddingTop: 35,
        marginLeft: 25,
        height: 105,
        flexDirection: 'row',
        alignItems: 'center'
    },

    username: {
        fontSize: 20,
        fontWeight: 600,
    },

    // Messages
    messageContainer: {
        width: '100%',
        flex: 1,
    },

    userHost: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    message: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: generalColors.guestMessage
    },

    messageHost: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: generalColors.main
    },

    messageText: {
        fontSize: 16,
        fontWeight: 500,
        color: 'white'
    },

    messageDate: {
        fontSize: 10,
        color: 'white',
        fontWeight: 500,
        marginLeft: 10
    },

    // Bottom Options
    messageCreator: {
        width: width - 20,
        height: 45,
        flexDirection: 'row',
        marginVertical: 10,
        marginLeft: 10,
        justifyContent: 'center',
        
    },
    messageInput: {
        flex: 1,
        borderRadius: 100,
        backgroundColor: generalColors.messageMaker,
        fontWeight: 800
    },
    sendButton: {
        borderRadius: 100,
        bottom: 0,
        right: 0,
        width: 45,
        height: 45,
        marginLeft: 10,
        backgroundColor: generalColors.main,
        justifyContent: 'center',
        alignItems: 'center'
    }
})