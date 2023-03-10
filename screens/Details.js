import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Platform, Button} from "react-native";
import Card from "../shared/Card";
import { AirbnbRating } from 'react-native-ratings';
import { FloatingAction } from "react-native-floating-action";
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationEvents } from 'react-navigation';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Divider from "../shared/Divider";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//     }),
//   });

export default function Details( { navigation } ) {
    const [statusCamera, requestPermissionCamera] = MediaLibrary.usePermissions();
    // const [doRender, setDoRender] = useState(true)
    const [image, setImage] = useState([]);
    // const [uri, setUri] = useState() 
    // reviewKey = navigation.getParam('key')
    const item = navigation.state.params && navigation.state.params.item ? navigation.state.params.item : undefined;

    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState(false);
    // const notificationListener = useRef();
    // const responseListener = useRef();

    // useEffect(() => {
    //     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
    //     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //       setNotification(notification);
    //       console.log('Notification:', notification)
    //     });
    
    //     responseListener.current = Notifications.addNotificationResponseReceivedListener( response => {
    //       navigation.navigate(response.notification.request.content.data.screen)
    //     });
    
    //     return () => {
    //       Notifications.removeNotificationSubscription(notificationListener.current);
    //       Notifications.removeNotificationSubscription(responseListener.current);
    //     };
    // }, []);

    //   async function registerForPushNotificationsAsync() {
    //     let token;
    //     if (Device.isDevice) {
    //       const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //       let finalStatus = existingStatus;
    //       if (existingStatus !== 'granted') {
    //         const { status } = await Notifications.requestPermissionsAsync();
    //         finalStatus = status;
    //       }
    //       if (finalStatus !== 'granted') {
    //         alert('Failed to get push token for push notification!');
    //         return;
    //       }
    //       token = (await Notifications.getExpoPushTokenAsync()).data;
    //       console.log(token);
    //     } else {
    //       alert('Must use physical device for Push Notifications');
    //     }
      
    //     if (Platform.OS === 'android') {
    //       await Notifications.setNotificationChannelAsync('default', {
    //         name: 'default',
    //         importance: Notifications.AndroidImportance.MAX,
    //         vibrationPattern: [0, 250, 250, 250],
    //         lightColor: '#FF231F7C',
    //       });
    //     }
    //     return token;
    //   }

    // // useEffect(() => {
    //     let response = fetch('https://exp.host/--/api/v2/push/send', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             to: 'ExponentPushToken[uyz4lVBtB386t-ycr3B7Fc]',
    //             sound: 'default',
    //             title: 'Hello Alin!',
    //             body: 'Alin baiat finut!',
    //             data: { screen: 'Login' }
    //         })
    //     })
    // }, [])

    // const sendLocalNotifications = () => {
    //     let response = fetch('https://exp.host/--/api/v2/push/send', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             to: 'ExponentPushToken[uyz4lVBtB386t-ycr3B7Fc]',
    //             sound: 'default',
    //             title: 'Hello '+ item.title + '!',
    //             body: item.title +' baiat finut!',
    //             data: { screen: 'Login' }
    //         })
    //     })
    // }
    
    // const SaveToPhone = async (item) => {
    //     // Remember, here item is a file uri which looks like this. file://..
    //     if (status.granted) {
    //       try {
    //         let asset = await MediaLibrary.createAssetAsync(item)
    //         console.log(asset)
    //         MediaLibrary.createAlbumAsync('Images', asset, false)
    //           .then(() => {
    //             console.log('File Saved Successfully!');
    //           })
    //           .catch(() => {
    //             console.log('Error In Saving File!');
    //           });
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     } else {
    //       console.log('Need Storage permission to save file');
    //       requestPermission()
    //     }
    //   };

    //   const showAlbum = async () => {
    //     const album = await MediaLibrary.getAlbumAsync('Images')
    //     await MediaLibrary.deleteAlbumsAsync(album.id, true)
    //     console.log('delete')
    //     // let albumArhive = await MediaLibrary.getAssetsAsync({album: album.id})
    //     // setUri(albumArhive.assets[0].uri)
    //     // console.log(uri)
    //   }

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            let pictures = await AsyncStorage.getItem('pictures')
            let id = await AsyncStorage.getItem('userLogged')
            id = JSON.parse(id)

            if(!pictures){
                pictures = JSON.stringify([])
            }

            pictures = JSON.parse(pictures)

            let picture = {
                uri: result.uri,
                reviewsKey: item.key,
                key: Math.random(),
                userId: id
            }

            pictures.push(picture)

            await AsyncStorage.setItem('pictures', JSON.stringify(pictures))

            setImage([...image, picture])

            // SaveToPhone(result.uri)
        }
    };

    const takeImage = async () => {
        if(statusCamera){
            let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            });
    
        
            if (!result.cancelled) {

                let pictures = await AsyncStorage.getItem('pictures')
                let id = await AsyncStorage.getItem('userLogged')
                id = JSON.parse(id) 

                if(!pictures){
                    pictures = JSON.stringify([])
                }

                pictures = JSON.parse(pictures)

                let picture = {
                    uri: result.uri,
                    reviewsKey: item.key,
                    key: Math.random(),
                    userId: id
                }

                pictures.push(picture)

                await AsyncStorage.setItem('pictures', JSON.stringify(pictures))

                setImage([...image, picture])
            }
        }
      };

    const actions = [
        {
          text: "Galerie",
          icon: <MaterialIcons name="photo-library" size={24} color="white" />,
          name: "Galerie",
          position: 1
        },
        {
          text: "Camera",
          icon: <Entypo name="camera" size={24} color="white" />,
          name: "Camera",
          position: 2
        }
      ];

      const setPhoto = async () => {
        try {
            let pictures = await AsyncStorage.getItem('pictures');

            pictures = JSON.parse(pictures)

            let picture = [];

            if(pictures){
                pictures.forEach(photo => {
                    if(photo.reviewsKey == item.key){
                        picture.push(photo)
                    }
                });
            }

            setImage(picture)
        } catch(e) {
            console.log(e)
        }
      }

    useEffect(() => {
        setPhoto()
    },[])

    // const render = ()=> {
    //     setDoRender(!doRender)
    // }

    const deletePhoto= async (key) => {
        try {
            let pictures = await AsyncStorage.getItem('pictures');
            pictures = JSON.parse(pictures);

            let picture = pictures.findIndex(picture => picture.key == key)
            pictures.splice(picture, 1);

            await AsyncStorage.setItem('pictures', JSON.stringify(pictures))
            setPhoto();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style = {styles.container}>
            {/* <NavigationEvents
                onWillFocus={render}
            /> */}
            <ScrollView>
                <Card>
                    <Text style={styles.title}>{ item.title }</Text>
                    <Text style={styles.description}>{ item.body }</Text>
                    {image.length > 0 && <Divider />}
                    {
                        image && image.map(item=>(
                            <View 
                                key={item.key}
                                style={{ width: '100%', height: 240, backgroundColor: 'pink', borderRadius: 5, marginVertical: 10 }}
                            >
                                <Image source={{ uri: item.uri }} style={{ width: '100%', height: 200, borderTopLeftRadius: 5, borderTopRightRadius: 5}} />
                                <TouchableOpacity
                                    onPress={() => deletePhoto(item.key)}
                                >
                                    <Text style = {{fontSize: 25, textAlign: 'center'}}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                    <View style = {styles.rating}>
                        <Text style={styles.ratingText}>GameZone rating: </Text>
                        <AirbnbRating
                            count={11}
                            // reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Jesus Christ"]}
                            size={15}
                            defaultRating={ item.rating }
                            isDisabled={true}
                            showRating={false}
                            reviewSize={18}
                        />
                    </View>
                </Card>
                {/* <Button
                    title="Press to schedule a notification"
                    onPress={sendLocalNotifications}
                /> */}
            </ScrollView>
            <FloatingAction
                showBackground={false}
                actions={actions}
                onPressItem={text => {
                    if(text == 'Camera'){
                        takeImage()
                        // showAlbum()
                    }else if(text == 'Galerie'){
                        pickImage()
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1
    },
    rating: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent:'center',
        paddingTop: 10,
        // marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    title: { 
        marginBottom: 10, 
        textAlign: 'center', 
        fontSize: 18,
        fontFamily: 'nunito-extraBold'
    },
    description: {
        marginBottom: 10,
        textAlign: 'justify',
        fontFamily: 'nunito-light'
    },
    ratingText:{
        fontFamily: 'nunito-light',
        textAlign: 'center'
    },
})