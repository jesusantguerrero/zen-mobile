import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, Platform, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { login, firebase } from "../../utils/useFirebase";
import * as GoogleSignIn from 'expo-google-sign-in';
import * as WebBrowser from "expo-web-browser"
import * as Google from 'expo-auth-session/providers/google';
import { WEB_CLIENT_ID } from '../../utils/keys';
import { FontAwesome5 } from "@expo/vector-icons"
import styles from './styles';
import auth from '@react-native-firebase/auth';
import { images } from "../../config/constants";
import { LoginScreenProps } from '../../navigators/auth';


WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({navigation}: LoginScreenProps) {
    const [email, setEmail] = useState('')
    const [loadingMethod, setLoadingMethod] = useState('')
    const [password, setPassword] = useState('')

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '505825563328-ramcmqea4jn66ounj5hgd0kflppdtmmo.apps.googleusercontent.com',
        androidClientId: WEB_CLIENT_ID,
        webClientId: WEB_CLIENT_ID
    })

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = () => {
        if (loadingMethod || !email || !password) {
            return
        }
        setLoadingMethod('email')
        login(email, password)
            .then(({ user }) => {
                setLoadingMethod('')
            }).catch(err => {
                setLoadingMethod('')
                ToastAndroid.show(err.toString(), ToastAndroid.LONG)
            })
      
    }

    const onLoginCustomPressNative = async() => {
        if (loadingMethod) {
            return
        }
        setLoadingMethod('google')
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user } = await GoogleSignIn.signInAsync();

            if (type === 'success') {
                const accessToken  = user?.auth?.accessToken
                const idToken =  user?.auth?.idToken
                if (idToken || accessToken) {
                    signWithFirebase(idToken, accessToken);
                }
              } else {
                  ToastAndroid.showWithGravity("Ha ocurrido un error al loguearse", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                  ToastAndroid.showWithGravity("Ha ocurrido un error al loguearse", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                }
            } catch (error) {
                setLoadingMethod('')
                ToastAndroid.showWithGravity("Ha ocurrido un error al loguearse..."  + error.toString(), ToastAndroid.LONG, ToastAndroid.BOTTOM)
        }
    }

    const signWithFirebase = async(idToken: string = '', accessToken: string = '') => {
        try  {
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)
            await firebase.auth().signInWithCredential(credential)
            ToastAndroid.showWithGravity("Logueado bien", ToastAndroid.LONG, ToastAndroid.BOTTOM)
        } catch (e) {
             // Create a Google credential with the token
            ToastAndroid.showWithGravity("Logueado mal" + e.toString(), ToastAndroid.LONG, ToastAndroid.BOTTOM)
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // Sign-in the user with the credential
            auth().signInWithCredential(googleCredential);
            ToastAndroid.showWithGravity("Logueado bien", ToastAndroid.LONG, ToastAndroid.BOTTOM)
        }

    }

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.state) {
                signWithFirebase(authentication?.state, authentication?.accessToken)
            }
        }
    }, [response])

    useEffect(() => {
        if (Platform.OS == 'android') {
            GoogleSignIn.initAsync()
        }
    }, [])

    return (
        <ImageBackground source={images.zenTemple} style={styles.container}>
            <View style={{width: '100%', height: '100%', backgroundColor:'rgb(58, 74, 115)',  opacity: .85, marginBottom: 15, position: 'absolute'}} />
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%'}}
                keyboardShouldPersistTaps="always">
                        <Image
                            style={styles.logo}
                            source={require('../../assets/logo.png')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='E-mail'
                            placeholderTextColor="#aaaaaa"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#aaaaaa"
                            secureTextEntry
                            placeholder='Password'
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            disabled={!!loadingMethod}
                            onPress={() => onLoginPress()}>
                            <Text style={styles.buttonTitle}>Login</Text>
                            { loadingMethod != 'email' ? null : (<View style={{ marginLeft: 5}}>
                                <FontAwesome5 name='spinner' color='white'></FontAwesome5>
                            </View>)}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.googleButton}
                            disabled={!!loadingMethod}
                            onPress={() => Platform.OS == 'android' ? onLoginCustomPressNative() : promptAsync()}>
                            <Text style={styles.buttonTitle}>Login with Google</Text>
                            { loadingMethod != 'google' ? null : (<View style={{ marginLeft: 5}}>
                                <FontAwesome5 name='spinner' color='white'></FontAwesome5>
                            </View>)}
                        </TouchableOpacity>
                        <View style={styles.footerView}>
                            <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                        </View>
            </KeyboardAwareScrollView>
        </ImageBackground>
    )
}
