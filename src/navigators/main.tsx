import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator,BottomTabBar, BottomTabBarProps, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BlurView } from 'expo-blur';
import {  ZenboardScreen, MatrixScreen, MetricsScreen, HomeScreen } from "../screens";
import TabBarIcon from "../components/TabBarIcon";
import TabBarIconSpecial from "../components/TabBarIconSpecial";
import QuickAdd from "../components/QuickAdd";
import AuthContext from '../utils/AuthContext';
import { BackHandler } from 'react-native';
const Tab = createBottomTabNavigator<MainStackParamList>();

export default function MainStackScreen() {
    const [showQuickTask, setShowQuickTask] = useState(false);
    const { extraData } = useContext(AuthContext);

    useEffect(() => {
      const backAction = () => {
        console.log('here we are')
        if (showQuickTask) {
          setShowQuickTask(false)
        }
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, []);

    return (
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
              { showQuickTask ?  
              <QuickAdd onSave={() => { setShowQuickTask(false)}} onCancel={() => { setShowQuickTask(false)}} user={extraData}/> :
              <BottomTabBar {...props} />
            }
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
              name="NewItem" 
              options={{
                tabBarButton: (props) => <TabBarIconSpecial {...props} icon="plus" onPress={() => setShowQuickTask(true)}></TabBarIconSpecial>
              }}
              component={MatrixScreen} />
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
    )
}

export type MainStackParamList = {
  Zenboard: undefined,
  Home: undefined,
  NewItem: undefined,
  Metrics: undefined,
  Matrix: undefined,
}

type ZenboardScreenNavigationProp = BottomTabNavigationProp<MainStackParamList,'Zenboard'>;

export type ZenboardScreenProps = {
  navigation: ZenboardScreenNavigationProp
}