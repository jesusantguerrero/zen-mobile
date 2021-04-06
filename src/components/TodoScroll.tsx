import React, { useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, Pressable, Animated, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES } from '../config/constants';

const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)
const { width: windowWidth } = Dimensions.get("window");

export default function TodoScroll({ items, onPress }) {
    const Slide = ({ item, index, onPress }) => {    
        return (
            <Pressable 
                style={styles.container} 
                key={index} 
                onPress={onPress.bind(null, item)}
            >
                <View style={{
                      flex: 1,
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: SIZES.padding,
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
                        <Text style={{ ...styles.header, color: COLORS.gray[500]}}>{item.title}</Text>
                      </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', height: 40 }}>
                      <View style={{ flexDirection: 'row'}}>
                        <FontAwesome5 key="fa-home" name="stopwatch" size={16} color="white"></FontAwesome5>
                        <Text style={{ ...styles.bodyText, color: COLORS.gray[400], marginLeft: 5 }}>{item.duration_ms}</Text>
                      </View>
                    </View>
                </View>
                <View style={{ flex: 1, paddingHorizontal: SIZES.padding }}>
                  <Text style={{ color: item.description ? 'white' : COLORS.primary }}> { item.description || 'No Description provided' }</Text>
                </View>
                <View style={{ 
                  backgroundColor: 'white', 
                  paddingHorizontal: SIZES.padding, 
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  paddingVertical: 8
                }}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5  name="check-circle" size={14} color="black"></FontAwesome5>
                    <Text style={{...styles.body, marginLeft: 3 }}> Mark as done </Text>
                  </TouchableOpacity>
            
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 key="fa-home" name="calendar" size={14} color={COLORS.blue[400]}></FontAwesome5>
                        <Text style={{ ...styles.bodyText, color: COLORS.blue[400], marginLeft: 5}}>{item.due_date || 'Set due date'}
                        </Text>
                  </TouchableOpacity>
                </View>
            </Pressable>
        );
    }

    const scrollX = new Animated.Value(0);

    const renderDots = () => {
      const dotPosition = Animated.divide(scrollX, SIZES.width)
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, alignItems: 'center', height: 20 }}>
          { items.map((item, index: number) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp'
            })

            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base, 12, SIZES.base],
              extrapolate: 'clamp'
            })

            return (
              <Animated.View
                key={`dot-${index}`}
              
                style={[styles.dot, {width: dotSize, height: dotSize, opacity: opacity }]}
              >

              </Animated.View>
            )
          })}
        </View>
      )
    }

    return (
        <View style={{ height: 100, flex: 1,  width: '100%' }}>
          <Animated.FlatList
              data={items}
              style={{ 
                flex: 1, 
                width: '100%',
                marginTop: SIZES.padding,
                maxHeight: 155
              }}
              renderItem={props => <Slide {...props} onPress={onPress}></Slide>}
              pagingEnabled
              horizontal
              keyExtractor={(item, index) => `item-scroll-${item.uid}-${index}`}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([
                { nativeEvent: { 
                  contentOffset: { x: scrollX } 
                } }
              ], { useNativeDriver: false })}
          />
          { renderDots()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "rgba(0,0,0,.6)",
      borderRadius: 8,
      width: windowWidth - 48,
      marginLeft: 24,
      marginRight: 24,
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
      marginBottom: 10
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
    dot: {
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.green[400],
      marginHorizontal: SIZES.radius / 2

    }
  })