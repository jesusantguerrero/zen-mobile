import "react-native-gesture-handler"
import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { COLORS } from "./src/config/constants"; 
import { decode, encode } from "base-64";
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
import { firebase } from "./src/utils/useFirebase";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HomeNavigator from "./src/navigators/home";
import AuthNavigator from "./src/navigators/auth";
import {useFonts, Roboto_400Regular, Roboto_900Black, Roboto_700Bold } from "@expo-google-fonts/roboto"

export default function App() {
  const [mode, setMode] = useState('zen');
  const [isLoading, setIsLoading ] = useState(true);
  const [user, setUser] = useState(null); 
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
  })

  if (!fontsLoaded || isLoading) {	
    return (	
      <></>	
    )	
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent={false}
        backgroundColor='rgba(255,255,255,1)'
        barStyle='dark-content'
      />
        <NavigationContainer>
            { user ? <HomeNavigator user={user}></HomeNavigator> : <AuthNavigator></AuthNavigator>}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    height: 20,
    width: "100%"
  },
  button: {
    width: 100,
    minWidth: "48%",
    color: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    fontSize: 36
  },
  header: {
    backgroundColor: "red",
    borderBottomColor: "#333",
    borderBottomWidth: 2,
    height: 40,
    fontSize: 24,
    width: "100%"
  }
});
