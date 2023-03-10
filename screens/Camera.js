import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image} from 'react-native';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App({ navigation }) {
    const key = navigation.state.params && navigation.state.params.key ? navigation.state.params.key : undefined;

    const [type, setType] = useState(CameraType.back);
    let cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [photo, setPhoto] = useState();
  
    useEffect(() => {
      (async () => {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === "granted");
        setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      })();
    }, []);
  
    if (hasCameraPermission === undefined) {
      return <Text>Requesting permissions...</Text>
    } else if (!hasCameraPermission) {
      return <Text>Permission for camera not granted. Please change this in settings.</Text>
    }
  
    let takePic = async () => {
        let options = {
            quality: 0.5, 
            base64: true, 
            mirrorImage: true,
            // aspect: [4, 3]
        };
  
        let newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto.uri);
    };

    const done = async () => {
        let pictures = await AsyncStorage.getItem('pictures')
        let id = await AsyncStorage.getItem('userLogged')
        id = JSON.parse(id) 

        if(!pictures){
            pictures = JSON.stringify([])
        }

        pictures = JSON.parse(pictures)

        var picture = {
            uri: photo,
            reviewsKey: key,
            key: Math.random(),
            userId: id
        }

        pictures.push(picture)

        await AsyncStorage.setItem('pictures', JSON.stringify(pictures))
        navigation.navigate('Details')
    }
  
    if (photo) {
        let sharePic = () => {
            shareAsync(photo)
        };
    
        let savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo).then(() => {
                setPhoto(undefined);
            });
        };

        return (
            <SafeAreaView style={{flex: 1}}>
            <Image style={styles.preview} source={{ uri: photo }} />
            <View style={styles.containerBtn}>
                <TouchableOpacity 
                    onPress={sharePic}
                >
                    <Text style = {styles.button}>Share</Text>
                </TouchableOpacity>
                {hasMediaLibraryPermission 
                ? 
                    <TouchableOpacity 
                        onPress={savePhoto}
                    >
                        <Text style = {styles.button}>Save</Text>
                    </TouchableOpacity>
                : 
                    undefined
                }
                <TouchableOpacity 
                    onPress={() => setPhoto(undefined)}
                >
                    <Text style = {styles.button}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={done}
                >
                    <Text style = {styles.button}>DONE</Text>
                </TouchableOpacity>
            </View>
            </SafeAreaView>
        );
    }      
    
    function toggleCameraType() {
        setType((current) => (
            current === CameraType.back ? CameraType.front : CameraType.back
        ));
    }
  
    return (
        <View style={{flex: 1}} >
            <View style={styles.containerCamera}>
                <Camera
                    type={type}
                    style={styles.camera}
                    ref={cameraRef}
                    ratio={'1 : 1'}
                    pictureSize='1080'
                />  
            </View>
              
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleCameraType}>
                    <Text style = {styles.button}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePic}>
                    <Text style = {styles.button}>Picture</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    containerCamera: {
        flex: 1,
        // flexDirection: 'row'
    },
    camera: {
        // flex: 1,
        aspectRatio: 1
    },
    containerBtn:{
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    preview: {
        // flex: 1,
        aspectRatio: 1
    },
    button: {
        fontSize: 20
    }
  });