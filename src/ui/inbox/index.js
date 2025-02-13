// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// API
import { api } from '../../api/url';
import { getChats } from '../../api/websocket/chats';
import { socketConnection } from '../../api/websocket/connection';

// Theme
import generalColors from '../../styles/generalColors';
import { use } from 'react';

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

    //Get chats
    // useEffect(() => {
    //     if (isSocketConnected === true) {
    //         try {
    //             const data = getChats(localUserToken);
    //             console.log('🔹 Chats:', data);
    //            setChatContent(data);
    //         }catch (error) {
    //             console.error('Error getting chats:', error);
    //         }
    //     }
    // }, [localUserToken, isSocketConnected])

    // Group chats by other user when chatContent changes
    useEffect(() => {
        const groupChats = async () => {
            const grouped = {};

            for (const chat of chatContent) {
                // Determine the other user in the chat
                const otherUser = chat.user1 === localUserToken ? chat.user2 : chat.user1;
                const otherUserData = await getOtherUser(otherUser);

                // Group chats by other user's username
                if (!grouped[otherUserData.username]) {
                    grouped[otherUserData.username] = {
                        otherUserToken: otherUserData.token,
                        roomToken: chat.token,
                        chats: [],
                    };
                }

                grouped[otherUserData.username].chats.push(chat);
            }

            setGroupedChats(grouped);
        };

        if (chatContent.length > 0) {
            groupChats();
        }
    }, [chatContent]);

    // Fetch other user's data from the API
    const getOtherUser = async (token) => {
        try {
            const response = await fetch(api.checkToken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),
            });

            if (!response.ok) {
                throw new Error('API response failed');
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error fetching username: ', error);
            return { username: 'Unknown User', token: '' };
        }
    };

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
