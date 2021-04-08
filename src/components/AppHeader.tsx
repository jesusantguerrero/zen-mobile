import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FONTS, SIZES } from "../config/constants";
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/core";


export default function AppHeader({ user } : AppHeaderProps) {
    const navigation = useNavigation();
    const [ profileData, setProfileData ] = useState<HeaderProfileData>({
        photo: '',
        name: '',
        initials: ''
    })

    useEffect(() => {
        if (user) {
            const provider = user;
            const name = provider.displayName || provider.email || user.email;
        
            setProfileData({
              photo:  provider.photoURL,
              name: name,
              initials: name && name.split(' ').map( (name: string) => name[0].toUpperCase()).join('')
            })
        }
      }, [user])


    return (<View style={{ 
        flex: 1, 
        justifyContent: "space-between", 
        flexDirection: "row", 
        width: "100%", 
        maxHeight: 90,
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
            alignItems: 'center',
            overflow: 'hidden'
          }}
        > 
           { profileData.photo ? <Image source={profileData.photo} style={{ width: "100%", height: "100%", borderRadius: 35 }}/>:
          <FontAwesome5  name="user" size={14} color="black"></FontAwesome5>}
        </TouchableOpacity>
      </View>)
}

type AppHeaderProps = {
  user: firebase.User
}

type HeaderProfileData = {
  photo: string | null,
  name: string | null,
  initials: string | null
}