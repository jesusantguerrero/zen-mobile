import React from "react";
import { Pressable, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FONTS, SIZES } from "../../config/constants";
import { logout } from "../../utils/useFirebase";
import { SessionModalProps } from "../../navigators/home";

export default function SessionModal({ navigation }: SessionModalProps) {
    return (
        <View>
            <View style={{ 
                flex: 1, 
                justifyContent: "space-between", 
                flexDirection: "row", 
                width: "100%", 
                padding: SIZES.padding
            }}>
                <Text style={{...FONTS.brand, color: '#333'}}>Zen.</Text>
                <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    backgroundColor: 'red',
                    borderRadius: 35,
                    height: 40,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                > 
                  <FontAwesome5 name='times' key="times" size={16} color='white'></FontAwesome5>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                <Pressable 
                  style={{ backgroundColor: 'red', width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }} 
                  onPress={() => logout()}>
                  <Text style={{ ...FONTS.h2 }}> Logout </Text>
                </Pressable>
            </View>
        </View>
    );
}
