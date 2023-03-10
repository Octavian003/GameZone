import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Keyboard, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default function FloatingButton({ onPress, name, styleButton}){
    const [show, setShow] = useState(false)

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setShow(true)
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setShow(false)
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
      }, [show]);


    return(
        <View style={!show ? styles.shadow : styles.inactive}>
            <TouchableOpacity
                onPress={onPress} 
                style={[styles.button, styleButton]}
            >
                <AntDesign name={name} size={24} color="white"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent:'center',
        alignItems: 'center',
    },
    shadow: {
        position: 'absolute', 
        right: 30,
        bottom: 30,
        height: 56,
        width: 56,
        tintColor: '#fff',
        elevation: 5,
        backgroundColor: '#1253bc',
        shadowOffset: {
            width: 0, 
            height: 5,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        shadowRadius: 3,
        borderRadius: 28,     
    },
    inactive: {
        display: 'none'
    },
}) 