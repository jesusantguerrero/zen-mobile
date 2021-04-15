import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ScrollView, Pressable } from 'react-native';
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { SHADOWS, COLORS, SIZES, images } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import AuthContext from '../../utils/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import ScrollCards from "../../components/ScrollCards";
import { StandupScreenProps } from '../../navigators/main';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function StandupScreen({ navigation }: StandupScreenProps ) {
  const { extraData } = useContext(AuthContext);

  const [ comitted, setComitted ] = useState<any[]>([]);
  const [ searchState, setSearchState ] = useState({
    date: new Date(),
    text: '',
    tags: [],
    showDatePicker: false
  });

  const { getCommitedTasks } = useTaskFirestore();
  const fetchCommitted = () => {
    getCommitedTasks(searchState.date).then(tasks => {
      setComitted(tasks);
    })
  }

  const [matrix, setMatrix] = useState({
    comitted: {
      label: 'comitted',
      color: COLORS.gray[400],
    },
  })

  const onChangeDate = (date) => {
    if (date) {
      setSearchState({...searchState, date: date, showDatePicker: false})
    } else {
      setSearchState({...searchState, showDatePicker: false})
    }
  }


  useEffect(() => { 
      const comittedRef = fetchCommitted();
  }, [])


  const MatrixHeader = () => {
    return (
      <View
        style={{
          width: "100%",
          height: 210,
          position: 'relative'
        }}
      >
        <ImageBackground source={images.temple} style={styles.containerHeader}>
        <LinearGradient
          colors={['rgba(58, 74, 115, .5)', 'rgba(58, 74, 115, .8)' ]}
          locations={[0, 0.5]}
          style={{
            width: '100%', 
            height: '100%',
            position: 'absolute'
          }}
        />
        </ImageBackground>
        <AppHeader navigation={navigation} user={extraData}></AppHeader>
          <View style={{
            marginTop: 84,
            width: '100%',
            paddingHorizontal: SIZES.padding,
            position: 'absolute',
            zIndex: 10,
          }}>
            <Text style={{ color: 'white'}}> Standup </Text>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignContent: 'space-around',
                backgroundColor: 'white',
                overflow: 'hidden',
                borderRadius: SIZES.radius,
                marginTop: 8
              }}
            >
              {Object.entries(matrix).map(([listName, list]) => {
                return (
                  <TouchableOpacity style={{
                    width: '33%',
                    height: 74,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  key={listName}
                  >
                    <Text style={{ color: list.color, fontWeight: 'bold' }}> {list.label} </Text>
                  </TouchableOpacity>
                )
              })}

            </View>
          </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <MatrixHeader></MatrixHeader>
      <Text style={{ color: 'white', padding: SIZES.padding, paddingBottom: 0 }}> Guilds </Text>
      <Pressable 
        onPress={() => setSearchState({
          ...searchState, showDatePicker: true
        })}
      >
        <Text style={{ color: 'white'}}>
            Set Date
        </Text>
      </Pressable>
      {searchState.showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={searchState.date}
          mode='date'
          is24Hour={true}
          display="default"
          textColor="red"
          onChange={onChangeDate}
        />
      )}
      <View style={{
          paddingVertical: SIZES.padding,
      }}>
        <ScrollCards
          items={comitted}
          onPress={() => {}}
        >

        </ScrollCards>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
     marginBottom: 200
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.primary
  },
});
