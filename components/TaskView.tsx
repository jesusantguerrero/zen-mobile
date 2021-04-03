import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { FONTS, COLORS, SIZES, theme } from "../config/constants";

export default function TaskView({ task, tracker }) {
    return (
        <View style={styles.container}>
          { !task ? null : <View style={{ flex: 1 , justifyContent: "space-between", flexDirection: "row", width: '100%', alignItems: 'center' }}>
            <Text style={{ ...FONTS.h5,  color: 'white' }}>
                {task.title}
            </Text>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: 'center'}}>
                <TouchableHighlight>
                    <FontAwesome5 key="fa-home" name="edit" size={20} color="white"></FontAwesome5>
                </TouchableHighlight>
                <TouchableHighlight style={{ marginLeft: 5 }}>
                    <FontAwesome5 key="fa-home" name="check-circle" size={20} color="white"></FontAwesome5>
                </TouchableHighlight>
                <Text style={styles.entityText}>
                    {task.due_date}
                </Text>
            </View>
          </View>}

          { !task ? null : <View style={{ flex: 6, flexDirection: "row", marginTop: 10 }}>
            <Text style={{...FONTS.body3,  color: 'white', textAlign: 'left' }}>
                {task.description.trim()}
            </Text>
          </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        padding: SIZES.padding,
        borderRadius: SIZES.radius
    },
    entityText: {
        fontSize: 14,
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold'
    },
    entityDate: {
        fontSize: 14,
        color: '#60A5FA',
        fontWeight: "bold",
        marginRight: 5
    },
})

