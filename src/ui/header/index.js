// React dependencies
import { StyleSheet, View, Text, Dimensions  } from 'react-native';

// Libraries
import { Shadow } from 'react-native-shadow-2';

// Theme
import generalColors from '../../styles/generalColors';

export default function Header() {

    // ----- DOM -----
    return (
        
            <View style={style.container}>
                <Shadow
                startColor={generalColors.start}
                endColor={generalColors.finish}
                distance={30}
                >
                    <View style={style.shadow}>
                        <Text style={style.title}>SSChat</Text>
                    </View>
                </Shadow>
            </View>
        
    )
}

// ----- Styles -----
const { width } = Dimensions.get('window');

const style = StyleSheet.create({
    container: {
        width: width,
        height: 105,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: generalColors.header,
        borderRadius: 20
    },
    shadow: {
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        width: width,
        fontSize: 23,
        fontWeight: 800,
        textAlign: 'center',
        color: 'white'
    }
})