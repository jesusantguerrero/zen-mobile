import React, { useState, useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
// 
import { LoginScreen, RegistrationScreen, ZenboardScreen, MatrixScreen, MetricsScreen, HomeScreen } from "../screens";
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
