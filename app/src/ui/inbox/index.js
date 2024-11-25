import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api/connection';

// Theme
import generalColors from '../../styles/generalColors';

export const Inbox = () => {
    const [chatContent, setChatContent] = useState([]);
    const [localUser, setLocalUser] = useState('');

    // useEffect to load local user data
    useEffect(() => {
        const getLocalUser = async () => {
            const localData = await AsyncStorage.getItem('userData');
            const userData = JSON.parse(localData);
            setLocalUser(userData.username);
        };
        getLocalUser();
    }, []);

    // Fetch chats every 5 seconds if localUser is available
    useEffect(() => {
        if (!localUser) return; // If no localUser, don't fetch chats

        const interval = setInterval(() => {
            chats();
        }, 5000);

        return () => clearInterval(interval); // Clean up interval
    }, [localUser]);

    // Fetch chats from API
    const chats = async () => {
        try {
            const response = await fetch(api.getChats, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: localUser }),
            });

            if (!response.ok) {
                throw new Error('API response failed');
            }

            const responseData = await response.json();
            setChatContent(responseData); // Set the fetched chats
        } catch (error) {
            console.error('Error fetching chats: ', error);
        }
    };

    // Function to group chats by the other user
    const groupChats = () => {
        const groupedChats = chatContent.reduce((groups, chat) => {
            let otherUser = chat.user1 === localUser ? chat.user2 : chat.user1;

            if (!groups[otherUser]) {
                groups[otherUser] = [];
            }

            groups[otherUser].push(chat);
            return groups;
        }, {});

        return groupedChats;
    };

    // Render each chat item
    const renderChatItem = ({ item }) => {
        const otherUser = item.user1 === localUser ? item.user2 : item.user1;

        return (
            <Text style={style.chatItem}>
                {otherUser} at {new Date(item.created_at).toLocaleString()}
            </Text>
        );
    };

    return (
        <View style={style.container}>

            {Object.keys(groupChats()).map((user) => (
                <View key={user} style={style.chatContainer}>
                    <Text style={style.chatGroupHeader}>{user}</Text>

                    <FlatList
                        data={groupChats()[user]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderChatItem}
                    />
                </View>
            ))}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        
    },

    // Chats
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        borderRadius: 10,
        marginBottom: 10,
    },
    chatItem: {
        fontSize: 14,
        marginBottom: 5,
    }
});
