import { StyleSheet, Text, View } from 'react-native';

export const Inbox = () => {
    return(
        <View style={style.chatContainer}>
            <Text>Chats</Text>
        </View>
    )
}

const style = StyleSheet.create({

        chatContainer: {
            height: '100%',
            padding: 10,
            borderRadius: 20,
            marginVertical: 15,
    
            backgroundColor: 'white'
        }
})