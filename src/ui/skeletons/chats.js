import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

// Colors
import generalColors from '../../styles/generalColors';

export default function SkeletonChats() {
    const [chatArray, setChatArray] = useState(0)
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Chat quantity
    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        const chatHeight = 100;
        const chatquantity = Math.floor(height / chatHeight)
        setChatArray(chatquantity)
    }

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
        ).start()
    }, [])

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [generalColors.skeleton1, generalColors.skeleton2]
    })

    return (
    <View style={style.container} onLayout={handleLayout}>
        {[...Array(chatArray)].map((_, index) => {
            const animatedStyle = { backgroundColor };
            return (
                <View style={style.chatContainer} key={index}>
                    <Animated.View style={[style.image, animatedStyle]} />
                    <View style={style.textContainer}>
                        <Animated.View style={[style.name, animatedStyle]} />
                        <Animated.View style={[style.message, animatedStyle]} />
                    </View>
                </View>
            );
        })}
    </View>
);

}

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },

    chatContainer: {
        height: 80,
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 30,
        alignItems: 'center',
        flexDirection: 'row',
    },

    image: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 50,
        backgroundColor: 'gray'
    },

    textContainer: {
        flex: 1
    },

    name: {
        width: 100,
        height: 20,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: 'gray'
    },

    message: {
        width: '100%',
        height: 20,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: 'gray'
    }
})