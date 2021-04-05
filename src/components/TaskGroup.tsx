import React, { useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SHADOWS, SIZES, FONTS, COLORS } from '../config/constants';

const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

export default function TaskGroup({ label, tasks , onPress, color }) {
    const Slide = ({ item, index }) => {
        return (
            <View style={styles.container} key={item.uid}>
                <View>
                    <View style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <View style={{
                        flex: 1,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}>
                        <View style={{
                            backgroundColor: color, 
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
                      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{ ...styles.header, color: COLORS.gray[400]}}>{item.duration_ms}</Text>
                        <Text style={{ ...styles.header, color: COLORS.blue[400], marginLeft: 5, fontWeight: 'bold'}}>{item.due_date}</Text>
                        <View style={{ marginLeft: 5}}>
                          <FontAwesome5 color={COLORS.gray[400]} name='ellipsis-v'></FontAwesome5>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.body}> {item.description} </Text>
                </View>
            </View>
        );
    }

    const separator = () => {
      return (<View style={{width: '100%', height: 2, backgroundColor: '#efefef', marginVertical: 10 }}></View>)
    }

    return (
        <View style={{
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.padding,
          padding: 20,
          height: SIZES.height - 1000,
          maxHeight: SIZES.height - 420,
          borderRadius: SIZES.radius,
          backgroundColor: 'white',
          ...SHADOWS.shadow1,
        }}>
          <Text style={{...FONTS.h2, color: color || COLORS.primary, fontWeight: 'bold' }}> {label || 'Select a list'} </Text>
          <FlatList
              contentContainerStyle={{
                marginTop: SIZES.radius
              }}
              keyExtractor={(item, index) => `${index}-${item.uid}`}
              data={tasks}
              ItemSeparatorComponent={separator}
              renderItem={props => <Slide {...props} onPress={onPress}></Slide>}
          />
          { tasks.length ?  null : 
            <View style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
               <FontAwesome5 color={COLORS.primary} name='sticky-note' size={24} ></FontAwesome5>
               <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>There's no items to show </Text>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 80,
      paddingBottom: 40,
      marginBottom: 10
    },
    image: {
      width: ITEM_WIDTH,
      height: 300,
    },
    header: {
      color: "#222",
      ...FONTS.h4,
      fontWeight: "bold"
    },
    body: {
      color: "#222",
      fontSize: 18,
      marginTop: 5
    }
  })