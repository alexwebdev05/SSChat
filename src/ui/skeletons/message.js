// React libraries
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

// Colors
import generalColors from '../../styles/generalColors';

/**
 * Messages Component - Loading placeholder for chat messages
 * Creates animated skeleton loading effect for message bubbles
 * @returns {JSX.Element} Skeleton loading component for messages
 */
export default function Messages() {
    // ----- States -------------------------------------------------------------------------
    
    /** Number of message items to display */
    const [messageCount, setMessageCount] = useState(0);
    
    /** Animation value for skeleton effect */
    const animatedValue = useRef(new Animated.Value(0)).current;

    // ----- Functions ----------------------------------------------------------------------
    
    /**
     * Calculate number of message items based on container height
     * @param {Object} event - Layout event object
     */
    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        const messageHeight = 50;
        const maxMessages = Math.floor(height / messageHeight);
        setMessageCount(maxMessages);
    };

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
        ).start();
    }, []);

    /** Interpolate animation value to background color */
    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [generalColors.skeleton1, generalColors.skeleton2]
    });

    // ----- DOM ----------------------------------------------------------------------------
    return (
        <View style={style.container} onLayout={handleLayout}>
            {/* Generate skeleton messages based on calculated quantity */}
            {[...Array(messageCount)].map((_, index) => {
                const animatedStyle = { backgroundColor };
                return (
                    <Animated.View
                        key={index}
                        style={[
                            style.message,
                            // Alternate message alignment (left/right) for realistic chat appearance
                            index % 2 === 0 ? style.messageLeft : style.messageRight,
                            // Vary message lengths for more natural appearance
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

// ----- Styles -----------------------------------------------------------------------------
const style = StyleSheet.create({
    // Main container
    container: {
        width: '100%',
        height: '100%',
        padding: 15
    },

    // Base message bubble style
    message: {
        height: 30,
        width: '50%',
        borderRadius: 13,
        marginVertical: 10
    },

    // Left-aligned message (other user)
    messageLeft: {
        alignSelf: 'flex-start',
        marginLeft: 10
    },

    // Right-aligned message (current user)
    messageRight: {
        alignSelf: 'flex-end',
        marginRight: 10
    },

    // Longer message variant 1
    longMessage: {
        width: '70%'
    },

    // Longer message variant 2
    longMessage2: {
        width: '60%'
    }
});