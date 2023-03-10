import React from "react";
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, StatusBar } from "react-native";

export default function Header({ title }){
    return (
        <ImageBackground style = {styles.header}> 
            <StatusBar 
                backgroundColor='black'
                barStyle='light-content'
            />
            <Image style = {styles.headerImage} source={require('../assets/heart_logo.png')}/>
            <Text style = {styles.headerText}>{ title }</Text>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    header: {
        // width: '100%',
        // height: '100%',
        // marginTop: StatusBar.currentHeight,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
        letterSpacing: 1,
    }, 
    headerImage: {
        width: 26,
        height: 26,
        marginHorizontal: 10,
    },
})