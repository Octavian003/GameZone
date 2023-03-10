import React from "react";
import { createStackNavigator } from "react-navigation-stack"; 
import { createAppContainer } from "react-navigation";
import Header from "../shared/Header";
import Home from "../screens/Home";
import Details from "../screens/Details";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Camera from "../screens/Camera"

const screens = {
    Login: {
        screen: Login,
        navigationOptions: { 
            headerShown: null,
        }
    },
    Register: {
        screen: Register,
        navigationOptions: { 
            headerStyle:{
                backgroundColor: '#42c5f5',
            },
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            header: () => <Header title = 'GameZone'/>, 
        }
    },
    Details: {
        screen: Details,
    },
    Camera: {
        screen: Camera
    }
}

const HomeAboutStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#444',
        headerStyle:{
            height: 60,
            backgroundColor: '#eee',
        },
    }
});

export default createAppContainer(HomeAboutStack);