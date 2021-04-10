import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Animated, ImageBackground, TouchableOpacity, ToastAndroid } from 'react-native';
import TodoScroll from "../../components/ScrollCards";
import TaskView from "../../components/TaskView";
import TimeTracker, { TimeTrack } from "../../components/TimeTracker";
import ScrollCard from "../../components/ScrollCard";
import { useTaskFirestore } from "../../utils/useTaskFirestore";
import { useTrackFirestore } from "../../utils/useTrackFirestore";
import { images, SIZES, FONTS, COLORS } from "../../config/constants";
import AppHeader from '../../components/AppHeader';
import AuthContext from '../../utils/AuthContext';
import { LinearGradient } from "expo-linear-gradient";
import firebase from 'firebase';
import { Task } from '../../utils/data';
import { ZenboardScreenProps } from "../../navigators/main"
import { Interval } from 'luxon';
import { ScrollView } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import AppSelector from "../../components/AppSelector";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const quadrants = [
  {key: 'todo', label: 'Todo'}, 
  {key: 'schedule', label: 'Schedule'}, 
];

export default function ZenboardScreen( { navigation }: ZenboardScreenProps ) {
  const insets = useSafeAreaInsets();

  const { extraData } = useContext(AuthContext);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TimeTrack | null>(null);
  const [showLineUp, setShowLineUp] = useState(false);
  const [ matrix, setMatrix ] = useState('focused')
  const [ showMatrix, setShowMatrix ] = useState(false)
  const [ todo, setTodo ] = useState([])
  const [ schedule, setSchedule ] = useState([])
  const { getTaskByMatrix, mapTask, updateTask } = useTaskFirestore()
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
              setMainTask(results[0])
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
  const { getAllTracksOfTask, saveTrack, updateTrack } = useTrackFirestore();
  const setMainTask = async (task: Task) => {
    const current = {...task}
    if (task.uid) {
      current.tracks = await getAllTracksOfTask(task.uid)
    }
    setCurrentTask(current)
    setShowLineUp(false);
  }

  const viewPadding = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(viewPadding, {
        toValue: SIZES.padding,
        duration: 500,
        useNativeDriver: false
    }).start()
    
    return () => {
      Animated.timing(viewPadding, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false
      }).start()

    }
  }, [])

  // tracker
  const [tracker, setTracker] = useState(null);
  const saveLocalTrack = (track: TimeTrack) => {
    if (currentTrack && currentTrack?.uid) {
      updateLocalTrack({...track, uid: currentTrack.uid})
    } else {
      createTrack(track)
    }
  }

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
        <View style={{width: '100%', paddingHorizontal: SIZES.padding, paddingBottom: SIZES.padding }}>
          <Text style={{...FONTS.h3, color: 'white', fontWeight: 'bold'}}>Welcome, { 'Jesus sempai' || extraData?.email }</Text>
        </View>
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
             {matrix == 'focused' ? 
            <ScrollCard index={1} item={currentTask} 
              onRemove={() => {

              }}
              onDone={async (task: Task) => {
                if (tracker) {
                  alert("Stop timer first to mark as done")
                  return 
                }
              
                  const unresolvedItems = task.checklist.filter(item => !item.done)
                  let canSave = true;
                  if (unresolvedItems.length) {
                    canSave = await confirm(`There are ${unresolvedItems.length} unresolved item(s)`)
                    canSave && unresolvedItems.forEach(item => item.done = true);
                  }
                  
                  if (!canSave) return
                
                  task.commit_date = format(new Date(), 'yyyy-MM-dd');
                  task.done = true;
                  updateTask(task).then(() => {
                    ToastAndroid.show('Task completed', ToastAndroid.SHORT)
                  })

              }}
              >
              <TaskView task={currentTask} tracker={tracker} onUpdateTimeTask={(data) => updateTask(data)}></TaskView>
            </ScrollCard>
            : <TodoScroll
              items={matrix == 'todo' ? todo : schedule} 
              onPress={setMainTask}
            />}    
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
