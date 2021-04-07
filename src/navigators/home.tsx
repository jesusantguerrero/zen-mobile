import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import MainStackScreen from "./main";
import SessionModal from '../screens/Modals/SessionModal';

const RootStack = createStackNavigator();

export default function HomeNavigator() {
  return (
      <RootStack.Navigator mode='modal'>
          <RootStack.Screen name='Main' component={MainStackScreen} options={{ headerShown: false}}></RootStack.Screen>
          <RootStack.Screen name='MyModal' component={SessionModal}  options={{ headerShown: false}}></RootStack.Screen>
      </RootStack.Navigator>
  )
}

export type RootStackParamList = {
  Main: undefined,
  MyModal: undefined
}

type MaincreenNavigationProp = StackNavigationProp<RootStackParamList,'Main'>;
type SessionModalNavigationProp = StackNavigationProp<RootStackParamList,'MyModal'>;

export type MainScreenProps = {
  navigation: MaincreenNavigationProp
}

export type SessionModalProps = {
  navigation: SessionModalNavigationProp
}
