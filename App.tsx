import "react-native-gesture-handler"
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ZenboardScreen from "./screens/ZenboardScreen";
import LineupScreen from "./screens/LineupScreen";

const Stack = createStackNavigator();
export default function App() {
  const [mode, setMode] = useState('zen');


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Zenboard" component={ZenboardScreen} />
        <Stack.Screen name="Lineup" component={LineupScreen} options={{ title: "Line up"}} />
      </Stack.Navigator>
    </NavigationContainer>
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
