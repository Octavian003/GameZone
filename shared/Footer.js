import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function Footer({ navigation }){
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={{fontSize:18}}>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#42c5f5',
    }
})
