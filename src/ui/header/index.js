// React dependencies
import { StyleSheet, View, Text, Dimensions } from 'react-native';

// Libraries
import LinearGradient from 'react-native-linear-gradient';

// Theme
import generalColors from '../../styles/generalColors';

export default function Header() {
    return (
        <LinearGradient
            colors={[generalColors.palette1, generalColors.palette2]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={style.container}
        >
            <Text style={style.title}>SSChat</Text>
        </LinearGradient>
    );
}

// ----- Styles -----
const { width } = Dimensions.get('window');

const style = StyleSheet.create({
    container: {
        width: width,
        height: 105,
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 23,
        fontWeight: '800',
        textAlign: 'center',
        color: 'white',
    },
});
