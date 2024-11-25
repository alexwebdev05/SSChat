import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api/connection';

export const Inbox = () => {
    const [chatContent, setChatContent] = useState([])
    const [localUser, setLocalUser] = useState('')
    // useEffects
    useEffect(() => {

        if (!localUser) {
            console.log("Loading localUser...")
        }

        const interval = setInterval(() => {
            chats();
        }, 5000);
               
        return () => clearInterval(interval)
        
    }, [localUser])

    useEffect(() => {
        console.log(chatContent); // Imprime el contenido del chat cada vez que cambia
    }, [chatContent]);
    
    // Functions
    const getLocalUser = async () => {
        const localData = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(localData)
        setLocalUser(userData.username)
    }
    getLocalUser()

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
                throw new Error('The api do not response');
            } else {
                const responseData = await response.json();
                setChatContent(responseData)
            }

            

        } catch (error) {
            console.error('Error getting the chats: ', error);
        }
    }

    const renderChatItem = ({ item }) => {
        let other;

        if (localUser) {
            if (item.user1 === localUser) {
                other = item.user2;
            } else if (item.user2 === localUser) {
                other = item.user1;
            } else {
                console.log('Error finding other user');
            }
        }
        
        return (
            <Text style={style.chatItem}>{other} at {new Date(item.created_at).toLocaleString()}</Text>
        );
    }

    return(
        <View style={style.chatContainer}>
            <Text style={style.header}>Chats</Text>
            <FlatList
                data={chatContent} // Usa el estado chatContent
                keyExtractor={(item, index) => index.toString()} // Clave única para cada item
                renderItem={renderChatItem} // Función para renderizar cada chat
            />
        </View>
    )
}

const style = StyleSheet.create({

        chatContainer: {
            height: '100%',
            padding: 10,
            borderRadius: 20,
            marginVertical: 15,
    
            backgroundColor: 'white'
        }
})