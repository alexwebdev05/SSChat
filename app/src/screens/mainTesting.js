// React dependencies
import { StyleSheet, View, Text } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';

// Theme
import generalColors from '../styles/generalColors';
import { StatusBar  } from 'expo-status-bar';

// UI
import Header from '../ui/header';

export default function TestingMain() {

    // Navigation var transparent
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(generalColors.main); // Hacer la barra de navegación transparente
    }, []);

    return (
        <View style={style.screen}>

            {/* Transparent StatusBar */}
            <StatusBar barStyle="auto" />

            {/* Header */}
            <Header />
        </View>
    )
}

const style = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    }
})