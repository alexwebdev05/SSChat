// React libraries
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shadow } from 'react-native-shadow-2';

// Api
import { newChat } from '../../api/websocket/chats';

// Assets
import plus from '../../../assets/phoneIcons/addChat.png'

// Colors
import generalColors from '../../styles/generalColors';

/**
 * ChatMaker Component - Allows users to create new chats
 * @returns {JSX.Element} ChatMaker floating button and modal
 */
export const ChatMaker = () => {
    // ----- States -------------------------------------------------------------------------
    
    /** Username of the chat recipient */
    const [username, setUsername] = useState('');
    
    /** Controls visibility of the new chat modal */
    const [isNewChatVisible, setIsNewChatVisible] = useState(false);
    
    /** Current user's token */
    const [localUser, setLocalUser] = useState('');
    
    // ----- Effects ------------------------------------------------------------------------

    /**
     * Fetch local user data from AsyncStorage
     */
    useEffect(() => {
        const localUser = async () => {
            const userData = await AsyncStorage.getItem('userData');
            const parsedData = JSON.parse(userData)
            setLocalUser(parsedData.token);
        };
    
        localUser();
        
    }, []);
    
    // ----- Functions ----------------------------------------------------------------------

    /**
     * Show chat creation modal
     */
    const plusHandle = async () => {
        setIsNewChatVisible(true);
    }

    /**
     * Hide chat creation modal
     */
    const returnHandler = async () => {
        setIsNewChatVisible(false);
    }

    /**
     * Create new chat with specified user
     */
    const newUser = () => {
        // Create new chat
        newChat(localUser, username)
        
        // Make chat maker invisible
        setIsNewChatVisible(false);
    }

    // ----- DOM ----------------------------------------------------------------------------
    return(
        <View style={style.container}>

            {/* Floating action button to create new chat */}
            <TouchableOpacity onPress={plusHandle} style={style.plusContainer}>
                <Image source={plus} style={style.plusIcon}></Image>
            </TouchableOpacity>

            {/* Chat creation modal */}
            {isNewChatVisible && (
                <View style={style.makerContainer}>
                    {/* Transparent overlay to handle closing on outside click */}
                    <TouchableOpacity onPress={returnHandler} style={style.returnHandler} />

                    {/* Modal content */}
                    <View style={style.newChatContainer}>
                        <Shadow
                        startColor={generalColors.start}
                        endColor={generalColors.finish}
                        distance={30}
                        >
                            {/* Input field and button container */}
                            <View style={style.inputEnter}>
                                {/* Username input */}
                                <TextInput
                                placeholder="recipient username"
                                placeholderTextColor="gray"
                                onChangeText={setUsername}
                                style={style.newChatInput}
                                ></TextInput>

                                {/* Start chat button */}
                                <TouchableOpacity onPress={newUser} onChangeText={setUsername} style={style.newChatButton}>
                                    <Text style={style.newChatButtonText}>Start</Text>
                                </TouchableOpacity>
                            </View>
                        </Shadow>
                    </View>
                </View>
            )}
        </View>
    )
}

// ----- Styles -----------------------------------------------------------------------------
const style = StyleSheet.create({
    // Main container
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    
    // Plus button styling
    plusContainer: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        padding: 15,
        borderRadius: 25,
        backgroundColor: generalColors.palette1
    },
    
    plusIcon: {
        width: 40,
        height: 40,
    },

    // Modal container
    makerContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },

    // New chat form container
    newChatContainer: {
        position: 'absolute',
        bottom: 50,
        left: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    // Input field styling
    newChatInput: {
        height: 50,
        width: 180,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: 'white'
    },
    
    // Start button styling
    newChatButton: {
        height: 50,
        width: 50,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: generalColors.palette1
    },
    
    // Button text styling
    newChatButtonText: {
        fontWeight: 'bold',
        color: generalColors.color1
    },
    
    // Input and button container
    inputEnter: {
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    
    // Transparent overlay for closing modal
    returnHandler: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1
    },
    
    // Shadow container
    shadow: {
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
    }
})