import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import { FontAwesome5 } from "@expo/vector-icons"
import { COLORS, FONTS, SHADOWS } from "../config/constants";

export default function TabBarIcon({ focused, label, icon}) {
    return (
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.green['400'], width: 60, height: 50, borderRadius: 35, ...SHADOWS.shadow1, top: -20 }}>
          <FontAwesome5 key="fa-home" name={icon} size={20} color='white'></FontAwesome5>
        </TouchableOpacity>
    )
}
