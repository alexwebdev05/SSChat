// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// API
import { api } from '../../api/connection';

// Theme
import generalColors from '../../styles/generalColors';

export const Inbox = () => {
    const [chatContent, setChatContent] = useState([]);
    const [localUser, setLocalUser] = useState('');
    const [localUserToken, setLocalUserToken] = useState('');
    const [groupedChats, setGroupedChats] = useState({});

    const navigation = useNavigation();

    // Get local user data
    useEffect(() => {
        const getLocalUser = async () => {
            const localData = await AsyncStorage.getItem('userData');
            if (localData) {
                const userData = JSON.parse(localData);
                setLocalUser(userData.username);
                setLocalUserToken(userData.token);
            }
        };
        getLocalUser();
    }, []);

    // Get chats from local user
    useEffect(() => {
        if (!localUserToken) return;

        // Get data every 2 seconds
        const interval = setInterval(() => {
            chats();
        }, 2000);

        // Clear interval
        return () => clearInterval(interval);
    }, [localUserToken]);

    // Group chats when chatContent changes
    useEffect(() => {
        const fetchGroupedChats = async () => {
            const groups = await groupChats();
            setGroupedChats(groups);
        };

        if (chatContent.length > 0) {
            fetchGroupedChats();
        }
    }, [chatContent]);

    // ----- Functions -----

    // Fetch chats from API
    const chats = async () => {
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

    // Fetch other user name
    const getOtherUserName = async (token) => {
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
            return responseData.username;
        } catch (error) {
            console.error('Error fetching username: ', error);
            return 'Unknown User';
        }
    };

    // Group chats by the other user
    const groupChats = async () => {
        if (!Array.isArray(chatContent)) {
            return {};
        }

        const groupedChats = {};

        for (const chat of chatContent) {
            let otherUser = chat.user1 === localUserToken ? chat.user2 : chat.user1;
            const otherUsername = await getOtherUserName(otherUser);

            if (!groupedChats[otherUsername]) {
                groupedChats[otherUsername] = [];
            }

            groupedChats[otherUsername].push(chat);
        }

        return groupedChats;
    };

    // Navigate to Chat screen
    const handleNavigation = (user, token) => {
        navigation.navigate('Chat', { user, token });
    };

    // ----- DOM -----
    return (
        <View style={style.container}>
            {Object.entries(groupedChats).map(([user, chats]) => (
                <TouchableOpacity
                    onPress={() => handleNavigation(user, chats[0].token)}
                    key={user}
                    style={style.chatContainer}
                >
                    <Image
                        source={require('app/assets/icons/profile.png')}
                        style={{ width: 55, height: 55, marginRight: 10 }}
                    />
                    <View>
                        <Text style={style.chatGroupHeader}>{user}</Text>
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
