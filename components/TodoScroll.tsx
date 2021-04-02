import Carousel from 'react-native-snap-carousel';
import React, { useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, Pressable } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export default function TodoScroll({ items, onPress }) {
    const isCarousel = useRef(null)
    const Slide = ({ item, index, onPress }) => {
        
        return (
            <Pressable style={styles.container} key={index} onPress={onPress.bind(null, item)}>
                <View>
                    <Text style={styles.header}>{item.title}</Text>
                    <Text style={styles.body}> {item.description} </Text>
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
      backgroundColor: 'white',
      borderRadius: 8,
      width: windowWidth - 30,
      marginLeft: 15,
      marginRight: 15,
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      border: "1px solid #ddd",
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
      marginBottom: 10
    },
    image: {
      width: ITEM_WIDTH,
      height: 300,
    },
    header: {
      color: "#222",
      fontSize: 28,
      fontWeight: "bold",
      paddingLeft: 20,
      paddingTop: 20
    },
    body: {
      color: "#222",
      fontSize: 18,
      paddingLeft: 20,
      paddingRight: 20
    }
  })