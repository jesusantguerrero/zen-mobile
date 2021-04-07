import React, { useState, useEffect } from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
// 
import { LoginScreen, RegistrationScreen } from "../screens";
import { decode, encode } from "base-64";
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
      <Stack.Navigator
          screenOptions={{
             headerShown: false
          }}
      >
      
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
      </Stack.Navigator>
  );
}


export type AuthStackParamList = {
    Login: undefined,
    Registration: undefined
}
  
type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList,'Login'>;
type RegistrationScreenNavigationProp = StackNavigationProp<AuthStackParamList,'Registration'>;
  
export type LoginScreenProps = {
    navigation: LoginScreenNavigationProp
}

export type RegistrationScreenProps = {
    navigation: RegistrationScreenNavigationProp
}