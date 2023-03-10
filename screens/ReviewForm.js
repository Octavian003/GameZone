import React from "react";
import { StyleSheet, TextInput, View, Text, ScrollView } from "react-native";
import FlatButton from "../shared/Button";
import { globoStyle } from "../styles/global";
import { Formik } from "formik";
import * as yup from 'yup';
import { Rating, AirbnbRating } from 'react-native-ratings';
// const WATER_IMAGE = require('../water.png')

const reviewSchema = yup.object({
    title: yup.string()
        .required()
        .min(4),
    body: yup.string()
        .required()
        .min(8),
});

export default function ReviewForm( { initialValue, displayClose, addReviewData, editReviewData } ){

    return (
        <ScrollView
            // contentContainerStyle={styles.contentContainer}
            indicatorStyle='black'
            keyboardShouldPersistTaps="handled"
        >
            <View style = {globoStyle.conainer}>
                <Formik
                    initialValues={initialValue}
                    validationSchema={reviewSchema}
                    onSubmit={(values) => {
                        if(values.key != '' && values.key > 0)
                            editReviewData(values)
                        else
                            addReviewData(values)
                    }}
                >
                    {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                        <View>
                            <TextInput 
                                style={globoStyle.input}
                                placeholder='Review title'
                                onChangeText={handleChange('title')}
                                value={values.title}
                                onBlur={handleBlur('title')}
                            />
                            <Text style = {globoStyle.errorText}>{ touched.title && errors.title }</Text>

                            <TextInput 
                                multiline
                                numberOfLines={5}
                                style={globoStyle.input}
                                placeholder='Review body'
                                onChangeText={handleChange('body')}
                                value={values.body}
                                onBlur={handleBlur('body')}
                            />
                            <Text style={globoStyle.errorText}>{ touched.body && errors.body }</Text>
                            {/* 
                            <TextInput 
                                style={globoStyle.input}
                                placeholder='Rating (1-5)'
                                onChangeText={handleChange('rating')}
                                value={values.rating}
                                onBlur={handleBlur('rating')}
                                keyboardType='numeric'
                            />
                            <Text style = {globoStyle.errorText}>{ touched.rating && errors.rating }</Text> */}

                            <AirbnbRating
                                count={11}
                                reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Jesus Christ"]}
                                size={18}
                                reviewSize={18}
                                defaultRating={values.rating}
                                ratingContainerStyle={[globoStyle.input, {marginBottom: 30}]}
                                onFinishRating={(count) => {
                                    values.rating = count;
                                }}
                             />

                            {displayClose && 
                                <FlatButton text = 'submit' onPress={handleSubmit}/>
                            }
                            {!displayClose && 
                                <FlatButton text = 'edit' onPress={handleSubmit}/>
                            }                        
                        </View>
                    )}
                </Formik>        
            </View>
        </ScrollView>
    )
}