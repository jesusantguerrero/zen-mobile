import "react-native-gesture-handler"
import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar"
import { AppearanceProvider } from 'react-native-appearance';
import { NavigationContainer } from "@react-navigation/native";
import { decode, encode } from "base-64";
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
import { firebase } from "./src/utils/useFirebase";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import HomeNavigator from "./src/navigators/home";
import AuthNavigator from "./src/navigators/auth";
import {useFonts, Roboto_400Regular, Roboto_900Black, Roboto_700Bold } from "@expo-google-fonts/roboto"
import AuthContext from "./src/utils/AuthContext";
import { ImageBackground, LogBox, Platform } from "react-native";
import { COLORS, images } from "./src/config/constants";

export default function App() {
  const [isLoading, setIsLoading ] = useState(true);
  const [user, setUser] = useState<firebase.User|null>(null); 
  if (Platform.OS == 'android') {
    LogBox.ignoreLogs(['Setting a timer']);
  }  
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_900Black,
    Roboto_700Bold,
    'Potta_One': require('./src/assets/fonts/PottaOne-Regular.ttf'),
  })

  useEffect(() => {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        setUser(user)
        setIsLoading(false);
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })
  }, [])


  if (!fontsLoaded || isLoading) {	
    return (	
      <></>	
    )	
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}}>
      <ImageBackground
        source={images.temple}
        style={{
          width: '100%', 
          height: '100%',
          position: 'absolute'
        }}
      />
        <StatusBar
          animated={true}
          translucent={true}
          backgroundColor='#00000088'
          style='dark'
        />
        <AuthContext.Provider value={{ extraData: user }}>
            <NavigationContainer>
                { user ? <HomeNavigator></HomeNavigator> : <AuthNavigator></AuthNavigator>}
            </NavigationContainer>
        </AuthContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}