import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { SHADOWS, COLORS, SIZES, images } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import TaskGroup from '../../components/TaskGroup';
import { ScrollView } from 'react-native-gesture-handler';

export default function TaskFormModal({ navigation, user, task }) {
  const [ localTask, setLocalTask ] = useState({
      
  });
  const [ todo, setTodo ] = useState([]);
  const [ selectedList, setSelectedList] = useState([]);
  const [ selectedMatrix, setSelectedMatrix] = useState({});
  const { getTaskByMatrix } = useTaskFirestore(user);

  
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
      label: 'Todo',
      color: COLORS.green[400],
      list: todo
    },
    schedule: {
      label: 'Schedule',
      color: COLORS.blue[400],
      list: todo
    },
    delegate: {
      label: 'Delegate',
      color: COLORS.yellow[400],
      list: todo
    },
    delete: {
      label: 'Delete',
      color: COLORS.red[400],
      select: todo
    }
  })

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
          height: 200,
          position: 'relative',
          ...SHADOWS.shadow1
        }}
      >
        <ImageBackground source={images.zenTemple} style={styles.container}>
          <View style={{width: '100%', height: '100%', backgroundColor:'#000',  opacity: .6, marginBottom: 15, position: 'absolute'}} />
          <AppHeader navigation={navigation} user={user}></AppHeader>
          <View style={{
            marginTop: 16,
            width: '100%',
            paddingHorizontal: SIZES.padding,
            position: 'absolute',
            bottom: '-35%',
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
              {Object.entries(matrix).map(([listName, list]) => {
                return (
                  <TouchableOpacity style={{
                    backgroundColor: list.color,
                    marginBottom: 14,
                    width: '48%',
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: SIZES.radius,
                    ...SHADOWS.shadow1
                  }}
                  key={listName}
                  onPress={() => selectMatrix(listName)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}> {list.label} </Text>
                  </TouchableOpacity>
                )
              })}

            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MatrixHeader></MatrixHeader>
      <ScrollView style={{
          marginTop: 100,
          paddingBottom: 30,
      }}>
        <TaskGroup
          label={selectedMatrix.label}
          tasks={selectedList}
          color={selectedMatrix.color}
          onPress={() => console.log('hola')}
        >
        </TaskGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff'
  },
});
