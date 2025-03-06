// React dependencies
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';

// Theme
import generalColors from '../styles/generalColors';
import { StatusBar  } from 'expo-status-bar';

// Images
import options from '../../assets/phoneIcons/options.png'

// UI
import Header from '../ui/header';
import { Inbox } from '../ui/inbox';
import { ChatMaker } from '../ui/chatMaker/index'

// Utils
import { logOut } from '../utils/session/logout';

export default function Main({navigation}) {

    const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)

    // Navigation var transparent
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(generalColors.back);
    }, []);

    // ----- Functions -----

    // Change menu visibility
    const showMenu = async () => {
        // Make visible
        if (isOptionMenuVisible === true) {
            setIsOptionMenuVisible(false)
        // Make transparent
        } else {
            setIsOptionMenuVisible(true)
        }
    }

    // Log out
    const handleLogOut = () => {
        logOut()
    }

    // Make menu invisible
    const returnHandler = () => {
        setIsOptionMenuVisible(false)
    }

    // ----- DOM -----
    return (
        <View style={style.screen}>

            {/* Transparent StatusBar */}
            <View>
                <StatusBar style='light' />
            </View>
            

            {/* Header */}
            <Header />

            {/* Options */}
            <TouchableOpacity onPress={showMenu} style={style.options}>
                <Image source={options} style={{width: 20, height: 20,}}/>

                {/* Log Out */}
                {isOptionMenuVisible && (
                    <View style={style.optionButtons}>
                        <TouchableOpacity onPress={handleLogOut} style={style.logOutButton}>
                            <Text style={{color: generalColors.white, fontWeight: 800}}>Log out</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </TouchableOpacity>

            {/* Return */}
            {isOptionMenuVisible && (
                <TouchableOpacity onPress={returnHandler} style={style.returnHandler} />
            )}

            {/* Chats */}
            <View style={style.chats}>
                <Inbox />
            </View>

            {/* Chat maker */}
            <ChatMaker />
            
        </View>
    )
}

// ----- Styles -----
const style = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: generalColors.back
    },
    chats: {
        width: '100%'
    },
    options: {
        position: 'absolute',
        top: 60,
        right: 30,
        zIndex: 10,
    },
    optionButtons: {
        position: 'absolute',
        right: 0,
        top: 25,
        width: 80,
        padding: 5,
        alignItems: 'flex-end',
        backgroundColor: generalColors.palette1,
        borderRadius: 10,
        zIndex: 10
    },
    logOutButton: {
        width: '100%',
        alignItems: 'center',
    },
    // Return
    returnHandler: {
        width: 20,
        height: 20,
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
    }

})