import React, { useEffect, useRef } from "react";
import { TextInput, View, TouchableOpacity, Text, Animated, Easing, Platform } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { COLORS, SIZES } from "../config/constants";
import { useState } from "react";
import { format, toDate } from "date-fns";
import { useTaskFirestore } from "../utils/useTaskFirestore"
import firebase from "firebase";
import { Task } from "../utils/data";
import { isDate } from "date-fns/esm";
import DateTimePicker from '@react-native-community/datetimepicker';
import AppSelector from "./AppSelector";





export default function QuickAdd ({ onSave, onCancel, user}: QuickAddProps) {
    const [task, setTask] = useState<Task>({
        uid: null,
        title: "",
        description: "",
        due_date: "",
        duration: "",
        tags: [],
        contacts: [],
        checklist: [],
        tracks: [],
        order: 0,
        duration_ms: 0,
        done: false,
        commit_date: null,
        matrix: "todo",
    })
    const matrix = [
      {key: 'todo', label: 'Todo'}, 
      {key: 'schedule', label: 'Schedule'}, 
      {key: 'delegate', label: 'Delegate'}, 
      {key: 'delete', label: 'Delete'}, 
      {key: 'backlog', label: 'Backlog'}
    ];
    const [showMatrix, setShowMatrix] = useState(false)
    const [show, setShow] = useState(false)
    const [date, setDate] = useState(new Date())

    const clearForm = () => {
        setTask({
            uid: undefined,
            title: "",
            description: "",
            due_date: "",
            duration: "",
            tags: [],
            contacts: [],
            checklist: [],
            tracks: [],
            order: 0,
            duration_ms: 0,
            done: false,
            commit_date: null,
            matrix: "todo",
        })
    }

    const { saveTask: saveTaskToDb } = useTaskFirestore(user);

    const saveTask = () => {
        const formData = { ...task }
        if (typeof formData.due_date != 'string' && isDate(formData.due_date)) {
            formData.due_date = format(formData.due_date, "yyyy-MM-dd");
        }
        saveTaskToDb(formData).then(() => {
            clearForm()
            onSave(formData)
        });
    }

    const viewHeight = useRef(new Animated.Value(60)).current; 

    useEffect(() => {
      Animated.timing(viewHeight, {
          toValue: 150,
          duration: 200,
          useNativeDriver: false
      }).start()
      
      return () => {
        Animated.timing(viewHeight, {
            toValue: 60,
            duration: 200,
            useNativeDriver: false
        }).start()

      }
    }, [])

    const onChangeDate = (event, selectedDate: Date) => {
      const currentDate = selectedDate;
      if (currentDate) {
        setDate(currentDate);
        setTask({ ...task, due_date: format(currentDate, 'yyyy-MM-dd') });
      }
      setShow(false);
    };

    return (<Animated.View style={{ 
        padding: SIZES.padding, 
        backgroundColor: '#191F30',  
        height: viewHeight,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14 
    }}>
      <View >
        <AppSelector
          testID="pckMatrix"
          value={task.matrix}
          data={matrix}
          onClose={() => {setShowMatrix(false)}}
          onChange={(value: "todo" | "schedule" | "delegate" | "delete" | "backlog") =>
            setTask({...task, matrix: value})
          } 
        >
        </AppSelector>
        <TextInput 
            placeholder="Add quick task" 
            style={{ color: 'white' }}
            placeholderTextColor='white' 
            onChangeText={(text) => setTask((oldTask) => {return {...oldTask, title: text }})}

        >
        </TextInput>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setShow(true)} style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 color='white' name='calendar'  size={20}></FontAwesome5>
            <Text> { task.due_date }</Text>
          </TouchableOpacity>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            <FontAwesome5 color='white' name='tags'  size={20}></FontAwesome5>
          </View>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            <FontAwesome5 color='white' name='user'  size={20}></FontAwesome5>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onCancel}>
              <Text style={{color: COLORS.red[400], fontWeight: 'bold'}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15, backgroundColor: COLORS.green[600], height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 35 }}  onPress={() => { saveTask() }}>
              <FontAwesome5 color='white' name='paper-plane' size={20} ></FontAwesome5>
          </TouchableOpacity>
        </View>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          is24Hour={true}
          display="default"
          textColor="red"
          onChange={onChangeDate}
        />
      )}
    </Animated.View>)
}


type QuickAddProps = {
  onSave: (task: Task) => {},
  onCancel: () => {},
  user: firebase.User
}