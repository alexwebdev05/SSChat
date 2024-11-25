// React dependencies
import { StyleSheet, View, Text } from 'react-native';


// Theme
import generalColors from '../../styles/generalColors';

export default function Header() {
    return (
        
            <View style={style.container}>
                    <Text style={style.title}>SSChat</Text>
            </View>
        
    )
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 15,
    },
    title: {
        width: '100%',
        fontSize: 20,
        fontWeight: 800,
        backgroundColor: 'white'
    }
})