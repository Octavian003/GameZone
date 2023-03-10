import React from 'react';
import { ActivityIndicator } from 'react-native';
import Navigator from './routes/HomeAboutStack';
import { useFonts } from 'expo-font';
// import { Linking, Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const [loaded] = useFonts({
    'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'nunito-extraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'nunito-light': require('./assets/fonts/Nunito-Light.ttf'),
    'nunito-black': require('./assets/fonts/Nunito-Black.ttf'),
    'nunito-medium': require('./assets/fonts/Nunito-Medium.ttf'),
    'nunito-extraLight': require('./assets/fonts/Nunito-ExtraLight.ttf'),
  });

  if (!loaded) {
    return <ActivityIndicator />
  }

  return (
    // <NavigationContainer>
    //   <Stack.Navigator 
    //     initialRouteName="Login"
    //     screenOptions={{
    //       headerTintColor: '#444',
    //       headerStyle: {
    //         height: 60,
    //         backgroundColor: '#eee',
    //       }
    //     }}
    //   >
    //     <Stack.Screen 
    //       name="Login" 
    //       component={Login}
    //       options={{
    //         navigationOptions: { 
    //           headerShown: null,
    //         }
    //       }}
    //     />
    //     <Stack.Screen 
    //       name="Home" 
    //       component={Home}
    //       options = {{
    //         header: () => <Header title = 'GameZone'/>, 
    //       }}
    //     />
    //     <Stack.Screen 
    //       name="Register" 
    //       component={Register}
    //       options ={{
    //         headerStyle:{
    //           backgroundColor: '#42c5f5',
    //         },
    //       }}
    //     />
    //     <Stack.Screen 
    //       name="Details" 
    //       component={Details} 
    //     />
    //     <Stack.Screen 
    //       name="Camera" 
    //       component={Camera} 
    //     />
    //   </Stack.Navigator>
    // </NavigationContainer> 
    <Navigator />
  );
}