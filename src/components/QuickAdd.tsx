import React from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { COLORS, FONTS, SIZES } from "../config/constants";
import { useState } from "react";
import { format } from "date-fns";
import { useTaskFirestore } from "../utils/useTaskFirestore"

export default function QuickAdd ({ onSave, onCancel, user}) {
    const [task, setTask] = useState({
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
        formData.due_date = formData.due_date ? format(formData.due_date, "yyyy-MM-dd") : ""
        saveTaskToDb(formData).then(() => {
            clearForm()
            onSave(formData)
        });
    }
    return (<View style={{ 
        padding: SIZES.padding, 
        backgroundColor: '#191F30',  
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14 
    }}>
      <View >
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
            <FontAwesome5 color='white' name='calendar'  size={16}></FontAwesome5>
          </View>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            <FontAwesome5 color='white' name='tags'  size={16}></FontAwesome5>
          </View>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            <FontAwesome5 color='white' name='user'  size={16}></FontAwesome5>
          </View>
          <View style={{ paddingLeft: 5, paddingRight: 5 , flexDirection: 'row' }}>
            <FontAwesome5 color='white' name='user'  size={16}></FontAwesome5>
            <Text style={{ color: 'white'}}> { task.matrix }</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onCancel}>
              <Text style={{color: COLORS.red[400], fontWeight: 'bold'}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 10 }}  onPress={() => { saveTask() }}>
              <FontAwesome5 color={COLORS.green[400]} name='paper-plane' size={16} ></FontAwesome5>
          </TouchableOpacity>
        </View>
      </View>
    </View>)
}