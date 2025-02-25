// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { chatsStore } from '../../api/websocket/chats';
import { EventEmitter } from 'fbemitter';

// API
import { api } from '../../api/url';
import { socketConnection } from '../../api/websocket/websocket';
import { getChats } from '../../api/websocket/chats';

// Theme
import generalColors from '../../styles/generalColors';

// Utils
import { dateFormatter } from '../../utils/dateFormatter';
import { messagesStore } from '../../api/websocket/messages';

export const Inbox = () => {
    // State variables to store chat data, user token, and grouped chats
    const [chatContent, setChatContent] = useState([]);
    const [localUserToken, setLocalUserToken] = useState('');
    const [groupedChats, setGroupedChats] = useState({});
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [socket, setSocket] = useState(null)
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();

    // Fetch local user data from AsyncStorage
    useEffect(() => {

        const localUser = async () => {
            const userData = await AsyncStorage.getItem('userData');
            const parsedData = JSON.parse(userData)
            setLocalUserToken(parsedData.token);
        };
    
        localUser();
        
    }, []);

    // Websocket connection
    useEffect(() => {

        // Check local user UUID
        if (!localUserToken || isSocketConnected) return;


        const cleanupWebSocket = socketConnection(setIsSocketConnected, setSocket);

        return cleanupWebSocket;

        }, [localUserToken]);

    // Set Local chats
    useEffect(() => {

        const getLocalChats = async () => {
            const chatsStr = await AsyncStorage.getItem('chats');
            const chats = chatsStr ? JSON.parse(chatsStr) : [];
            setChatContent(chats);
          };
        
          getLocalChats();
    }, [])

    // Request new chats
    useEffect(() => {
        if (localUserToken && socket && typeof socket.send === 'function' ) {
            getChats(localUserToken, socket)
        }
    }, [localUserToken, socket])

    // Update chats
    useEffect(() => {
        const handleMessageUpdate = () => {
            setChatContent([...chatsStore.getMessages()]);
        };

        const listener = chatsStore.eventEmitter.addListener('updateChats', handleMessageUpdate);
        return () => listener.remove();
    }, [])

    // Group chats by other user when chatContent changes
    useEffect(() => {
        const groupChats = () => {
          if (!chatContent || chatContent.length === 0) return;
      
          const grouped = {};
      
          for (const chat of chatContent) {
            const otherUser = chat.username;
            let lastMessageDate = dateFormatter(chat.lastMessage.created_at)

            if (!grouped[otherUser]) {
              grouped[otherUser] = {
                otherUserToken: chat.userID,
                lastMessage: chat.lastMessage,
                lastMessageDate: lastMessageDate,
                roomToken: chat.token,
                chats: [],
              };
            }
            grouped[otherUser].chats.push(chat);
          }
      
          setGroupedChats(grouped);
        };
      
        groupChats();
    }, [chatContent]);

    // Update chat las message
    useEffect(() => {
        const handleNewMessage = ({ receiver, newMessage }) => {
            setChatContent(prevChats => {
                const updatedChats = prevChats.map(chat => {
                    if (chat.userID === receiver) {
                        return {
                            ...chat,
                            lastMessage: newMessage,
                        };
                    }
                    return chat;
                });
                return [...updatedChats];
            });
        };
    
        // Suscribirse al evento
        const subscription = messagesStore.eventEmitter.addListener('newMessage', handleNewMessage);
    
        // Cleanup
        return () => {
            subscription.remove();
        };
    }, []);

    // Handle the pull-to-refresh action
    const onRefresh = async () => {
        setRefreshing(true);
        // Request new chats or refresh chat list here
        if (localUserToken && socket && typeof socket.send === 'function') {
            getChats(localUserToken, socket);
        }
        setRefreshing(false);
    };

    // Navigate to Chat screen with selected chat details
    const handleNavigation = (otherUsername, otherUserToken, roomToken) => {
        navigation.navigate('Chat', { otherUsername, otherUserToken, roomToken });
    };

    // Render the Inbox component
    return (
        <View style={style.container}>
            <ScrollView
            style={style.refreshContainer}
                contentContainerStyle={style.refreshContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3498db']}
                        progressBackgroundColor="#fff"
                    />
                }
            >
                {Object.entries(groupedChats).map(([otherUsername, data]) => (
                    <TouchableOpacity
                        onPress={() => handleNavigation(otherUsername, data.otherUserToken, data.roomToken)}
                        key={data.otherUserToken}
                        style={[
                            style.chatContainer,
                        ]}
                    >
                        {/* Image */}
                        <Image
                            source={require('../../assets/icons/profile.png')}
                            style={{ width: 60, height: 60, marginRight: 10 }}
                        />

                        {/* Last message */}
                        <View style={style.lastMessageContainer}>
                            <View>
                                <Text style={style.chatGroupHeader}>{otherUsername}</Text>
                                <Text>{data.lastMessage.message}</Text>
                            </View>
                            

                            <Text style={style.lastMessageDate}>{data.lastMessageDate}</Text>
                        </View>
                        
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
        </View>
    );
};

// Styles for the Inbox component
const style = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatGroupHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: generalColors.primary,
    },
    chatContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: generalColors.chats,

        flexDirection: 'row',
        alignItems: 'center',
    },

    // Last messages
    lastMessageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },

    lastMessageDate: {
        fontSize: 12,
        marginTop: 7
    },
    refreshContainer: {
        width: '100%',
    }
});
