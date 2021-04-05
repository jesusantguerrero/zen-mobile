import React, { useState, useEffect, createContext } from 'react';
import { Button, StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { createBottomTabNavigator,BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import { SIZES, FONTS, COLORS } from "../config/constants";

import {  ZenboardScreen, MatrixScreen, MetricsScreen, HomeScreen } from "../screens";
import TabBarIcon from "../components/TabBarIcon";
import TabBarIconSpecial from "../components/TabBarIconSpecial";
import { createStackNavigator } from '@react-navigation/stack';
import { logout } from "../utils/useFirebase";
import AuthContext from "../utils/AuthContext";

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

export default function HomeNavigator({ user }) {
    function ModalScreen({ navigation }) {
        return (
            <View>
                <View style={{ 
                    flex: 1, 
                    justifyContent: "space-between", 
                    flexDirection: "row", 
                    width: "100%", 
                    padding: SIZES.padding
                }}>
                    <Text style={{...FONTS.brand, color: '#333'}}>Zen.</Text>
                    <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        backgroundColor: 'red',
                        borderRadius: 35,
                        height: 40,
                        width: 40,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    > 
                      <FontAwesome5 name='times' key="times" size={16} color='white'></FontAwesome5>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                    <Pressable 
                      style={{ backgroundColor: 'red', width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }} 
                      onPress={() => logout()}>
                      <Text style={{ ...FONTS.h2 }}> Logout </Text>
                    </Pressable>
                </View>
            </View>
        );
    }
    function MainStackScreen () {
      return (
        <AuthContext.Provider value={{ extraData: user }}>
          <Tab.Navigator
              tabBar={(props: BottomTabBarProps) => (
                <BlurView
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTopLeftRadius: 14,
                    borderTopRightRadius: 14
                  }}
                  tint="dark"
                  intensity={100}
              >
                <BottomTabBar {...props} />
              </BlurView>
              )
            }
            tabBarOptions={{
              showLabel: false,
              style: {
                bottom: 0,
                height: 60,
                borderTopWidth: 0,
                borderTopColor: '#666666',
                backgroundColor: 'transparent',
                elevation: 0
              }
            }}
        >
              <Tab.Screen 
                name="Zenboard" 
                options={{
                  tabBarIcon: (props) => <TabBarIcon {...props} icon="clock" label="Zen"></TabBarIcon>
                }}
                component={ZenboardScreen}
              />
              <Tab.Screen 
                name="Home" 
                options={{
                  tabBarIcon: (props) => <TabBarIcon {...props} icon="history" label="Standup"></TabBarIcon>
                }}
                component={HomeScreen}
              />
              <Tab.Screen 
                name="newItem" 
                options={{
                  tabBarIcon: (props) => <TabBarIconSpecial {...props} icon="plus" label=''></TabBarIconSpecial>
                }}
                component={ZenboardScreen} />
              <Tab.Screen 
                name="Matrix" 
                options={{
                  tabBarIcon: (props) => <TabBarIcon {...props} icon="border-all" label="Matrix"></TabBarIcon>
              }}
                component={MatrixScreen}
              />
              <Tab.Screen 
                name="Metrics" 
                options={{
                  tabBarIcon: (props) => <TabBarIcon {...props} icon="chart-line" label="Metrics"></TabBarIcon>
                }}
                component={MetricsScreen}
              />
        </Tab.Navigator>
      </AuthContext.Provider>
      )}
            
      return (
        <RootStack.Navigator mode='modal'>
            <RootStack.Screen name='main' component={MainStackScreen} options={{ headerShown: false}}></RootStack.Screen>
            <RootStack.Screen name='MyModal' component={ModalScreen}  options={{ headerShown: false}}></RootStack.Screen>
        </RootStack.Navigator>
      )
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