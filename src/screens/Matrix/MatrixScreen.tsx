import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { SHADOWS, COLORS, SIZES, images } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import TaskGroup from '../../components/TaskGroup';
import AuthContext from '../../utils/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {  firestore } from "firebase";
import { Task } from '../../utils/data';

const MatrixHeader = ({ user, navigation, matrix, onPress }) => {
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
      <AppHeader navigation={navigation} user={user}></AppHeader>
        <View style={{
          marginTop: 16,
          width: '100%',
          paddingHorizontal: SIZES.padding,
          position: 'absolute',
          bottom: '-36%',
          elevation: 9,
          zIndex: 10,
        }}>
          <Text style={{ color: 'white'}}> Eisenhower Matrix</Text>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              width: '100%',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignContent: 'space-around',
              marginTop: 8
            }}
          >
            {matrix && Object.entries(matrix).map(([listName, list]) => {
              return (
                <TouchableOpacity style={{
                  backgroundColor: list.color,
                  marginBottom: 14,
                  width: '48%',
                  height: 74,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: SIZES.radius,
                  ...SHADOWS.shadow1
                }}
                key={listName}
                onPress={() => onPress(listName)}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}> {list.label} </Text>
                </TouchableOpacity>
              )
            })}

          </View>
        </View>
    </View>
  )
}

export default function MatrixScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { extraData } = useContext(AuthContext);

  const [ selectedMatrix, setSelectedMatrix] = useState('todo');
  const { getUncommitedTasks, mapTask } = useTaskFirestore();

  const [tasks, setTasks] = useState([]);
  const [matrix, setMatrix] = useState({
    todo: {
      label: 'Todo',
      color: COLORS.green[400],
      list: tasks
    },
    schedule: {
      label: 'Schedule',
      color: COLORS.blue[400],
      list: tasks
    },
    delegate: {
      label: 'Delegate',
      color: COLORS.yellow[400],
      list: tasks
    },
    delete: {
      label: 'Delete',
      color: COLORS.red[400],
      select: tasks
    }
  })
  
  const fetchTasks = (callback: Function): Function => {
    const collectionRef = getUncommitedTasks(extraData.uid);
    return collectionRef.onSnapshot((snap: firestore.QuerySnapshot) => {
      const localTasks:Array<Task> = [];
      snap.forEach((doc) => {
        const data = doc.data();
        localTasks.push(mapTask(data, doc.id));
      });
      callback(localTasks)
    });
  }

  useEffect(() => { 
    const tasksRef = fetchTasks(setTasks);

    return () => {
        tasksRef()
    }
  }, [])

  useEffect(() => { 
    Object.values(matrix).forEach((quadrant) => quadrant.list = []);
    tasks.forEach(task => {
      if (matrix[task.matrix] && !matrix[task.matrix].list) {
        matrix[task.matrix].list = [task];
      } else if (matrix[task.matrix]) {
        matrix[task.matrix].list.push(task);
        setMatrix((oldMatrix => {
          return {...oldMatrix, [task.matrix]: {
            ...oldMatrix[task.matrix],
            list: [...oldMatrix[task.matrix].list, task]
          }}
        }))
      }
    })
  }, [tasks])

  const getMatrixTasks = (matrix: string) => {
    const localTasks = tasks.filter((task: Task ) => task.matrix == matrix).sort((a:Task, b:Task) => {
      return a.order - b.order;
    })

    return localTasks;
}

  const selectMatrix = (matrixName: string) => {
    setSelectedMatrix(matrixName)
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top}]}>
      <MatrixHeader 
        navigation={navigation} 
        user={extraData} 
        matrix={matrix} 
        onPress={(listName: string) => selectMatrix(listName)}>
      </MatrixHeader>
      <View style={{
          marginTop: 100,
          paddingBottom: 30,
      }}>
        <TaskGroup
          label={matrix[selectedMatrix].label}
          tasks={getMatrixTasks(selectedMatrix)}
          color={matrix[selectedMatrix].color}
          onPress={() => console.log('hola')}
        >
        </TaskGroup>
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
    backgroundColor: COLORS.primary,
  },
});
