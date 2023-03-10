import React from "react";
import { View } from "react-native";
import { HeaderHeightContext } from "react-navigation-stack";

export default function Divider(){
    return(
        <View
            style={{
                borderBottomColor: '#2222',
                borderBottomWidth: 1,
            }}
        /> 
    ) 
}