import { useEffect, useState } from 'react';
import { StyleSheet, Platform, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar  } from 'expo-status-bar';

// UI
import { Inbox } from '../ui/inbox';
import { ChatMaker } from '../ui/charMaker';

// Icons
import options from '../../assets/icons/options.png'

export default function Main() {

    const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#5eb1ff'); // Hacer la barra de navegación transparente
      }, []);

      const showMenu = async () => {
        if (isOptionMenuVisible === true) {
            setIsOptionMenuVisible(false)
        } else {
            setIsOptionMenuVisible(true)
        }
      }

      const logOut = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Logged out')
            setData(null);
        } catch(error) {
            console.log('error logging out: ', error)
        }
      }

    return (
        <View style={style.container}>
            <StatusBar barStyle="auto" />
            <View style={style.topBar}></View>

            {/* Tab */}
            <View style={style.tab}>
                <Text style={style.title}>SSChat</Text>
                <View style={style.optionsContainer}>
                    <TouchableOpacity onPress={showMenu}>
                        <Image source={options} style={style.optionIcon}></Image>
                    </TouchableOpacity>
                    
                    {isOptionMenuVisible && (
                        <View style={style.optionButtons}>
                            <TouchableOpacity onPress={logOut}>
                                <Text>Log out</Text>
                            </TouchableOpacity>
                            
                        </View>
                    )}
                </View>
                
            </View>

            {/* Search and chat */}
            <View style={style.searchChatContainer}>
                {/* Search tab */}
                <View style={style.searchContainer}>
                    <Text>Search</Text>
                </View>

                {/* Chats */}
                <Inbox />
            </View>
            
            {/* Plus button */}
            <ChatMaker />

        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

        backgroundColor: '#5eb1ff'
    },
    topBar: {
        backgroundColor: 'white',
        height: 40,
        width: '100%'
    },

    // Tab
    tab: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',

        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,

        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#004584'
    },
    optionsContainer: {
        position: 'absolute',
        right: 30
    },
    optionIcon: {
        width: 20,
        height: 20,
    },
    optionButtons: {
        position: 'absolute',
        right: 0,
        top: 25,
        width: 80,
        padding: 10,
        alignItems: 'flex-end',
        backgroundColor: '#5eb1ff'
    },
    
    // Search and chat
    searchChatContainer: {
        flex: 1,
        width: '100%',
        padding: 15,
        marginBottom: 50
    },

    // Search bar
    searchContainer: {
        padding: 10,
        borderRadius: 20,

        backgroundColor: 'white',
    }
})