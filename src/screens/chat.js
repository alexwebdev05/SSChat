// React libraries
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, AppState } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// Theme
import generalColors from '../styles/generalColors';
import { StatusBar } from 'expo-status-bar';
import { messagesStore } from '../api/websocket/messages';

// Api
import { getWebSocket } from '../api/websocket/websocket';
import { enterRoom, leaveRoom } from '../api/websocket/rooms';
import { sendMessage, getMessages } from '../api/websocket/messages';

// Utils
import { dateFormatter } from '../utils/dateFormatter';

export default function Chat({ route }) {
    // ----- States -----

    // Local user data
    const [localUser, setLocalUser] = useState('');

    // Chat messages
    const [messages, setMessages] = useState([]);

    // New messages
    const [promisedMessage, setPromisedMessage] = useState('');

    // Scroll view reference
    const scrollViewRef = useRef(null);

    // To detect when user navigates to other screen
    const nav = useNavigation();

    // To detect when user is watching the component
    const isFocused = useIsFocused();

    // Other user token and name | Room token
    const { otherUsername, otherUserToken, roomToken} = route.params;

    const [socket, setSocket] = useState(null);

    // ----- Effects -----

    // Get local user data | Socket connection
    useEffect(() => {

        // Get local user
        const getLocalUser = async () => {
            const localData = await AsyncStorage.getItem('userData');
            const userData = JSON.parse(localData);
            setLocalUser(userData.token);
        };
        getLocalUser();

    }, []);

    // Get socket
    useEffect(() => {
        const wsUpdater = () => {
            const ws = getWebSocket()
            setSocket(ws)
        }
        
        const interval = setInterval(wsUpdater, 500);

        return () => clearInterval(interval);
    }, [])

    // Enter room
    useEffect(() => {
        // Checks if the user is loaded and socket is connected
        if (!socket || !localUser || !isFocused) return;

        // Enter room
        enterRoom( localUser, roomToken);
    }, [socket, localUser, isFocused]);

    // Request messages
    useEffect(() => {
        // Checks if the user is loaded and socket is connected
        if (!socket || !localUser) return;

        // Fetch messages once or on socket change
        const fetchMessages = async () => {
            getMessages(localUser, otherUserToken);
        };

        // Fetch messages when component mounts
        fetchMessages();

        // Cleanup if needed (optional, depending on how `getMessages` works)
        return () => {};
    }, [socket, localUser, otherUserToken]);

    // Set local messages before receive new messages
    useEffect(() => {

        const localMessages = async () => {
            const messages = await AsyncStorage.getItem(otherUserToken)
            setMessages(JSON.parse(messages))
        }
        localMessages()
        
    }, [])

    // Refresh messages
    useEffect(() => {
        const handleMessagesUpdate = () => {
            // Actualiza el estado con los nuevos mensajes
            setMessages(messagesStore.getMessages(otherUserToken));
        };
    
        // Escuchar cambios de mensajes en messagesStore con addListener (FBEmitter)
        const listener = messagesStore.eventEmitter.addListener('updateMessages', handleMessagesUpdate);
    
        // Cleanup cuando el componente se desmonte
        return () => {
            listener.remove(); // Usamos 'remove' en lugar de 'removeListener'
        };
    }, []);

    // Log messages
    // useEffect(() => {
    //     // Establece un intervalo que haga un console.log cada segundo
    //     const interval = setInterval(() => {
    //       console.log('Messages:', messagesStore.messages);  // Muestra los mensajes almacenados
    //     }, 1000); // Ejecuta cada 1000 ms (1 segundo)
    
    //     // Limpia el intervalo cuando el componente se desmonte
    //     return () => clearInterval(interval);
    
    //   }, []);


    // Move to bottom of the chat
    useEffect(() => {
        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100); // Pequeño delay para asegurar que el scroll funcione bien
        }
    }, [messages]);

    // Cleanup before navigating away
    useEffect(() => {
        const unsubscribe = nav.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Leave chat room
            leaveRoom(localUser, roomToken);


            setMessages([])

            // Navigate away
            nav.dispatch(e.data.action);
        });

        return unsubscribe;
    }, [nav, localUser, roomToken]);

    // ----- Functions -----

    // Send message
    const send = async (promisedMessage) => {
        sendMessage(localUser, otherUserToken, roomToken, promisedMessage);
        setPromisedMessage('');
    };

    // ----- DOM -----
    return (
        <View style={style.screen}>

            {/* Transparent StatusBar */}
            <StatusBar style="light" />
            
            {/* Header */}
            <Shadow
                startColor={generalColors.start}
                endColor={generalColors.finish}
                distance={30}
            >
                <View style={style.header}>

                    {/* Image */}
                    <Image source={require('../assets/icons/profile.png')} style={style.profile} />

                    {/* Username */}
                    <Text style={style.username}>{otherUsername}</Text>

                </View>
                
            </Shadow>

            {/* Messages */}
            <ScrollView
                style={style.messageContainer}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
            >
                {(messages === null || messages.length === 0) ? (
                    // Mensaje en caso de que no haya mensajes aún
                    <Text></Text>
                ) : (
                    messages.map((message, index) => {
                        const currentDate = new Date(message.created_at).toDateString();
                        const previousDate = index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;

                        return (
                            <View key={message.id}>
                                {/* Mostrar la fecha si es diferente a la del mensaje anterior */}
                                {currentDate !== previousDate && (
                                    <Text style={style.dateSeparator}>{currentDate}</Text>
                                )}

                                {message.sender === otherUserToken ? (
                                    <View style={style.message}>
                                        <Text style={style.messageText}>{message.message}</Text>
                                        <Text style={style.messageDate}>{dateFormatter(message.created_at)}</Text>
                                    </View>
                                ) : (
                                    <View style={style.userHost}>
                                        <View style={style.messageHost}>
                                            <Text style={style.messageText}>{message.message}</Text>
                                            <Text style={style.messageDate}>{dateFormatter(message.created_at)}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    }))}
            </ScrollView>

            {/* Message sender */}
            
                <View style={style.messageCreator}>

                    {/* Message setter */}
                    <TextInput 
                    placeholder='Message'
                    placeholderTextColor="#afb5b8"

                    // Set message on real time
                    onChangeText={setPromisedMessage}
                    value={promisedMessage}
                    style={style.messageInput}
                    />

                    {promisedMessage !== '' ? (
                        
                        // --- Send button ---
                        <TouchableOpacity

                        // Call send function
                        onPress={() => send(promisedMessage)}

                        // Reset message
                        onFocus={() => setPromisedMessage('')}
                        style={style.sendButton}
                        >
                            <Image source={require('../assets/icons/send.png')} style={style.send} />
                        </TouchableOpacity>
                    ) : (

                        // --- Audio button ---
                        <TouchableOpacity

                        // Call send function
                        onPress={() => send(promisedMessage)}

                        // Reset message
                        onFocus={() => setPromisedMessage('')}
                        style={style.sendButton}
                        >
                            <Image source={require('../assets/icons/mic.png')} style={style.mic} />
                        </TouchableOpacity>
                    )}
                </View>
            
            

        </View>
    )

}

// ----- Styles -----
const { width } = Dimensions.get('window');

const style = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        backgroundColor: generalColors.back
    },

    // Header
    header: {
        width: width,
        paddingTop: 35,
        paddingLeft: 25,
        height: 105,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: generalColors.header,
        borderRadius: 20
    },

    profile: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#1B4E6B'

    },

    username: {
        fontSize: 20,
        fontWeight: 600,
        color: 'white'
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
        paddingVertical: 6,
        paddingHorizontal: 13,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 13,
        backgroundColor: generalColors.guestMessage
    },

    messageHost: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 13,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 13,
        backgroundColor: generalColors.main
    },

    messageText: {
        fontSize: 16,
        fontWeight: 500,
        color: 'white'
    },

    messageDate: {
        fontSize: 10,
        fontWeight: 500,
        marginLeft: 10,
        color: 'white'
    },

    // Bottom Options
    messageCreator: {
        width: width - 35,
        height: 45,
        flexDirection: 'row',
        marginVertical: 10,
        marginLeft: 19,
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: generalColors.messageMaker
        
    },
    messageInput: {
        flex: 1,
        marginLeft: 15,
        fontWeight: 800,
        fontSize: 16,
        color: 'white'
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
    },

    dateSeparator: {
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: generalColors.date,
    },

    // Icons
    send: {
        width: 25,
        height: 25,
        marginRight: 2,
        marginTop: 1
    },

    mic: {
        width: 20,
        height: 20,
        marginRight: 1
    }
    
})