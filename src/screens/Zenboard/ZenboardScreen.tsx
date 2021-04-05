import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import TodoScroll from "../../components/TodoScroll";
import TaskView from "../../components/TaskView";
import TimeTracker from "../../components/TimeTracker";
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { images, SIZES, FONTS } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import AuthContext from '../../utils/AuthContext';

export default function ZenboardScreen({ navigation}) {
  const { extraData } =useContext(AuthContext);
  const [currentTask, setCurrentTask] = useState(null);
  const [showLineUp, setShowLineUp] = useState(false);
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
      return getMatrix("todo", setTodo);
  }, [])

  return (
    <ImageBackground source={images.temple} style={styles.container}>
      <View style={{width: '100%', height: '100%', backgroundColor:'#000',  opacity: .5, position: 'absolute'}} />
      <AppHeader navigation={navigation} user={extraData}></AppHeader>
      <View style={{width: '100%', padding: SIZES.padding}}>
        <TaskView task={currentTask}></TaskView>
      </View>
      <View style={{ flex: 3, justifyContent: "center", alignItems: "center", maxHeight: 250 }}>
        <TimeTracker task={currentTask} onPomodoroStarted="" onPomodoroStoped=""></TimeTracker>
      </View>
      <TouchableOpacity style={{ marginBottom: 10}} onPress={() => setShowLineUp(!showLineUp)}>
        <Text style={{ ...FONTS.h2}}> {showLineUp ? 'Hide Lineup' : 'Show Lineup'} </Text>
      </TouchableOpacity>
      {!showLineUp ? null : <TodoScroll items={todo} onPress={setCurrentTask}></TodoScroll>}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
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
