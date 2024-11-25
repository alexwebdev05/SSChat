import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import plus from '../../../assets/icons/plus.png'
import { api } from '../../api/connection';

export const ChatMaker = () => {
    const [username, setUsername] = useState('');

    const [isNewChatVisible, setIsNewChatVisible] = useState(false);

    const plusHandle = async () => {
        setIsNewChatVisible(true);
    }

    const returnHandler = async () => {
        setIsNewChatVisible(false);
    }

    const newUser = async () => {
        const localData = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(localData)

        const jsonData = {
            "user1": userData.username,
            "user2": username
        };

        try {
            const response = await fetch(api.newChat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error('The api do not respond');
            }

        } catch(error) {
            console.log('[ CLIENT ] Error settin new chat: ', error);
            throw error
        }
        setIsNewChatVisible(false);
      }

    return(
        <View style={style.container}>

            <TouchableOpacity onPress={plusHandle} style={style.plusContainer}>
                <Image source={plus} style={style.plusIcon}></Image>
            </TouchableOpacity>

            {isNewChatVisible && (
            <View style={style.newChatContainer}>
                <Text>New Chat</Text>
                <View style={style.inputEnter}>
                    <TextInput
                    placeholder="recipient username"
                    placeholderTextColor="gray"
                    onChangeText={setUsername}
                    style={style.newChatInput}
                    ></TextInput>

                    <TouchableOpacity onPress={newUser} onChangeText={setUsername} style={style.newChatButton}>
                        <Text style={style.newChatButtonText}>Start</Text>
                    </TouchableOpacity>

                </View>
                {/* Returner */}
                <TouchableOpacity onPress={returnHandler} style={style.returnHandler} />
            </View>
            )}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    // Plus button
    plusContainer: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#5eb1ff'
    },
    plusIcon: {
        width: 40,
        height: 40,
    },
    // New chat
    newChatContainer: {
        display: 'auto',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(90, 177, 255, 0.5)'
    },
    newChatInput: {
        height: 50,
        marginTop: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        backgroundColor: 'white'
    },
    newChatButton: {
        marginTop: 10,
        height: 50,
        width: 50,
        borderRadius: 15,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5eb1ff'
    },
    newChatButtonText: {
        fontWeight: 'bold',
        color: 'white'
    },
    inputEnter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    returnHandler: {
        width: 20,
        height: 20,
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
    }
})