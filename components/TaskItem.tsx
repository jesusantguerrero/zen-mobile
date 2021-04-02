import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TaskItem({ item, index }) {
  console.log(item)
    return (
        <View style={styles.entityContainer}>
          <View style={{ flex: 6 }}>
            <Text style={styles.entityTitle}>
                {item.title}
            </Text>
          </View>
          <View style={{ flex: 6, flexDirection: "row", justifyContent: "flex-end"}}>
            <Text style={styles.entityText}>
                {item.duration_ms}
            </Text>
            <Text style={styles.entityDate}>
                {item.due_date}
            </Text>
          </View>
        </View>
    )
}


const styles = StyleSheet.create({
    entityContainer: {
        marginTop: 16,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
        paddingBottom: 16,
        width: "100%"
    },
    entityTitle: {
        fontSize: 14,
        color: '#707070',
        marginRight: 5
    },
    entityText: {
        fontSize: 14,
        color: '#C0C4CC',
        marginRight: 5
    },
    entityDate: {
        fontSize: 14,
        color: '#60A5FA',
        fontWeight: "bold",
        marginRight: 5
    },
})

