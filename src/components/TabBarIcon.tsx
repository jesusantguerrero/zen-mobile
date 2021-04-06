import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons"
import { COLORS, FONTS } from "../config/constants";

export default function TabBarIcon({ focused, label, icon}) {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome5 key="fa-home" name={icon} size={20} color={focused ? COLORS.green['400'] : COLORS.gray[400]}></FontAwesome5>
            <Text style={{ color: focused ? COLORS.green['400'] : COLORS.gray[400], ...FONTS.body4, fontWeight: "bold", marginTop: 6 }}>
                {label}
            </Text>
        </View>
    )
}



