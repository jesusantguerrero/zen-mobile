import React, { useRef } from 'react';
import { Text, View, StyleSheet, Animated, TouchableOpacity, Task, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES } from '../config/constants';

const matrixColors = {
  schedule: {
    backgroundColor: COLORS.blue[400]
  },
  todo: {
    backgroundColor: COLORS.green[400]
  },
  delegate: {
    backgroundColor: COLORS.yellow[400]
  },
  delete: {
    backgroundColor: COLORS.red[400]
  }
}
const LeftActions = (progress, drag: Animated.AnimatedInterpolation, onPress: Function) => {
  const scale = drag.interpolate && drag.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={{
      width: '100%',
      flexDirection: 'row-reverse'
    }}>
      <RectButton style={styles.leftAction} onPress={onPress}>
        <Animated.View style={[styles.actionIcon,  { transform: [{ scale }], justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.blue[400], flex: 1, height: '100%'}]}>
          <FontAwesome5  name="border-all" size={32} color="white"></FontAwesome5>
          <Text style={{ color: 'white', marginTop: 8}}>Change Matrix</Text>
        </Animated.View>
      </RectButton>

      <RectButton style={styles.leftAction} onPress={onPress}>
        <Animated.View style={[styles.actionIcon,  { transform: [{ scale }], justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.green[400], flex: 1, height: '100%'}]}>
          <FontAwesome5  name="check-circle" size={32} color="white"></FontAwesome5>
          <Text style={{ color: 'white', marginTop: 8}}>Mark as Done</Text>
        </Animated.View>
      </RectButton>
    </View>
  );
};

const actionItem = (text: string, icon: string, color: string, x: number, progress: Animated.AnimatedInterpolation, onPress: Function) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <RectButton
        style={[{alignItems: 'center', flex: 1, justifyContent: 'center',}, { backgroundColor: color }]}
        onPress={onPress}>
          <FontAwesome5  name={icon} size={32} color="white"></FontAwesome5>
          <Text style={{ color: 'white', marginTop: 8}}>{text}</Text>
      </RectButton>
    </Animated.View>
  );
}

const RightActions = (progress, drag: Animated.AnimatedInterpolation, onPress: Function) => {
  const scale = drag.interpolate && drag.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{
      width: '100%',
      flexDirection: 'row'
    }} onPress={onPress}>
      {actionItem('Delete','trash', COLORS.red[400], 192, progress)}
      {actionItem('Due Date','calendar', COLORS.blue[400], 128, progress)}
      {actionItem('Tag', 'tags', COLORS.gray[400], 64, progress)}
    </View>
  );
};

export default function ScrollCard({ item, index, onPress, onDone, onRemove, children }: {item: Task, index: number, onPress: Function, onDone: Function, onRemove: Function, children: any[]}) {  
    const swipeableRef = useRef<Swipeable>()

    const close = () => {
      swipeableRef.current && swipeableRef.current.close()
    }

    const markAsRead = () => {
      close()
      onDone && onDone(item)
    }


    const removeTask = () => {
      close()
      onRemove && onRemove(item)
    }

    return (
        <Swipeable
            ref={swipeableRef}
            friction={2}
            leftThreshold={80}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderLeftActions={ (progress, drag) => LeftActions(progress, drag, markAsRead)}
            renderRightActions={(progress, drag) => RightActions(progress, drag, removeTask)}
        >
          { children ? children :
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
                          backgroundColor: item.done ? COLORS.gray[400] : matrixColors[item.matrix].backgroundColor, 
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
                      <Text style={{ ...styles.bodyText, color: COLORS.gray[400], marginLeft: 5 }}>{item.duration_ms || '00:00:00'}</Text>
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
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => onPress(item)}>
                  <FontAwesome5  name="check-circle" size={14} color="white"></FontAwesome5>
                  <Text style={{...styles.body, marginLeft: 3, color: 'white'}}>
                    { item.done ? 'Undo' : 'Mark as Done'}
                  </Text>
                </TouchableOpacity>
          
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <FontAwesome5 key="fa-home" name="calendar" size={14} color={COLORS.blue[300]}></FontAwesome5>
                      <Text style={{ ...styles.bodyText, color: COLORS.blue[300], marginLeft: 5 , fontWeight: 'bold'}}>{item.due_date || 'Set due date'}</Text>
                </TouchableOpacity>
              </View>
          </View>
          }
        </Swipeable>
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
    marginBottom: 5
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
  rightAction: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.red[400],
    flex: 1,
    justifyContent: 'flex-end',
  },
  leftAction: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.green[400],
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  }
})