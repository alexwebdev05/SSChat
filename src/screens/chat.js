// React libraries
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// Theme
import generalColors from '../styles/generalColors';
import { StatusBar } from 'expo-status-bar';

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

    // Store new messages locally
    useEffect(() => {
        // Checks if the user is loaded and socket is connected
        if (!socket || !localUser || !isFocused) return;

        // Get messages
        getMessages(localUser, otherUserToken);

    }, [socket, localUser, isFocused]);

    // Get messages
    useEffect(() => {
        // Interval to update messages
        const getStoredMessages = async () => {
            try {
                // Get stored messages
                const storedMessages = await AsyncStorage.getItem(otherUserToken);
                if (!storedMessages) return console.log('No messages found');
    
                    // Set messages
                    const messages = JSON.parse(storedMessages);
                    setMessages(messages);
                } catch(error) {
                    console.error('Error obtaining messages', error);
            }
        }
        
        const interval = setInterval(() => {
            getStoredMessages();
        }, 500);

        return () => clearInterval(interval);
    }, [otherUserToken])


    // Move to bottom of the chat
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
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
    // const send = (promisedMessage) => {
    //     sendMessage(socket, localUser, otherUserToken, roomToken, promisedMessage);
    //     setPromisedMessage('');
    // };

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
                    <Text style={style.username}>{otherUsername}</Text>

                </View>
                
            </Shadow>

            {/* Messages */}
            <ScrollView
                style={style.messageContainer}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >

                {messages.map((message) => {  
                    if (message.sender == otherUserToken) {
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

            {/* Message sender */}
            <View style={style.messageCreator}>

                {/* Message setter */}
                <TextInput 
                placeholder='Message'

                // Set message on real time
                onChangeText={setPromisedMessage}
                value={promisedMessage}
                style={style.messageInput}
                />

                {/* Send button */}
                <TouchableOpacity

                // Call send function
                onPress={() => send(promisedMessage)}

                // Reset message
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