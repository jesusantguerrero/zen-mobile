import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import TodoScroll from "../../components/TodoScroll";
import TaskView from "../../components/TaskView";
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { images } from "../../config/constants";

export default function ZenboardScreen({ navigation, extraData }) {
  const [currentTask, setCurrentTask] = useState(null);

  const [ todo, setTodo ] = useState([])
  const { getTaskByMatrix } = useTaskFirestore(extraData)

  
  const getMatrix = (matrix: string, callback) => {
      getTaskByMatrix(matrix).then((collectionRef) => {
      const unsubscribe = collectionRef.onSnapshot((snap) => {
        const results = [];
        snap.forEach((doc) => {
          results.push({ ...doc.data(), uid: doc.id });
        });
        setCurrentTask(results[0])
        callback(results)
      });
  
      return unsubscribe;
    });
  };

  useEffect(() => { 
      const todoRef = getMatrix("todo", setTodo);
  }, [])


  return (
    <ImageBackground source={images.temple} style={styles.container}>
      { !currentTask ? null : <TaskView task={currentTask} style={{}}></TaskView> }
      <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
        <View style={{ borderRadius: 100, backgroundColor: "red", width: 50, height: 50, justifyContent: "center", alignItems: "center", marginTop: 30 }}>
            <Text style={{ color: "white" }}> Play </Text>
        </View>
      </View>
      <TodoScroll items={todo} onPress={setCurrentTask}></TodoScroll>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: "#000"
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    height: 20,
    width: "100%"
  },
  button: {
    width: 100,
    minWidth: "48%",
    color: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    fontSize: 36
  },
  header: {
    backgroundColor: "red",
    borderBottomColor: "#333",
    borderBottomWidth: 2,
    height: 40,
    fontSize: 24,
    width: "100%"
  }
});
