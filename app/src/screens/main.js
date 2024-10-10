import { StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Icons
import options from '../../assets/icons/options.png'

export default function Main() {
    return (
        <View style={style.container}>
            <StatusBar barStyle="auto" />

            {/* Tab */}
            <View style={style.tab}>
                <Text style={style.title}>SSChat</Text>
                <Image source={options} style={style.optionIcon}></Image>
            </View>

            {/* Search */}
            <View>
                <Text>Search</Text>
            </View>


        </View>
    )
}

const style = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#5eb1ff'
    },

    // Tab
    tab: {
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',

        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,

        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#004584'
    },
    optionIcon: {
        position: 'absolute',
        right: 30,
        width: 20,
        height: 20,
    }
    
    //
})