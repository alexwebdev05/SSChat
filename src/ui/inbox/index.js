// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { chatsStore } from '../../api/websocket/chats';

// API
import { api } from '../../api/url';
import { socketConnection } from '../../api/websocket/websocket';
import { getChats } from '../../api/websocket/chats';

// Theme
import generalColors from '../../styles/generalColors';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const Inbox = () => {
    // State variables to store chat data, user token, and grouped chats
    const [chatContent, setChatContent] = useState([]);
    const [localUserToken, setLocalUserToken] = useState('');
    const [groupedChats, setGroupedChats] = useState({});
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [socket, setSocket] = useState(null)

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
            if (!grouped[otherUser]) {
              grouped[otherUser] = {
                otherUserToken: chat.userID,
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

    // Navigate to Chat screen with selected chat details
    const handleNavigation = (otherUsername, otherUserToken, roomToken) => {
        navigation.navigate('Chat', { otherUsername, otherUserToken, roomToken });
    };

    // Render the Inbox component
    return (
        <View style={style.container}>
            {Object.entries(groupedChats).map(([otherUsername, data]) => (
                <TouchableOpacity
                    onPress={() => handleNavigation(otherUsername, data.otherUserToken, data.roomToken)}
                    key={otherUsername}
                    style={style.chatContainer}
                >
                    <Image
                        source={require('../../assets/icons/profile.png')}
                        style={{ width: 55, height: 55, marginRight: 10 }}
                    />
                    <View>
                        <Text style={style.chatGroupHeader}>{otherUsername}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// Styles for the Inbox component
const style = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    chatGroupHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: generalColors.primary,
    },
    chatContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: generalColors.chats,
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
