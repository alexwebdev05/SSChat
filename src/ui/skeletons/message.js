import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

// Colors
import generalColors from '../../styles/generalColors';

export default function Messages() {
    const [messageCount, setMessageCount] = useState(0);
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Set messaage quantity
    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        const messageHeight = 50;
        const maxMessages = Math.floor(height / messageHeight);
        setMessageCount(maxMessages);
    };

    // Skeleton animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: false
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: false
                })
            ])
        ).start();
    }, []);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [generalColors.skeleton1, generalColors.skeleton2]
    });

    return (
        <View style={style.container} onLayout={handleLayout}>
            {[...Array(messageCount)].map((_, index) => {
                const animatedStyle = { backgroundColor };
                return (
                    <Animated.View
                        key={index}
                        style={[
                            style.message,
                            index % 2 === 0 ? style.messageLeft : style.messageRight,
                            index % 3 === 0 && style.longMessage,
                            index % 4 === 0 && style.longMessage2,
                            animatedStyle
                        ]}
                    />
                );
            })}
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 15
    },

    message: {
        height: 30,
        width: '50%',
        borderRadius: 13,
        marginVertical: 10
    },

    messageLeft: {
        alignSelf: 'flex-start',
        marginLeft: 10
    },

    messageRight: {
        alignSelf: 'flex-end',
        marginRight: 10
    },

    longMessage: {
        width: '70%'
    },

    longMessage2: {
        width: '60%'
    }
});
