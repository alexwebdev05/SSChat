// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// API
import { api } from '../../api/connection';

// Theme
import generalColors from '../../styles/generalColors';

export const Inbox = () => {
    const [chatContent, setChatContent] = useState([]);
    const [localUserToken, setLocalUserToken] = useState('');
    const [groupedChats, setGroupedChats] = useState({});

    const navigation = useNavigation();

    // Get local user data
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

    // Fetch chats periodically
    useEffect(() => {
        if (!localUserToken) return;

        const fetchChats = async () => {
            try {
                const response = await fetch(api.getChats, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user1: localUserToken }),
                });

                if (!response.ok) {
                    throw new Error('API response failed');
                }

                const responseData = await response.json();
                setChatContent(responseData);
            } catch (error) {
                console.error('Error fetching chats: ', error);
            }
        };

        fetchChats();
        const interval = setInterval(fetchChats, 2000);

        return () => clearInterval(interval);
    }, [localUserToken]);

    // Group chats when chatContent changes
    useEffect(() => {
        const groupChats = async () => {
            const grouped = {};

            for (const chat of chatContent) {
                const otherUser = chat.user1 === localUserToken ? chat.user2 : chat.user1;
                const otherUserData = await getOtherUser(otherUser);

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

    // Fetch other user name
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

    // Navigate to Chat screen
    const handleNavigation = (otherUsername, otherUserToken, roomToken) => {
        navigation.navigate('Chat', { otherUsername, otherUserToken, roomToken });
    };

    // ----- DOM -----
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

// ----- Styles -----
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
