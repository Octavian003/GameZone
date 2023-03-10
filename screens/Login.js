import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ToastAndroid, StatusBar, Switch} from "react-native";
import { globoStyle } from "../styles/global";
import FlatButton from "../shared/Button";
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from "formik";
import Footer from "../shared/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationEvents } from 'react-navigation';

export default function Login({ navigation }){

    const value = navigation.state.params && navigation.state.params.value ? navigation.state.params.value : undefined;
    const [type, setType] = useState(true);
    const visibility = () => {
            setType(!type)
    }
    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT, 
            ToastAndroid.TOP,
            0,
            50
        );
    };    

    const getData = async (values) => {
        try{
            let users = await AsyncStorage.getItem('userData')
                if(users){
                    users = JSON.parse(users);
                    let found = false;
                    let i;
                    for(i = 0; i < users.length; i++){
                        if(users[i].name == values.userName && users[i].password == values.password){
                            found = true;
                            break;
                        }
                    }
                    if(found){
                        navigation.navigate('Home', {name: values.userName});
                        await AsyncStorage.setItem('userLogged', JSON.stringify(users[i].id))
                    }else{
                        showToast("Username or password it's incorrect!");
                    }
                }
                // await AsyncStorage.setItem('userData', JSON.stringify(users))
        } catch(e) {
            console.log(e);
        }
      }

    const getEntries = async () => {
        const keys = await AsyncStorage.getAllKeys();
        const entries = await AsyncStorage.multiGet(keys);
        console.log(entries);
    };

    const login = (values) => {
        getData(values);
        // getEntries();
    }

    const exit = async () => {
        try {
            await AsyncStorage.setItem('userLogged', '')
            // getEntries();
        } catch (error) {
            console.log()
        }
    }

    // const deleteReview = async () => {
    //     try {
    //         await AsyncStorage.removeItem('pictures');
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     deleteReview()
    // })

    useEffect(() => {
        if(value == 'true'){
            showToast('Account was created!')
        }
    })

    return (
        <View 
            style={{flex: 1, backgroundColor: '#42c5f5'}} 
        >
            <StatusBar 
                backgroundColor='black'
                barStyle='light-content'
                // translucent={true}
            />
            <NavigationEvents
                onWillFocus={exit}
            />
            <View style={styles.container}>
                {/* <ScrollView
                    contentContainerStyle={{backgroundColor: 'pink'}}
                > */}
                    <View style={styles.paragraf}>
                        <Text style={{fontSize:30, paddingLeft:40, fontFamily:'nunito-bold'}}>Sign In</Text>
                        <Text style={{paddingLeft:80, fontFamily:'nunito-medium'}}>to create Reviews</Text>
                        <Text style={{paddingLeft:120, fontFamily:'nunito-medium'}}>for all your favorite<Text style={{fontFamily:'nunito-bold'}}> GAME</Text></Text>
                    </View>
                    <Formik
                        initialValues={{userName: '', password: ''}}
                        // validationSchema={validationSchema}
                        onSubmit={(values) => {
                            login(values)
                        }}
                    >
                        {({ handleSubmit, handleChange, handleBlur, values}) => (
                            <View>
                                <TextInput 
                                    style={[globoStyle.input, {borderColor: 'black'}]}
                                    placeholder='Username'
                                    onChangeText={text => handleChange('userName')(text.trim())}
                                    value={values.userName}
                                    onBlur={handleBlur('userName')}
                                />
                                <Text></Text>

                                <View style = {styles.password}>
                                    <TextInput 
                                        style={ [globoStyle.input, {width:'100%', borderColor: 'black'} ]}
                                        placeholder='Password'
                                        onChangeText={text => handleChange('password')(text.trim())}
                                        value={values.password}
                                        onBlur={handleBlur('password')}
                                        secureTextEntry={type}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        onPress={() =>visibility()} 
                                        style={styles.visible}
                                    >
                                        {type 
                                            ? 
                                                <MaterialIcons name="visibility" size={24} color="black" />
                                            :
                                                <MaterialIcons name="visibility-off" size={24} color="black" />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <Text></Text>

                                <FlatButton 
                                    styleBtn={styles.button} 
                                    text = 'Login' 
                                    onPress={handleSubmit}
                                />
                            </View>
                        )}
                    </Formik>
                    {/* <FlatButton 
                        text= 'Allow push notifcation'
                        onPress={schedulePushNotification}
                    /> */}
                {/* </ScrollView> */}
            </View>
            <Text style={{textAlign:'center'}}>You don't have an account?</Text>
            <Footer navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 30,
        justifyContent: 'center',
        // backgroundColor: 'grey'
    },
    paragraf: {
        marginBottom:50,
    },  
    password: {
        flexDirection: 'row',
        alignItems:'center'
    },
    visible: {
        position: 'absolute',
        right: 10
    },
    button: {
        backgroundColor: '#4251f5',
    },
}) 