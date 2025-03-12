// React libraries
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

// Colors
import generalColors from '../../styles/generalColors';

/**
 * SkeletonChats Component - Loading placeholder for chat list
 * Creates animated skeleton loading effect for chat items
 * @returns {JSX.Element} Skeleton loading component
 */
export default function SkeletonChats() {
    // ----- States -------------------------------------------------------------------------
    
    /** Number of chat items to display */
    const [chatArray, setChatArray] = useState(0)
    
    /** Animation value for skeleton effect */
    const animatedValue = useRef(new Animated.Value(0)).current;

    // ----- Functions ----------------------------------------------------------------------
    
    /**
     * Calculate number of chat items based on container height
     * @param {Object} event - Layout event object
     */
    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        const chatHeight = 100;
        const chatQuantity = Math.floor(height / chatHeight)
        setChatArray(chatQuantity)
    }

    // ----- Effects ------------------------------------------------------------------------
    
    /** 
     * Setup and start skeleton animation loop
     * Fades between two colors continuously
     */
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

    /** Interpolate animation value to background color */
    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [generalColors.skeleton1, generalColors.skeleton2]
    })

    // ----- DOM ----------------------------------------------------------------------------
    return (
        <View style={style.container} onLayout={handleLayout}>
            {/* Generate skeleton items based on calculated quantity */}
            {[...Array(chatArray)].map((_, index) => {
                const animatedStyle = { backgroundColor };
                return (
                    <View style={style.chatContainer} key={index}>
                        {/* Profile picture placeholder */}
                        <Animated.View style={[style.image, animatedStyle]} />
                        
                        {/* Text content placeholders */}
                        <View style={style.textContainer}>
                            {/* Username placeholder */}
                            <Animated.View style={[style.name, animatedStyle]} />
                            {/* Message placeholder */}
                            <Animated.View style={[style.message, animatedStyle]} />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

// ----- Styles -----------------------------------------------------------------------------
const style = StyleSheet.create({
    // Main container
    container: {
        width: '100%',
        height: '100%',
    },

    // Individual chat item container
    chatContainer: {
        height: 80,
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 30,
        alignItems: 'center',
        flexDirection: 'row',
    },

    // Profile picture placeholder
    image: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 50,
        backgroundColor: 'gray'
    },

    // Text content container
    textContainer: {
        flex: 1
    },

    // Username placeholder
    name: {
        width: 100,
        height: 20,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: 'gray'
    },

    // Message placeholder
    message: {
        width: '100%',
        height: 20,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: 'gray'
    }
})