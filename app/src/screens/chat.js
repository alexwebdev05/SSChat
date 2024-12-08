import { StyleSheet, View, Text, Image, TouchableOpacity, Button, TextInput, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

// Theme
import generalColors from '../styles/generalColors';
import { StatusBar  } from 'expo-status-bar';

export default function Chat({route}) {

    // Other user name
    const { user } = route.params

    // ----- DOM -----
    return (
        <View style={style.screen}>

            {/* Transparent StatusBar */}
            <StatusBar barStyle="auto" />
            
            {/* Header */}
            <Shadow
                startColor={generalColors.start}
                endColor={generalColors.finish}
                distance={30}
            >
                <View style={style.header}>

                    {/* Image */}
                    <Image source={require('app/assets/icons/profile.png')} style={{width: 45, height: 45, marginRight: 10}} />

                    {/* Username */}
                    <Text style={style.username}>{user}</Text>

                </View>
                
            </Shadow>

            {/* Messages */}
            <View style={style.messageContainer}>

                <View style={style.message}>
                    <Text style={style.messageText}>Hola buenas tardes</Text>
                </View>


                <View style={style.userHost}>
                    <View style={style.messageHost}>
                        <Text style={style.messageText}>Hola buenas tardes</Text>
                    </View>
                </View>

            </View>

            {/* Message creator */}
            <View style={style.messageCreator}>
                <TextInput 
                    placeholder='Message'
                    style={style.messageInput}
                />

                {/* Send button */}
                <TouchableOpacity
                    style={style.sendButton}
                >

                </TouchableOpacity>
            </View>

        </View>
    )

}

// ----- Styles -----
const { width } = Dimensions.get('window');

const style = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%'
    },

    // Header
    header: {
        width: width,
        paddingTop: 35,
        marginLeft: 25,
        height: 105,
        flexDirection: 'row',
        alignItems: 'center'
    },

    username: {
        fontSize: 20,
        fontWeight: 600,
    },

    // Messages
    messageContainer: {
        width: '100%',
        flex: 1,
    },

    userHost: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    message: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 10,
        fontSize: 7,
        backgroundColor: generalColors.guestMessage
    },

    messageHost: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 10,
        fontSize: 7,
        backgroundColor: generalColors.main
    },

    messageText: {
        fontWeight: 800,
        color: 'white'
    },

    // Bottom Options
    messageCreator: {
        width: width - 20,
        height: 45,
        flexDirection: 'row',
        marginVertical: 10,
        marginLeft: 10,
        justifyContent: 'center',
        
    },
    messageInput: {
        flex: 1,
        borderRadius: 100,
        backgroundColor: generalColors.messageMaker,
        fontWeight: 800
    },
    sendButton: {
        borderRadius: 100,
        bottom: 0,
        right: 0,
        width: 45,
        height: 45,
        marginLeft: 10,
        backgroundColor: generalColors.main,
    }
})