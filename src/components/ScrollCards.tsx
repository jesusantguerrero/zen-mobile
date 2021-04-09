import React, { useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, Animated, TouchableOpacity, I18nManager, Button } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES } from '../config/constants';
const { width: windowWidth } = Dimensions.get("window");

const LeftActions = (drag: Animated.AnimatedInterpolation, onPress) => {
  const scale = drag.interpolate && drag.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <RectButton style={styles.leftAction} onPress={onPress}>
      <Animated.View style={[styles.actionIcon,  { transform: [{ scale }]}]}>
        <FontAwesome5  name="check-circle" size={32} color="white"></FontAwesome5>
      </Animated.View>
    </RectButton>
  );
};

const RightActions = (drag: Animated.AnimatedInterpolation, onPress) => {
  const scale = drag.interpolate && drag.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <RectButton style={styles.rightAction} onPress={onPress}>
      <Animated.View style={[styles.actionIcon, { transform: [{ scale }]}]}>
      <FontAwesome5  name="trash" size={32} color="white"></FontAwesome5>
      </Animated.View>
    </RectButton>
  );
};

const Slide = ({ item, index, onPress }) => {  
   const swipeableRef = useRef();

    const markAsRead = () => {
      swipeableRef.current.close()
      console.log('task completed')
    }


    const removeTask = () => {
      swipeableRef.current.close()
      console.log('task removed ')
    }


    return (
        <Swipeable
            ref={swipeableRef}
            friction={2}
            leftThreshold={80}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderLeftActions={ (progress, drag) => LeftActions(drag, markAsRead)}
            renderRightActions={(progress, drag) => RightActions(drag, removeTask)}
        >
          <View
             style={styles.container} 
          >
              <View style={{
                    flex: 1,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.padding,
                    paddingTop: SIZES.padding - 10
                  }}
                >
                  <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      overflow: 'hidden',
                      height: 40
                    }}>
                      <View style={{
                          backgroundColor: COLORS.green[400], 
                          height: 24, 
                          width: 24 , 
                          borderRadius: 4,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 4
                        }}>
                        <FontAwesome5 color='white' name='sticky-note' ></FontAwesome5>
                      </View>
                      <Text style={{ ...styles.header, color: 'white'}}>{item.title}</Text>
                    </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', height: 40 }}>
                    <View style={{ flexDirection: 'row'}}>
                      <FontAwesome5 key="fa-home" name="stopwatch" size={16} color="white"></FontAwesome5>
                      <Text style={{ ...styles.bodyText, color: COLORS.gray[400], marginLeft: 5 }}>{item.duration_ms}</Text>
                    </View>
                  </View>
              </View>
              
              <View style={{ flex: 1, paddingHorizontal: SIZES.padding }}>
                <Text style={{ color: item.description ? 'white' : COLORS.gray[400] }}> { item.description || 'No Description provided' }</Text>
              </View>

              <View style={{ 
                backgroundColor: COLORS.bgPanelColor, 
                paddingHorizontal: SIZES.padding, 
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                paddingVertical: 8
              }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome5  name="check-circle" size={14} color="white"></FontAwesome5>
                  <Text style={{...styles.body, marginLeft: 3, color: 'white'}}> Mark as done </Text>
                </TouchableOpacity>
          
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <FontAwesome5 key="fa-home" name="calendar" size={14} color={COLORS.blue[300]}></FontAwesome5>
                      <Text style={{ ...styles.bodyText, color: COLORS.blue[300], marginLeft: 5 , fontWeight: 'bold'}}>{item.due_date || 'Set due date'}</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Swipeable>
    );
}


export default function TodoScroll({ items, onPress }) {

    const scrollX = new Animated.Value(0);

    return (
        <FlatList
            data={items}
            scrollEnabled={false}
            keyExtractor={(item: Object, index: number) => `item-scroll-${item.uid}-${index}`}
            renderItem={props => <Slide {...props} onPress={onPress}></Slide>}
            showsHorizontalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.bgPanelColor,
      width: '100%',
      height: 150,
      shadowColor: "#000",
      overflow: 'hidden',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      borderStyle: "solid",
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    header: {
      color: "#222",
      fontSize: SIZES.h3,
      fontWeight: "bold",
      marginLeft: 5,
      flexWrap: 'wrap',
    },
    bodyText: {
      color: "#222",
      fontSize: 14
    },
    body: {
      color: "#222",
      fontSize: 14,
    },
    actionIcon: {
      marginHorizontal: 10,
    },
    rightAction: {
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: COLORS.red[400],
      flex: 1,
      justifyContent: 'flex-end',
    },
    leftAction: {
      flex: 1,
      backgroundColor: COLORS.green[400],
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row-reverse',
    },
  })