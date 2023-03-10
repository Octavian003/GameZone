import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, 
    TouchableWithoutFeedback, Keyboard, Alert, TextInput, BackHandler,Switch} from "react-native";
import Card from "../shared/Card";
import FloatingButton from "../shared/FloatingButton";
import { MaterialIcons } from '@expo/vector-icons'
import ReviewForm from "./ReviewForm";
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from '@expo/vector-icons';
import { Dialog } from 'react-native-simple-dialogs';
import { globoStyle } from "../styles/global";
import BottomSheet from "react-native-easy-bottomsheet";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: false,
//       shouldSetBadge: false,
//     }),
// });

export default function Home({ navigation }) {
    const name = navigation.state.params && navigation.state.params.name ? navigation.state.params.name : undefined;
    const [backHandlerEvent, setBackHandlerEvent ] = useState(true)
    const backAction = () => {
        BackHandler.exitApp()
        return true;
    };

    const keepEvent = () => {
        setBackHandlerEvent(true)
    }

    const removeEvent = () => {
        setBackHandlerEvent(false)
    }
    
    useEffect(() => {
        if(backHandlerEvent){
            BackHandler.addEventListener("hardwareBackPress", backAction);
        }else{
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        }
        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backHandlerEvent]);

    const [modalOpen, setModalOpen] = useState(false)
    const [copyKey, setCopyKey] = useState(null);
    const [displayClose, setDisplayClose] = useState(true);
    const [navigationState, setNavigationState] = useState(true)
    const setModal = () => {
        setModalOpen(!modalOpen)
        cancelHandler()
    }

    const [reviews, setReviews] = useState([])

    const [initialValue, setInitialValue] = useState({
        title: '',
        body: '',
        rating: '',
        key: ''
    })

    const addReviewData = async (value) => {
        try {
            let review = await AsyncStorage.getItem('userReviews');
            review = JSON.parse(review);
            let id = await AsyncStorage.getItem('userLogged')
            id = JSON.parse(id)

            value.key = Math.random()
            value.id = id

            review.unshift(value)
            setModalOpen(false);

            await AsyncStorage.setItem('userReviews', JSON.stringify(review))
            reviewsData();
        } catch (error) {
            console.log(error)
        }
    }
    
    const deleteReviewData = async (key) => {
        try {
            let review = await AsyncStorage.getItem('userReviews');
            review = JSON.parse(review);

            let reviews = review.findIndex(review => review.key == key)
            review.splice(reviews, 1);

            await AsyncStorage.setItem('userReviews', JSON.stringify(review))
            reviewsData();
        } catch (error) {
            console.log(error)
        }
    }

    const editHandler = (key) => {
        let review = reviews.find(review => review.key == key)
        setInitialValue({
            title: review.title,
            body: review.body,
            rating: review.rating,
            key: review.key
        })
        setCopyKey(key)
        setDisplayClose(false)
        setModalOpen(true);
    }

    const cancelHandler = () => {
        setInitialValue({
            title: '',
            body: '',
            rating: '',
            key: ''
        })
        setDisplayClose(true)
    }

    const editReviewData = async (value) => {
        try {
            let reviews = await AsyncStorage.getItem('userReviews')
            reviews = JSON.parse(reviews)

            let review = reviews.find(review => review.key == copyKey)
            review.title = value.title
            review.body = value.body
            review.rating = value.rating
            setInitialValue({
                title: '',
                body: '',
                rating: '',
                key: ''
            })
            setModalOpen(false)
            setDisplayClose(true)

            await AsyncStorage.setItem('userReviews', JSON.stringify(reviews))
            reviewsData();
        } catch (error) {
            console.log(error)
        }
    }

    const modalOpenEvent = () => {
        setNavigationState(true)
        keepEvent()
    }

    const navigationRestricted = (item) =>{
        if(!modalOpen) {
            navigation.navigate('Details', {item})
            setNavigationState(false)
        }
    }

    const editHandlerRestricted = (key) => {
        if(navigationState){
            editHandler(key)
        }
    }

    const deleteUser = async () => {
        try {
            let users = await AsyncStorage.getItem('userData');
            let id = await AsyncStorage.getItem('userLogged')
            let reviews = await AsyncStorage.getItem('userReviews')
            let pictures = await AsyncStorage.getItem('pictures')
            pictures = JSON.parse(pictures)
            reviews = JSON.parse(reviews)
            id = JSON.parse(id)
            users = JSON.parse(users);

            let index = users.findIndex(user => user.id == id)
            users.splice(index, 1);

            if(reviews){
                let review = reviews.filter(review => review.id != id)
                await AsyncStorage.setItem('userReviews', JSON.stringify(review))
            }

            if(pictures){
                let picture = pictures.filter(picture => picture.userId != id)
                await AsyncStorage.setItem('pictures', JSON.stringify(picture))
            }

            // await AsyncStorage.setItem('userReviews', JSON.stringify(reviews))
            await AsyncStorage.setItem('userData', JSON.stringify(users))
            navigation.navigate('Login')
        } catch(e) {
            console.log(e)
        }
      }

    const reviewsData = async () => {
        try {
            let reviews= await AsyncStorage.getItem('userReviews');
            let id = await AsyncStorage.getItem('userLogged')
            id = JSON.parse(id)
            reviews = JSON.parse(reviews);

            let rev=[];

            reviews.forEach(review => {
                if(review.id == id){
                    rev.push(review);
                }   
            });

            setReviews(rev)
            await AsyncStorage.setItem('userReviews', JSON.stringify(reviews))
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {  
        let abortController = new AbortController();  
        reviewsData();
        return () => {  
            abortController.abort();  
        }  
    }, []);

        const confrimDialogDelete = (item) => {
            Alert.alert(
                "Confirm Dialog",
                "are you sure you want to delete this review?",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  { 
                    text: "OK", 
                    onPress: () => deleteReviewData(item)
                  }
                ]
            );
        }

        const dissconectUserValidation = () => {
            Alert.alert(
                "Confirm Dialog",
                "are you sure you want to dissconect",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    { 
                        text: "OK", 
                        onPress: () =>  dissconect()
                    }
                ]
            );
        }

        const dissconect = () =>{
            setVisible(!isVisible)
            navigation.navigate('Login')
        }
        
        const [showDialog, setShowDialog] = useState(false)
        const [deleteInput, setDeleteInput] = useState('')
        const changeHandler = (val) => {
            setDeleteInput(val)
            setMessage('')
        }

        const deleteUserConfirmation = async () => {
            try {
                let users = await AsyncStorage.getItem('userData');
                let id = await AsyncStorage.getItem('userLogged')
                id = JSON.parse(id)
                users = JSON.parse(users);
                let user = users.find(user => user.id == id)
                if(user.password == deleteInput){
                    setShowDialog(!showDialog)
                    setVisible(!isVisible)
                    deleteUser()
                }else{
                    setMessage('Password is incorrect')
                }
            } catch (error) {
                console.log(error)
            }
        }

        const [isVisible, setVisible] = useState(false);
        const [message, setMessage] = useState('') 
        const [type, setType] = useState(true);
        const visibility = () => {
            setType(!type)
        }

        // const [expoPushToken, setExpoPushToken] = useState('');
        // const [notification, setNotification] = useState(false);
        // const notificationListener = useRef();
        // const responseListener = useRef();
        // const [isEnabled, setIsEnabled] = useState()
    
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
    
        // const schedulePushNotification = async ()=> {
        //     try {
        //         let identifier = await Notifications.scheduleNotificationAsync({
        //             content: {
        //                 title: "You've got mail! 📬",
        //                 body: 'Hello Tibi',
        //                 data: { screen: 'Login' },
        //             },
        //             trigger: { 
        //                 seconds: 5,
        //                 repeats: true 
        //             },
        //         })
        //         await AsyncStorage.setItem('identifier', JSON.stringify(identifier))
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
    
        // const cancelSchedulePushNotification = async () => {
        //     try {
        //         let identifier = await AsyncStorage.getItem('identifier')
        //         identifier = JSON.parse(identifier)
        //         await Notifications.cancelScheduledNotificationAsync(identifier)
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
    
        // const toggleNotification = () => {
        //     if(!isEnabled){
        //         schedulePushNotification()
        //     }else(
        //         cancelSchedulePushNotification()
        //     )
        // }
    
        // useEffect(()=> {
        //     (async ()=> {
        //         try {
        //             let appreciation = await AsyncStorage.getItem('appreciation')
        //             if(!appreciation){
        //                 appreciation = JSON.stringify(false)
        //             }
        //             appreciation = JSON.parse(appreciation)
        //             setIsEnabled(appreciation)
        //         } catch (error) {
        //             console.log(error)
        //         }
        //     })()
        // },[])
    
        // useEffect(() => {
        //     (async ()=> {
        //         try {
        //             if(isEnabled != undefined)
        //                 await AsyncStorage.setItem('appreciation', JSON.stringify(isEnabled))
        //         } catch (error) {
        //             console.log(error)
        //         }
        //     })()
        // }, [isEnabled])

    return (
        <View style = {styles.container}>
            <NavigationEvents
                onWillFocus={modalOpenEvent}
                onWillBlur={removeEvent}
            />

            <Modal 
                visible = {modalOpen} 
                animationType = 'slide'
                style={{height: 100}}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style = {styles.modalContent}>
                        <ReviewForm initialValue={initialValue} cancelHandler={cancelHandler} editReviewData={editReviewData}
                            displayClose={displayClose} reviews={reviews} addReviewData={addReviewData}/>
                        <FloatingButton 
                            name='close'
                            onPress={setModal}
                            styleButton={styles.button1}
                            listenKeyboard={true}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Text style={{fontSize: 30, textAlign: 'center', fontFamily: 'nunito-extraBold'}}>Hello, {name}!</Text>
            <Text style={{fontSize: 20, textAlign: 'center', fontFamily: 'nunito-bold'}}>Add reviews!</Text>

            <FlatList 
                data={reviews}
                contentContainerStyle={{paddingVertical: 20, paddingHorizontal: 10}}
                renderItem = {({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigationRestricted(item) }
                    >
                        <Card>
                            <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style = {styles.item}>{ item.title }</Text>
                                <View style = {{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => editHandlerRestricted(item.key)}
                                    >
                                        <MaterialIcons name="edit" size={24} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style = {{ marginLeft: 10 }}
                                        onPress={() => confrimDialogDelete(item.key)}
                                    >
                                        <MaterialIcons name="delete" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                style={styles.menu}
                onPress={() => setVisible(!isVisible)}
            >
                <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>

            <Dialog
                visible={showDialog}
                title="Confirm Dialog"
                animationType='fade'
                buttons={
                    <View style={{flexDirection:'row', justifyContent: 'flex-end'}}>
                        <View style={{padding:10, width: '30%'}}>
                            <TouchableOpacity
                                onPress={() => setShowDialog(!showDialog)}
                            >
                                <Text style={{fontFamily:'nunito-extraBold', fontSize: 15, textAlign:'center'}}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{padding:10, width: '30%'}}>
                            <TouchableOpacity
                                onPress={deleteUserConfirmation}
                            >
                                <Text style={{fontFamily:'nunito-extraBold', fontSize: 15, textAlign:'center'}}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            >
                <View>
                    <Text>Are you sure you want to delete your account?</Text>
                    <Text>Write your password for validation!</Text>
                    <Text style={globoStyle.errorText}>{message}</Text>
                    <View style = {styles.password}>
                        <TextInput
                            style={ [globoStyle.input, {width:'100%', borderColor: 'black', padding: 8} ]}
                            placeholder="Confirm"
                            onChangeText={changeHandler}
                            value={deleteInput}
                            autoCapitalize="none"
                            secureTextEntry={type}
                        />
                        <TouchableOpacity
                            onPress={() =>visibility()} 
                            style={styles.visible}
                        >
                            <MaterialIcons name="visibility" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>

            <BottomSheet
                bottomSheetTitle={"Settings"}
                bottomSheetIconColor="#0A2463"
                bottomSheetStyle={{
                    backgroundColor: "white",
                    maxHeight: "30%",
                    minHeight: "30%",   
                }}
                bottomSheetTitleStyle={{color: '#0A2463'}}
                setBottomSheetVisible={setVisible}
                bottomSheetVisible={isVisible}
            >
                <View style={{paddingTop: 10}}>
                    <TouchableOpacity
                        onPress={() => setShowDialog(!showDialog)}
                    >   
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <AntDesign name="delete" size={22} color="black"/>
                            <Text style={{fontFamily: 'nunito-medium', fontSize: 16, paddingLeft: 40}}>Delete User</Text>
                        </View>        
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={dissconectUserValidation}
                    >
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <MaterialCommunityIcons name="exit-run" size={24} color="black" />
                            <Text style={{fontFamily: 'nunito-medium', fontSize: 16, paddingLeft: 40}}>Disconnect</Text>
                        </View>
                    </TouchableOpacity>

                    <View
                        style={{
                            borderBottomColor: '#2222',
                            borderBottomWidth: 1,
                        }}
                    /> 

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15}}>
                        <Text style={{fontFamily: 'nunito-medium', fontSize: 16}}>Push Notifications</Text>
                        {/* <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "#0096fa" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setIsEnabled(state => !state)}
                            value={isEnabled}
                            onChange={toggleNotification}
                            style = {{height:25, marginLeft: 10}}
                        /> */}
                    </View>
                </View>
            </BottomSheet>

            <FloatingButton 
                name='plus'
                // size={55}
                // bottom = {40}
                // right ={40}
                // color='#1253bc'
                onPress={setModal}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20, 
    },
    item: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalToggle: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#9999',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center'
    },
    modalClose: {
        marginTop: 20,
        marginBottom: 0,
    },
    modalContent: {
        flex: 1,
    },
    itemMenu: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        padding: 10,
        textAlign:'center',
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 'auto',
    },
    button: {
        borderRadius: 0,
    },
    menu: {
        position: 'absolute',
        top: -35,
        right: 15,
        zIndex: 100,
    },
    dots: {
        backgroundColor: 'transparent',
        borderRadius: 100,
        width: 25,
        height: 25,
    },
    item1: {
        borderBottomColor: '#1111',
        borderBottomWidth: 1,
        padding: 10,
    },
    item2: {
        padding: 10,
    },
    password: {
        flexDirection: 'row',
        alignItems:'center'
    },
    visible: {
        position: 'absolute',
        right: 10
    },
})