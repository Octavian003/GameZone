import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function Menu({ children }){
    return(
        <View 
            style={styles.container}
        >
            <View style={styles.content}>
                {/* <Text style={styles.item}>Mama</Text>
                <Text style={styles.item}>Tata</Text>
                <Text style={styles.item}>Frate</Text> */}
                { children }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 0.2,
        right:0 ,
        position: 'absolute',
        // minHeight: 100,
        width: 150,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    content: {
        // marginHorizontal: 10,
        // marginVertical: 10,
    },
    item: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        padding: 10,
        textAlign:'center',
        // marginHorizontal: 10,
        // marginVertical: 5,
    }
})