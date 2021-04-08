import React from "react"
import { Animated, StyleSheet, View } from "react-native"
import { COLORS, SIZES } from "../config/constants"

export default function ScrollDots({position, items} : { position: Animated.Value, items: any[]}) {
    const dotPosition = Animated.divide(position, SIZES.width)
  
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

  const styles = StyleSheet.create({
    dot: {
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.green[600],
      marginHorizontal: SIZES.radius / 2

    }
  })