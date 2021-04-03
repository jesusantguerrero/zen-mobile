import React, { useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES } from '../config/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)
const { width: windowWidth } = Dimensions.get("window");

export default function TodoScroll({ items, onPress }) {
    const Slide = ({ item, index, onPress }) => {
        
        return (
            <Pressable style={styles.container} key={index} onPress={onPress.bind(null, item)}>
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
                        overflow: 'hidden'
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
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Text style={{ ...styles.bodyText, color: COLORS.gray[400]}}>{item.duration_ms}</Text>
                        <Text style={{ ...styles.bodyText, color: COLORS.blue[400], marginLeft: 5, 
                          fontWeight: 'bold'}}>{item.due_date}
                        </Text>
                      </View>
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
                  <TouchableOpacity style={{ flexDirection: 'row' }}>
                    <FontAwesome5 key="fa-home" name="edit" size={20} color="white"></FontAwesome5>
                    <Text style={styles.body}> Edit </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: 'row' }}>
                    <FontAwesome5  name="check-circle" size={20} color="white"></FontAwesome5>
                    <Text style={styles.body}> Mark as done </Text>
                  </TouchableOpacity>
                </View>
            </Pressable>
        );
    }
    return (
        <FlatList
            data={items}
            style={{ flex: 1, width: windowWidth }}
            renderItem={props => <Slide {...props} onPress={onPress}></Slide>}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "rgba(0,0,0, .5)",
      borderRadius: 8,
      width: windowWidth - 30,
      marginLeft: 15,
      marginRight: 15,
      height: 150,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      borderWidth: 1,
      borderColor: "rgba(0,0,0, .5)",
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
      fontSize: 18
    },
    body: {
      color: "#222",
      fontSize: 14,
    }
  })