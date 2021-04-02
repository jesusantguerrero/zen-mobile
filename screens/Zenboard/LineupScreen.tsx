import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import styles from "./LineupStyles";
import TaskItem from "../../components/TaskItem";

export default function LineupScreen({ navigation, extraData }) {
  const [ todo, setTodo ] = useState([])
  const [ schedule, setSchedule ] = useState([])
  const { getTaskByMatrix } = useTaskFirestore(extraData)


  const matrixFill = {
    "todo": setTodo,
    "schedule": setSchedule
  }
  
  const getMatrix = (matrix: string) => {
      getTaskByMatrix(matrix).then((collectionRef) => {
      const unsubscribe = collectionRef.onSnapshot((snap) => {
        const results = [];
        snap.forEach((doc) => {
          results.push({ ...doc.data(), uid: doc.id });
        });
        matrixFill[matrix](results)
      });
  
      return unsubscribe;
    });
  };

  useEffect(() => { 
      const todoRef = getMatrix("todo");
      const scheduleRef = getMatrix("schedule");
  }, [])

  return (
    <View style={styles.container}>
      { todo && (
          <View style={styles.listContainer}>
              <Text style={{color:'#34D399', fontWeight: "bold"}}> Todo </Text>
              <FlatList
                  data={todo}
                  renderItem={TaskItem}
                  keyExtractor={(item) => item.id}
                  removeClippedSubviews={true}
              />
          </View>
      )}
      { schedule && (
          <View style={styles.listContainer}>
              <Text style={{color:'#60A5FA', fontWeight: "bold"}}> Schedule </Text>
              <FlatList
                  data={schedule}
                  renderItem={TaskItem}
                  keyExtractor={(item) => item.id}
                  removeClippedSubviews={true}
              />
          </View>
      )}
      <View style={styles.footer}>
        <TouchableOpacity  onPress={() => navigation.navigate('Zenboard')} style={styles.button}>
          <Text> Zen </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => setMode('lineup')} style={styles.button}>
          <Text> Lineup </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

