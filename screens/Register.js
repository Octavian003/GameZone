import React, {useEffect, useState} from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ToastAndroid, StatusBar, TouchableWithoutFeedback, Keyboard } from "react-native";
import { globoStyle } from "../styles/global";
import FlatButton from "../shared/Button";
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from "formik";
import * as yup from 'yup';
import AsyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = yup.object()
    .shape({
        userName: yup.string()
            .required()
            .min(4)
            .matches(/^\S*$/, 'Whitespace is not allowed'),
            // .trim(),
        email: yup.string()
            .required()
            .min(8)
            .email()
            .matches(/^\S*$/, 'Whitespace is not allowed'),
            // .trim(),
        password: yup.string()
            .required()
            .min(4)
            .matches(/^\S*$/, 'Whitespace is not allowed'),
            // .trim(),
        confirmPassword: yup.string()
            .required()
            .min(4)
            .matches(/^\S*$/, 'Whitespace is not allowed')
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
            // .trim(),
    });

export default function Register( {navigation} ){
    const [bool, setBool] = useState('mama')
    const [type, setType] = useState(true);

    const visibility = () => {
        setType(!type)
    }

    const storeData = async (value) => {
        try {
            let users = await AsyncStorage.getItem('userData');
            let review = await AsyncStorage.getItem('userReviews')

            if(review == null){
                review = []
                await AsyncStorage.setItem('userReviews', JSON.stringify(review))
            }

            if(!users) {
                users = JSON.stringify([]) ;
            }
            
            users = JSON.parse(users);

            for(let i = 0; i < users.length; i++){
                if(users[i].name == value.userName) {
                    showToast('This username already exist!');
                    return;
                }
            }

            var user = {
                name: value.userName,
                password: value.password,
                id: Date.now()
            }

            users.push(user);

            await AsyncStorage.setItem('userData', JSON.stringify(users))
            navigation.navigate('Login', {value: 'true',});
        } catch (e) {
            console.log(e)
        }
    }

    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT, 
            ToastAndroid.TOP,
            0,
            120
        );
    };  
    
    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
        >
            <View 
                style={{flex: 1, backgroundColor: '#42c5f5'}} 
            >
                <StatusBar 
                    backgroundColor='black'
                    barStyle='light-content'
                />
                <ScrollView
                    keyboardShouldPersistTaps="none"
                    indicatorStyle='black'
                >
                    <View style={styles.container}>

                        <View style={styles.paragraf}>
                            <Text style={{fontSize:20, fontFamily:'nunito-bold'}}>Register now</Text>
                            <Text style={{fontFamily:'nunito-extraBold', fontSize:30}}>AND</Text>
                            <Text style={{fontFamily:'nunito-medium'}}>start to write your reviews<Text style={{fontFamily:'nunito-bold'}}> GAME</Text></Text>
                        </View>

                        <Formik
                            initialValues={{userName: '', email:'', password: '', confirmPassword: ''}}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                storeData(values)
                            }}
                        >
                            {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                                <View>
                                    <TextInput 
                                        style={[globoStyle.input, {borderColor: 'black'}]}
                                        placeholder='Username'
                                        onChangeText={text => handleChange('userName')(text.trim())}
                                        value={values.userName}
                                        onBlur={handleBlur('userName')}
                                    />
                                    <Text style = {globoStyle.errorText}>{ touched.userName && errors.userName }</Text>

                                    <TextInput 
                                        style={[globoStyle.input, {borderColor: 'black'}]}
                                        placeholder='Email'
                                        onChangeText={text => handleChange('email')(text.trim())}
                                        value={values.email}
                                        onBlur={handleBlur('email')}
                                        textContentType="emailAddress"
                                    />
                                    <Text style = {globoStyle.errorText}>{ touched.email && errors.email }</Text>

                                    <View style = {styles.password}>
                                        <TextInput 
                                            style={ [globoStyle.input, {width:'100%', borderColor: 'black'} ]}
                                            placeholder='Password'
                                            onChangeText={text => handleChange('password')(text.trim())}
                                            value={values.password}
                                            secureTextEntry={type}
                                            autoCorrect={false}
                                            onBlur={handleBlur('password')}
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
                                    <Text style={globoStyle.errorText}>{ touched.password && errors.password }</Text>

                                    <View style = {styles.password}>
                                        <TextInput 
                                            style={ [globoStyle.input, {width:'100%', borderColor: 'black'} ]}
                                            placeholder='Confirm Password'
                                            onChangeText={text => handleChange('confirmPassword')(text.trim())}
                                            value={values.confirmPassword}
                                            secureTextEntry={type}
                                            autoCorrect={false}
                                            onBlur={handleBlur('confirmPassword')}
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
                                    <Text style={globoStyle.errorText}>{ touched.confirmPassword && errors.confirmPassword }</Text>
                                    
                                    <FlatButton styleBtn={{backgroundColor: '#4251f5'}} text = 'Register' onPress={handleSubmit}/>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        // justifyContent: 'center',
        // backgroundColor:'green'
    },
    paragraf: {
        marginBottom:50,
        alignItems: 'center'
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
        backgroundColor: '#4251f5'
    }
}) 