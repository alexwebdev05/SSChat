// React dependencies
import { StyleSheet, View, Text, Dimensions  } from 'react-native';

// Libraries
import { Shadow } from 'react-native-shadow-2';

// Theme
import generalColors from '../../styles/generalColors';

const { width } = Dimensions.get('window');

export default function Header() {

    return (
        
            <View style={style.container}>
                <Shadow
                startColor='#00000010'
                endColor='#00000000'
                distance={50}
                >
                    <View style={style.shadow}>
                        <Text style={style.title}>SSChat</Text>
                    </View>
                </Shadow>
            </View>
        
    )
}

const style = StyleSheet.create({
    container: {
        width: width,
        height: 120,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 15,
        backgroundColor: 'white'
    },
    shadow: {
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        width: width,
        fontSize: 20,
        fontWeight: 800,
        textAlign: 'center'
    }
})