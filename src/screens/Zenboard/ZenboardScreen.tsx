import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import TodoScroll from "../../components/TodoScroll";
import TaskView from "../../components/TaskView";
import TimeTracker from "../../components/TimeTracker";
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { images, SIZES, FONTS, COLORS } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import AuthContext from '../../utils/AuthContext';
import { LinearGradient } from "expo-linear-gradient";

export default function ZenboardScreen({ navigation}) {
  const { extraData } = useContext(AuthContext);
  const [currentTask, setCurrentTask] = useState(null);
  const [showLineUp, setShowLineUp] = useState(false);
  const [ todo, setTodo ] = useState([])
  const { getTaskByMatrix } = useTaskFirestore(extraData)


  const getMatrix = (matrix: string, callback): null|Function => {
      let unsubscribe: null|Function = null;
      getTaskByMatrix(matrix).then((collectionRef) => {
        unsubscribe = collectionRef.onSnapshot((snap) => {
          const results = [];
          snap.forEach((doc) => {
            results.push({ ...doc.data(), uid: doc.id });
          });
          setCurrentTask(results[0])
          callback(results)
        });
  
    });
    return unsubscribe;
  };

  useEffect(() => { 
      const unsubscribe = getMatrix("todo", setTodo);
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      }
  }, [])

  return (
    <ImageBackground source={images.temple} style={styles.container}>
      <LinearGradient
        colors={['rgba(58, 74, 115, .5)', 'rgba(58, 74, 115, .8)', COLORS.primary ]}
        locations={[0, 0.5, 0.7]}
        style={{
          width: '100%', 
          height: '100%',
          position: 'absolute'
        }}
      />
      <AppHeader navigation={navigation} user={extraData}></AppHeader>
      <View style={{width: '100%', paddingHorizontal: SIZES.padding, paddingBottom: SIZES.padding }}>
        <Text style={{...FONTS.h3, color: 'white', fontWeight: 'bold'}}>Welcome, { extraData?.displayName || extraData?.email }</Text>
        <Text style={{...FONTS.h3, color: 'white', fontWeight: 'bold'}}> 4 April, 2021 </Text>
      </View>
      <View style={{ flex: 3, justifyContent: "center", alignItems: "center", maxHeight: 250, marginBottom: 40 }}>
        <TimeTracker task={currentTask} onPomodoroStarted="" onPomodoroStoped=""></TimeTracker>
      </View>
      <TouchableOpacity style={{ 
          marginBottom: 10, 
          justifyContent: 'space-between', 
          flexDirection: 'row', 
          width: '100%',
          paddingHorizontal: SIZES.padding
          
        }} 
        onPress={() => setShowLineUp(!showLineUp)}>
        <Text style={{ ...FONTS.h3, color: 'white' }}> {showLineUp ? 'Lineup' : 'Focused'} </Text>
        <Text style={{ ...FONTS.h3, color: 'white' }}> {showLineUp ? 'Hide Lineup' : 'Show Lineup'} </Text>
      </TouchableOpacity>
      {!showLineUp ? 
        <View style={{width: '100%', padding: SIZES.padding}}>
          <TaskView task={currentTask}></TaskView>
        </View>
        : 
        <TodoScroll
          items={todo} 
          onPress={setCurrentTask}
        />      
      }
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
