import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { SHADOWS, COLORS, SIZES, images } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import AuthContext from '../../utils/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { BarChart, LineChart } from "react-native-chart-kit";
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MetricsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { extraData } = useContext(AuthContext);
  const [ data, setData ] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [8, 4, 6, 13, 10, 10, 10]
      }
    ]
  })
  const [ todo, setTodo ] = useState([]);
  const { getTaskByMatrix } = useTaskFirestore(extraData);

  
  const getMatrix = (matrix: string, callback) => {
      getTaskByMatrix(matrix).then((collectionRef) => {
      const unsubscribe = collectionRef.onSnapshot((snap) => {
        const results = [];
        snap.forEach((doc) => {
          results.push({ ...doc.data(), uid: doc.id });
        });
        callback(results)
      });
  
      return unsubscribe;
    });
  };

  const [matrix, setMatrix] = useState({
    todo: {
      label: 'Started',
      color: COLORS.blue[400],
      list: todo,
      value: 37
    },
    schedule: {
      label: 'Finished',
      color: COLORS.green[300],
      list: todo,
      value: 17
    },
    delegate: {
      label: 'Stopped',
      color: COLORS.red[300],
      list: todo,
      value: 20
    },
  })
  const [generalStats, setGeneralStats] = useState([
    {
      label: 'Tasks worked',
      color: COLORS.green[300],
      icon: 'sticky-note',
      value: '11'
    },
    {
      label: 'Time Focused',
      color: COLORS.blue[400],
      icon: 'clock',
      value: '08:45:27'
    },

  ])

  useEffect(() => { 
      const todoRef = getMatrix("todo", setTodo);
  }, [])

  const selectMatrix = (matrixName: string) => {
    const selectedMatrix = matrix[matrixName];
    if (selectedMatrix) {
      setSelectedList(todo)
      setSelectedMatrix(selectedMatrix)
    }
  }

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
            elevation: 9,
            zIndex: 10
          }}>
            <Text style={{ color: 'white'}}> Metrics </Text>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignContent: 'space-around',
                backgroundColor: COLORS.primary,
                overflow: 'hidden',
                borderRadius: SIZES.radius,
                marginTop: 8
              }}
            >
              {Object.entries(matrix).map(([listName, list]) => {
                return (
                  <View style={{
                    width: '33%',
                    height: 74,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  key={listName}
                  onPress={() => selectMatrix(listName)}
                  >
                    <Text style={{ color: list.color, fontWeight: 'bold' }}> {list.label} </Text>
                    <Text style={{ color: list.color, fontWeight: 'bold' }}> {list.value} </Text>
                  </View>
                )
              })}
            </View>
          </View>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 100}]}>
      <MatrixHeader></MatrixHeader>
      <View style={{
          padding: SIZES.padding,
      }}>
        <View
              style={{
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignContent: 'space-around',
                backgroundColor: COLORS.bgPanelColor,
                overflow: 'hidden',
                borderRadius: SIZES.radius,
                marginTop: 8
              }}
            >
          {generalStats.map((statLine) => {
            return (
              <View style={{
                width: '50%',
                height: 74,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              key={statLine.value}
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FontAwesome5  name={statLine.icon} size={14} color={statLine.color}></FontAwesome5>
                  <Text style={{ color: statLine.color, fontWeight: 'bold' }}> {statLine.label} </Text>
                </View>
                <Text style={{ color: statLine.color, fontWeight: 'bold' }}> {statLine.value} </Text>
              </View>
            )
          })}

        </View>
      </View>
      <View style={{ 
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        backgroundColor: COLORS.bgPanelColor,
        paddingTop: 14
      }}>
        <Text style={{ color: 'white', marginBottom: 14, marginLeft: 24 }}> Pomodoro Stats </Text>
        <BarChart
            data={data}
            width={SIZES.width - (SIZES.padding * 2) - 5}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: COLORS.bgPanelColor,
              backgroundGradientFrom: COLORS.bgPanelColor,
              backgroundGradientTo: COLORS.bgPanelColor,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            verticalLabelRotation={30}
        />
      </View>
      <View style={{ 
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        backgroundColor: COLORS.bgPanelColor,
        paddingTop: 14,
        marginVertical: SIZES.padding,
        marginBottom: 100
      }}>
        <Text style={{ color: 'white', marginBottom: 14, marginLeft: 24 }}> Time Tracking Stats </Text>
        <LineChart
            data={data}
            width={SIZES.width - (SIZES.padding * 2) - 2}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: COLORS.bgPanelColor,
              backgroundGradientFrom: COLORS.bgPanelColor,
              backgroundGradientTo: COLORS.bgPanelColor,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            verticalLabelRotation={30}
        />
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
     ...SHADOWS.shadow1,
     marginBottom: 200
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.primary
  },
});
