import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { login, loginWithProvider, firebase } from "../../utils/useFirebase";
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Google from 'expo-google-app-auth';
import { WEB_CLIENT_ID } from '../../utils/keys';
import styles from './styles';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const configureGoogleSign = async () => {
        await GoogleSignIn.initAsync({
            clientId: WEB_CLIENT_ID
        });
        await GoogleSignIn.signInSilentlyAsync();
    }

    const onLoginPress = () => {
        login(email, password).then(({ user }) => {
            navigation.navigate('Zenboard', {user: user})
        })
    }

    const onLoginCustomPressL = async() => {
        try {
            const { type, user } = await GoogleSignIn.signInAsync();

            if (type === 'success') {
                const accessToken  = user?.auth?.accessToken
                const idToken =  user?.auth?.idToken
                const credential = firebase.auth().GoogleAuthProvider.credential(idToken, accessToken)
                await firebase.auth().signInWithCredential(credential)
              } else {
                return alert('error');
              }
        } catch (error) {
            console.log('Something else went wrong... ', error.toString())
        }
    }

    const onLoginCustomPress = async() => {
            try {
                const result = await Google.logInAsync({
                    // androidStandaloneAppClientId: WEB_CLIENT_ID,
                    clientId: WEB_CLIENT_ID,
                    androidClientId: WEB_CLIENT_ID,
                });

                if (result.type === 'success') {
                    const accessToken  = result.accessToken
                    const idToken =  result.idToken
                    const credential = firebase.auth().GoogleAuthProvider.credential(idToken, accessToken)
                    await firebase.auth().signInWithCredential(credential)
                  } else {
                    return alert('error');
                  }
            } catch (error) {
                console.log('Something else went wrong... ', error.toString())
            }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
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
                    style={styles.googleButton}
                    onPress={() => onLoginCustomPress()}>
                    <Text style={styles.buttonTitle}>Login with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Login</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}