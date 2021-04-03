import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { images, FONTS, SIZES } from "../config/constants";

export default function AppHeader({ navigation, user }) {
    const [ profileData, setProfileData ] = useState({
        photo: '',
        name: '',
        initials: ''
    })

    useEffect(() => {
        if (user) {
            const provider = user.providerData[0];
            const name = provider.displayName || provider.email;
        
            setProfileData({
              photo:  provider.photoURL,
              name: name,
              initials: name.split(' ').map( (name: string) => name[0].toUpperCase()).join('')
        
            })
        }
      }, [user])


    return (<View style={{ 
        flex: 1, 
        justifyContent: "space-between", 
        flexDirection: "row", 
        width: "100%", 
        maxHeight: 110,
        padding: SIZES.padding
      }}>
        <Text style={{...FONTS.brand, color: 'white'}}>Zen.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyModal')}
          style={{
            backgroundColor: 'white',
            borderRadius: 35,
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center' 
          }}
        > 
          <Text> {profileData.initials} </Text>
        </TouchableOpacity>
      </View>)
}