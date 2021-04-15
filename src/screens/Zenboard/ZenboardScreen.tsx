import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Animated, ImageBackground, TouchableOpacity, ToastAndroid, ScrollView, Alert } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Interval } from 'luxon';
import { format } from 'date-fns';
import firebase from 'firebase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScrollCards from "../../components/ScrollCards";
import TaskView from "../../components/TaskView";
import TimeTracker, { TimeTrack } from "../../components/TimeTracker";
import ScrollCard from "../../components/ScrollCard";
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { useTrackFirestore } from "../../utils/useTrackFirestore";
import { images, SIZES, FONTS, COLORS } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import AuthContext from '../../utils/AuthContext';
import { Task } from '../../utils/data';
import { ZenboardScreenProps } from "../../navigators/main"

export default function ZenboardScreen( { navigation }: ZenboardScreenProps ) {
  const insets = useSafeAreaInsets();

  const { extraData } = useContext(AuthContext);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TimeTrack | null>(null);
  const [ matrix, setMatrix ] = useState('focused')
  const [ todo, setTodo ] = useState([])
  const [ schedule, setSchedule ] = useState([])
  const { getTaskByMatrix, mapTask, updateTask, deleteTask} = useTaskFirestore()
  
  //  Line up list
  const getMatrix = (matrix: string, callback: Function): null|Function => {
    let unsubscribe: null|Function = null;
      if (extraData) {
        
        getTaskByMatrix(matrix).then((collectionRef: firebase.firestore.Query) => {
          unsubscribe = collectionRef.onSnapshot((snap) => {
            const results:Array<Task> = [];
            snap.forEach((doc) => {
              const data = doc.data();
              return results.push(mapTask(data, doc.id));
            });

            if (matrix == 'todo') {
              const selectedTask = !results.length ? null : results[0]
              setMainTask(selectedTask);
            }
            callback(results)
          });
        });
      }
    return unsubscribe;
  };

  useEffect(() => { 
      const unsubscribeTodo = getMatrix("todo", setTodo);
      const unsubscribeSchedule = getMatrix("schedule", setSchedule);
      
      return () => {
        if (unsubscribeTodo && unsubscribeSchedule) {
          unsubscribeTodo();
          unsubscribeSchedule();
        }
      }
  }, [])

  
  // main task
  const { getAllTracksOfTask, saveTrack, updateTrack, deleteTrack } = useTrackFirestore();
  const setMainTask = async (task: Task|null) => {
    if (task && task.uid) {
      task.tracks = await getAllTracksOfTask(task.uid)
    }
    setCurrentTask(task)
  }

  // tracker
  const [tracker, setTracker] = useState(null);
  const saveLocalTrack = (track: TimeTrack) => {
    if (currentTrack && currentTrack?.uid) {
      updateLocalTrack({...track, uid: currentTrack.uid})
    } else {
      createTrack(track)
    }
  }

  // CRUD
  const createTrack = (track: TimeTrack, ) => {
    if (currentTask) {
      track.uid = null
      track.task_uid = currentTask.uid || null;
      track.description = currentTask.title;
      const formData = { ...track }
      formData.currentTime = null
      saveTrack(formData)
        .then(uid => {
          formData.uid = uid;
          setCurrentTrack(formData);
        })
    }
  }

  const updateLocalTrack = (track: TimeTrack) => {
      const formData = {...currentTrack, ...track}
      if (formData.started_at && formData.ended_at && currentTask) {
        formData.task_uid = currentTask.uid;
        const duration = Interval.fromDateTimes(formData.started_at, formData.ended_at).toDuration();
        formData.duration_ms = duration.as('milliseconds');
        formData.duration_iso = duration.toISO();
        formData.currentTime = null;
        
        updateTrack(formData)
        .then(() => {
          if (currentTask) {
            currentTask.tracks.push(formData);
            setCurrentTrack(null);
          }
        })
      }
  }

  const confirmDone = (title: string, message: string, onDone: Function, onCancel: Function) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Yes',
          onPress: () => onDone()
        },
        {
          text: 'No',
          onPress:() => onCancel()
        }
      ]);
  }

  const onDone = async (task: Task) => {
      if (tracker) {
        alert("Stop timer first to mark as done")
        return 
      }

      const dispatchDone = () => {
        task.commit_date = format(new Date(), 'yyyy-MM-dd');
        task.done = true;
        updateTask(task).then(() => {
          ToastAndroid.show('Task completed', ToastAndroid.SHORT)
        })
      }
    
        const unresolvedItems = task.checklist.filter(item => !item.done)
        if (unresolvedItems.length) {
          confirmDone("Are you sure?", `There are ${unresolvedItems.length} unresolved item(s)`, ()=> {
            unresolvedItems.forEach(item => item.done = true);
            dispatchDone();
          }, () => {})

          return
        }

        dispatchDone();
    
  }

  const onRemove = async(task: Task) => {
    if (task && task.uid) {
      confirmDone("Are you sure?", `Are you sure you want to delete this task`, ()=> {
        deleteTask(task).then(() => {
          ToastAndroid.show('Task deleted', ToastAndroid.SHORT)
        });
      }, () => {})
    }
  }

  const RenderBody = () => {
    if (matrix == 'focused' && currentTask) { 
      return (
        <ScrollCard index={1} item={currentTask} 
          onRemove={onRemove}
          onDone={onDone}
        >
        <TaskView task={currentTask} tracker={tracker} onUpdateTimeTask={(data) => updateTask(data)}></TaskView>
      </ScrollCard>)
    } else if (matrix == 'focused' && !currentTask) {
      return (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white'}}> Select a task</Text>
        </View>
      )
    } else {
      return (
        <ScrollCards
          items={matrix == 'todo' ? todo : schedule} 
          onPress={setMainTask}
          onDone={onDone}
          onRemove={onRemove}
        />
      )
    }  
  }

  return (
    <ImageBackground source={images.temple} style={[styles.container, { paddingTop: insets.top, position: 'relative' }]}>
      <LinearGradient
        colors={['rgba(58, 74, 115, .5)', 'rgba(58, 74, 115, .8)', COLORS.primary ]}
        locations={[0, 0.5, 0.7]}
        style={{
          flex: 1,
          width: '100%', 
          height: SIZES.height,
          position: 'absolute',
          marginTop: insets.top,
          paddingBottom: insets.bottom
        }}
      />
      <ScrollView style={{ width: '100%', flex: 1 }}>
        <AppHeader navigation={navigation} user={extraData}></AppHeader>
        <View style={{ flex: 3, justifyContent: "center", alignItems: "center", maxHeight: 250, marginBottom: 40 }}>
          <TimeTracker 
            task={currentTask} 
            onPomodoroStarted={saveLocalTrack} 
            onPomodoroStopped={saveLocalTrack} 
            onTick={setTracker}
          />
        </View>
        <View style={{ 
            marginBottom: 10, 
            justifyContent: 'space-between', 
            flexDirection: 'row', 
            width: '100%',
            paddingHorizontal: SIZES.padding
            
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View style={{width: '100%'}}>
                  <View style={{ 
                    backgroundColor: COLORS.primary, 
                    justifyContent: 'center', 
                    borderRadius: SIZES.radius, 
                    flexDirection: 'row', 
                    borderColor: 'white', 
                    borderWidth: 1,
                    overflow: 'hidden',
                    width: '100%',
                    flex: 1
                  }}>
                    <TouchableOpacity
                       style={{ 
                         height: 40, 
                         width: 100,
                         flex: 1,
                         alignItems: 'center', 
                         justifyContent: 'center', 
                         paddingHorizontal: SIZES.padding / 2 , 
                         backgroundColor: matrix == 'focused' ? COLORS.bgPanelColor : 'transparent'
                        }}
                        onPress={() => { setMatrix('focused')}}
                        >
                      <Text style={{ color: 'white'}}>Focused</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                       style={{ 
                         height: 40, 
                         flex: 1,
                         width: 100,
                         alignItems: 'center', 
                         justifyContent: 'center', 
                         paddingHorizontal: SIZES.padding / 2 , 
                         backgroundColor: matrix == 'todo' ? COLORS.bgPanelColor : 'transparent'
                        }}
                        onPress={() => { setMatrix('todo')}}
                        >
                      <Text style={{ color: 'white'}}>Todo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{ 
                        height: 40, 
                        flex: 1,
                        width: 100,
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        paddingHorizontal: SIZES.padding / 2,
                        backgroundColor: matrix == 'schedule' ? COLORS.bgPanelColor : 'transparent'
                      }}
                      onPress={() => { setMatrix('schedule')}}
                      >
                        <Text style={{ color: 'white'}}> Schedule</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
        </View>
       
          <Animated.View style={{
            width: '100%', 
            paddingVertical: SIZES.padding,
          }}>
            { RenderBody() } 
          </Animated.View>
      </ScrollView>
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
