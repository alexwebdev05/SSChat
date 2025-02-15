// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// API
import { api } from '../../api/url';
import { socketConnection, getChats, checkToken } from '../../api/websocket/websocket';

// Theme
import generalColors from '../../styles/generalColors';

export const Inbox = () => {
    // State variables to store chat data, user token, and grouped chats
    const [chatContent, setChatContent] = useState([]);
    const [localUserToken, setLocalUserToken] = useState('');
    const [groupedChats, setGroupedChats] = useState({});
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const navigation = useNavigation();

    // Fetch local user data from AsyncStorage
    useEffect(() => {
        const getLocalUser = async () => {
            const localData = await AsyncStorage.getItem('userData');
            if (localData) {
                const userData = JSON.parse(localData);
                setLocalUserToken(userData.token);
            }
        };
        getLocalUser();
    }, []);

    // Websocket connection
    useEffect(() => {

        // Check local user UUID
        if (!localUserToken || isSocketConnected) return;


        const cleanupWebSocket = socketConnection(setIsSocketConnected);
        return cleanupWebSocket;

        }, [localUserToken]);

    // Set local chats
    useEffect(() => {
        const getLocalChats =  async () => {
            const chats = await AsyncStorage.getItem('chats');
            setChatContent(chats)
        }
        getLocalChats()
    }, [])

    // Request new chats
    useEffect(() => {
        if (isSocketConnected === false) return;
        try {
            const data = JSON.stringify(localUserToken)
            getChats(data);
        }catch (error) {
            console.error('Error getting chats:', error);
        }
    })

    // Group chats by other user when chatContent changes
    useEffect(() => {
        const groupChats = async () => {
            
            // Check if exist chats
            if ( chatContent.length === 0 ) return;

            // Parse chats to JSON
            const parsedChatContent = JSON.parse(chatContent);

            const grouped = {};

            // 
            for (const chat of parsedChatContent) {

                const otherUser = chat.username;

                // Group chats by other user's username
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
                        source={require('app/assets/icons/profile.png')}
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
