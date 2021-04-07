import React, { useEffect, useRef } from "react";
import { TextInput, View, TouchableOpacity, Text, Animated, Easing } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { COLORS, SIZES } from "../config/constants";
import { useState } from "react";
import { format, toDate } from "date-fns";
import { useTaskFirestore } from "../utils/useTaskFirestore"
import firebase from "firebase";
import { Task } from "../utils/data";
import { isDate } from "date-fns/esm";

export default function QuickAdd ({ onSave, onCancel, user}: QuickAddProps) {
    const [task, setTask] = useState<Task>({
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
          toValue: 120,
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

    return (<Animated.View style={{ 
        padding: SIZES.padding, 
        backgroundColor: '#191F30',  
        height: viewHeight,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14 
    }}>
      <View >
        <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row', marginBottom: 10 }}>
            <FontAwesome5 color='white' name='list'  size={16}></FontAwesome5>
            <Text style={{ color: 'white', marginLeft: 5, textTransform: 'capitalize' }}> { task.matrix }</Text>
        </View>
        <TextInput 
            placeholder="Add quick task" 
            style={{ color: 'white' }} 
            onChangeText={(text) => setTask((oldTask) => {return {...oldTask, title: text }})}

        >

        </TextInput>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
        <View style={{ flexDirection: 'row'}}>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            <FontAwesome5 color='white' name='calendar'  size={20}></FontAwesome5>
          </View>
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
          <TouchableOpacity style={{ marginLeft: 10 }}  onPress={() => { saveTask() }}>
              <FontAwesome5 color={COLORS.green[400]} name='paper-plane' size={20} ></FontAwesome5>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>)
}


type QuickAddProps = {
  onSave: (task: Task) => {},
  onCancel: () => {},
  user: firebase.User
}