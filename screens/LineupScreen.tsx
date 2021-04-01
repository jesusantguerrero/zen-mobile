import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { useTaskFirestore } from "../utils/useTaskFirestore";
import styles from "./LineupStyles";

export default function LineupScreen({ navigation, extraData }) {
  const [mode, setMode] = useState('zen');
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

  const renderEntity = ({ item, index }) => {
    return (
        <View style={styles.entityContainer}>
            <Text style={styles.entityText}>
                {index+1}. {item.title}
            </Text>
        </View>
    )
}

  return (
    <View style={styles.container}>
      { todo && (
          <View style={styles.listContainer}>
              <FlatList
                  data={todo}
                  renderItem={renderEntity}
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

