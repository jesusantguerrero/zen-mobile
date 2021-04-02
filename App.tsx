import "react-native-gesture-handler"
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LoginScreen, RegistrationScreen, ZenboardScreen, MatrixScreen, MetricsScreen, HomeScreen } from "./screens";
// 
import TabBarIcon from "./components/TabBarIcon";
import TabBarIconSpecial from "./components/TabBarIconSpecial";
import { decode, encode } from "base-64";
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
import { firebase } from "./utils/useFirebase";

const Tab = createBottomTabNavigator();


export default function App() {
  const [mode, setMode] = useState('zen');
  const [isLoading, setIsLoading ] = useState(true);
  const [user, setUser] = useState(null); 

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

  if (isLoading) {	
    return (	
      <></>	
    )	
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
          tabBarOptions={{
            showLabel: false,
            style: {
              bottom: 0,
              height: 60
            }
          }}
      >
        { user ? (
          <>
            <Tab.Screen name="Zenboard" options={{
                tabBarIcon: (props) => <TabBarIcon {...props} icon="clock" label="Zen"></TabBarIcon>
            }}
            >
              { props => <ZenboardScreen {...props} extraData={user}></ZenboardScreen>}
            </Tab.Screen>
            <Tab.Screen name="Home" options={{
              tabBarIcon: (props) => <TabBarIcon {...props} icon="home" label="Overview"></TabBarIcon>
            }}>
              { props => <HomeScreen {...props} extraData={user}></HomeScreen>}
            </Tab.Screen>
            <Tab.Screen name="newItem" options={{
                tabBarIcon: (props) => <TabBarIconSpecial {...props} icon="plus"></TabBarIconSpecial>
            }}>
              { props => <ZenboardScreen {...props} extraData={user}></ZenboardScreen>}
            </Tab.Screen>
            <Tab.Screen name="Matrix" options={{
                tabBarIcon: (props) => <TabBarIcon {...props} icon="border-all" label="Matrix"></TabBarIcon>
            }}>
              { props => <MatrixScreen {...props} extraData={user}></MatrixScreen>}
            </Tab.Screen>
            <Tab.Screen name="Metrics" options={{
                tabBarIcon: (props) => <TabBarIcon {...props} icon="chart-line" label="Metrics"></TabBarIcon>
            }}>
              { props => <MetricsScreen {...props} extraData={user}></MetricsScreen>}
            </Tab.Screen>
          </>
        ) : (
          <>
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Tab.Navigator>
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
