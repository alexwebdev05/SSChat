// react libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Api
import { api } from '../../api/connection';

// Theme
import generalColors from '../../styles/generalColors';

export const Inbox = () => {
    const [chatContent, setChatContent] = useState([]);
    const [localUser, setLocalUser] = useState('');

    const navigation = useNavigation();

    // Get local user data
    useEffect(() => {
        const getLocalUser = async () => {
            const localData = await AsyncStorage.getItem('userData');
            const userData = JSON.parse(localData);
            setLocalUser(userData.username);
        };
        getLocalUser();
    }, []);

    // Get chats from local user
    useEffect(() => {
        if (!localUser) return;

        // Get data every 2 seconds
        const interval = setInterval(() => {
            chats();
        }, 100);

        // Clear interval
        return () => clearInterval(interval);
    }, [localUser]);

    // ----- Functions -----

    // Fetch chats from API
    const chats = async () => {
        try {
            
            // Send data to api
            const response = await fetch(api.getChats, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: localUser }),
            });

            // Bad response
            if (!response.ok) {
                throw new Error('API response failed');
            }

            // Set obtained chats
            const responseData = await response.json();
            setChatContent(responseData);

            // Catch errors
        } catch (error) {
            console.error('Error fetching chats: ', error);
        }
    };

    // Function to group chats by the other user
    const groupChats = () => {
        if (!Array.isArray(chatContent)) {
            return {};
        }
        
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

    // Navigate to Chat screen
    const handleNavigation = (user, token) => {
        navigation.navigate('Chat', { user, token });
    };

    // ----- DOM -----
    return (
        <View style={style.container}>

            {/* Dinamic chat */}
            {Object.entries(groupChats()).map(([user, chats]) => (
                <TouchableOpacity onPress={() => handleNavigation(user, chats[0].token)} key={user} style={style.chatContainer}>

                    {/* User image */}
                    <Image source={require('app/assets/icons/profile.png')} style={{width: 55, height: 55, marginRight: 10}} />

                    {/* User name */}
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
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    chatItem: {
        fontSize: 14,
        marginBottom: 5,
    }
});
