import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { FONTS, COLORS, SIZES, theme } from "../config/constants";

export default function TaskView({ task, tracker }) {
    return (
        <View style={styles.container}>
          { !task ? null : <View style={{ flex: 1 , justifyContent: "space-between", flexDirection: "row", width: '100%', alignItems: 'center' }}>
            {/* <TouchableHighlight style={{ marginRight: 15 }}>
                <FontAwesome5 key="fa-home" name="note" size={16} color="white"></FontAwesome5>
            </TouchableHighlight> */}
            <Text style={{ ...FONTS.h5,  color: 'white' }}>
                {task.title}
            </Text>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: 'center'}}>
                <TouchableHighlight>
                    <FontAwesome5 key="fa-home" name="edit" size={16} color="white"></FontAwesome5>
                </TouchableHighlight>
                <TouchableHighlight style={{ marginLeft: 15 }}>
                    <FontAwesome5 key="fa-home" name="check-circle" size={16} color="white"></FontAwesome5>
                </TouchableHighlight>
                <Text style={styles.entityText}>
                    {task.due_date}
                </Text>
            </View>
          </View>}

          { !task ? null : <View style={{ flex: 6, flexDirection: "row", marginTop: 30 , justifyContent: 'space-between'}}>
             <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome5 key="fa-home" name="stopwatch" size={16} color="white"></FontAwesome5>
                <Text style={{...FONTS.body4,  color: 'white', textAlign: 'left', marginLeft: 5, fontWeight: 'bold' }}>
                    01:00:00
                </Text>
            </View> 
             <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome5 key="fa-home" name="stopwatch" size={16} color={COLORS.blue[400]}></FontAwesome5>
                <Text style={{...FONTS.body4,  color: COLORS.blue[400], textAlign: 'left', marginLeft: 5, fontWeight: 'bold' }}>
                    Started: 3
                </Text>
            </View> 
             <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome5 key="fa-home" name="stopwatch" size={16} color={COLORS.green[400]}></FontAwesome5>
                <Text style={{...FONTS.body4,  color: COLORS.green[400], textAlign: 'left', marginLeft: 5, fontWeight: 'bold' }}>
                    Completed: 1
                </Text>
            </View> 
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

