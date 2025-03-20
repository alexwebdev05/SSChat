// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { chatsStore } from '../../api/websocket/chats';

// Theme
import generalColors from '../../styles/generalColors';

// Skeletons
import Chats from '../skeletons/chats'

// Images
import profile from '../../../assets/phoneIcons/profile.png'

// API
import { socketConnection } from '../../api/websocket/websocket';
import { getChats } from '../../api/websocket/chats';

// Utils
import { dateFormatter } from '../../utils/dateFormatter';
import { messagesStore } from '../../api/websocket/messages';

/**
 * Inbox Component - Displays user's chat conversations
 * @returns {JSX.Element} Inbox screen component
 */
export const Inbox = () => {
    // ----- States -------------------------------------------------------------------------
    
    /** List of chat conversations */
    const [chatContent, setChatContent] = useState([]);
    
    /** Current user's token */
    const [localUserToken, setLocalUserToken] = useState('');
    
    /** Chats grouped by other user */
    const [groupedChats, setGroupedChats] = useState({});
    
    /** WebSocket connection status */
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    
    /** WebSocket instance */
    const [socket, setSocket] = useState(null);
    
    /** Pull-to-refresh status */
    const [refreshing, setRefreshing] = useState(false);

    // ----- Variables ----------------------------------------------------------------------
    
    /** Navigation hook for screen transitions */
    const navigation = useNavigation();

    // ----- Effects ------------------------------------------------------------------------
    
    /** 
     * Load local user data from AsyncStorage 
     */
    useEffect(() => {
        const localUser = async () => {
            const userData = await AsyncStorage.getItem('userData');
            const parsedData = JSON.parse(userData)
            setLocalUserToken(parsedData.token);
        };
    
        localUser();
        
    }, []);

    /** 
     * Establish WebSocket connection when user token is available 
     */
    useEffect(() => {
        // Check local user UUID
        if (!localUserToken || isSocketConnected) return;

        const cleanupWebSocket = socketConnection(setIsSocketConnected, setSocket);

        cleanupWebSocket;

    }, [localUserToken]);

    /** 
     * Load chats from local storage on initial render 
     */
    useEffect(() => {
        const getLocalChats = async () => {
            const chatsStr = await AsyncStorage.getItem('chats');
            const chats = chatsStr ? JSON.parse(chatsStr) : [];
            setChatContent(chats);
        };
        
        getLocalChats();
    }, [])

    /** 
     * Request new chats from server when socket is connected 
     */
    useEffect(() => {
        if (localUserToken && socket && typeof socket.send === 'function' ) {
            getChats(localUserToken, socket)
        }
    }, [localUserToken, socket])

    /** 
     * Listen for chat updates from chatsStore 
     */
    useEffect(() => {
        const handleMessageUpdate = () => {
            setChatContent([...chatsStore.getMessages()]);
        };

        const listener = chatsStore.eventEmitter.addListener('updateChats', handleMessageUpdate);
        return () => listener.remove();
    }, [])

    /** 
     * Group chats by other user when chatContent changes 
     */
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

    /** 
     * Update chat last message when new messages arrive 
     */
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
    
        // Subscribe to the event
        const subscription = messagesStore.eventEmitter.addListener('newMessage', handleNewMessage);
    
        // Cleanup
        return () => {
            subscription.remove();
        };
    }, []);

    // ----- Functions ----------------------------------------------------------------------
    
    /**
     * Handle pull-to-refresh action
     * Requests new chats from server
     */
    const onRefresh = async () => {
        setRefreshing(true);
        // Request new chats or refresh chat list here
        if (localUserToken && socket && typeof socket.send === 'function') {
            getChats(localUserToken, socket);
        }
        setRefreshing(false);
    };

    /**
     * Navigate to Chat screen with selected chat details
     * @param {string} otherUsername - Username of the other user
     * @param {string} otherUserToken - Token of the other user
     * @param {string} roomToken - Token of the chat room
     */
    const handleNavigation = (otherUsername, otherUserToken, roomToken) => {
        navigation.navigate('Chat', { otherUsername, otherUserToken, roomToken });
    };

    // ----- DOM ----------------------------------------------------------------------------
    return (
        <View>
            {/* Show skeleton loader when no chats are available */}
            {chatContent.length === 0 ? (
                <Chats />
            ) : (
                <View style={style.container}>
                    {/* Scrollable chat list with pull-to-refresh */}
                    <ScrollView
                        style={style.refreshContainer}
                        contentContainerStyle={style.refreshContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#000']}
                            />
                        }
                    >
                        {/* Map through grouped chats and render each chat item, sorted by most recent message */}
                        {Object.entries(groupedChats)
                            .sort((a, b) => {
                                // Sort by comparing message timestamps (newest first)
                                const dateA = new Date(a[1].lastMessage.created_at);
                                const dateB = new Date(b[1].lastMessage.created_at);
                                return dateB - dateA;
                            })
                            .map(([otherUsername, data]) => (
                            <TouchableOpacity
                                onPress={() => handleNavigation(otherUsername, data.otherUserToken, data.roomToken)}
                                key={data.otherUserToken}
                                style={[
                                    style.chatContainer,
                                ]}
                            >
                                {/* User profile image */}
                                <Image
                                    source={profile}
                                    style={{ width: 60, height: 60, marginRight: 10 }}
                                />

                                {/* Chat information container */}
                                <View style={style.lastMessageContainer}>
                                    <View>
                                        {/* Username */}
                                        <Text style={style.chatGroupHeader}>{otherUsername}</Text>
                                        {/* Last message preview */}
                                        <Text style={style.message}>{data.lastMessage.message}</Text>
                                    </View>
                                    
                                    {/* Last message timestamp */}
                                    <Text style={style.lastMessageDate}>{data.lastMessageDate}</Text>
                                </View>
                                
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    
                </View>
            )}
        </View>
    );
};

// ----- Styles -----------------------------------------------------------------------------
const style = StyleSheet.create({
    // Main container
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    // Chat header styling
    chatGroupHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: generalColors.color1
    },
    
    // Individual chat item container
    chatContainer: {
        flex: 1,
        padding: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Last message container
    lastMessageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },

    // Last message timestamp
    lastMessageDate: {
        fontSize: 12,
        marginTop: 7,
        color: generalColors.color1
    },
    
    // Refresh container
    refreshContainer: {
        width: '100%',
    },
    
    // Message text
    message: {
        color: generalColors.color1
    }
});