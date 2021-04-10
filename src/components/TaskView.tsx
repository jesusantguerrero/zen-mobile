import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { FONTS, COLORS, SIZES, theme } from "../config/constants";
import { useDateTime } from "../utils/useDateTime";
import { Task } from '../utils/data';
import { Duration } from 'luxon';

export default function TaskView({ task, tracker, onUpdateTimeTask }: TaskViewProps) {

    const { formatDurationFromMs } = useDateTime()
    const [timeTracked, setTimeTracked] = useState("00:00:00");

    const timeReducer = (tracks: any[]) => {
        if (!tracks) return 0
        return tracks.reduce((milliseconds, track)=> {
            const duration = track.duration_ms ? Number(track.duration_ms) : 0
            return milliseconds + duration;
        }, 0)
    }

    const getActiveTimer = (tracker: Duration) => {
        if (tracker) {
            return tracker.as("milliseconds");
        }
        return 0;
    }

    useEffect(() => {
        if (task && tracker) {
            const savedTime = timeReducer(task.tracks)
            const activeTimer = getActiveTimer(tracker);
            setTimeTracked(formatDurationFromMs(savedTime + activeTimer).toFormat("hh:mm:ss"));
        }
    }, [tracker, task])

    return (
        <View style={styles.container}>
          { !task ? null : 
          <View style={{ flex: 1 , justifyContent: "space-between", flexDirection: "row", width: '100%', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding  }}>
            <Text style={{ ...FONTS.h4,  color: 'white' }}>
                {task.title}
            </Text>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: 'center'}}>
                <Text style={styles.entityText}>
                    {task.due_date || '---- -- --'}
                </Text>
            </View>
          </View>}

          { !task ? null : 
          <View>
            <View style={{ flex: 6, flexDirection: "row", marginTop: 30 , justifyContent: 'space-between', paddingHorizontal: SIZES.padding }}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome5 key="fa-home" name="stopwatch" size={16} color="white"></FontAwesome5>
                    <Text style={{...FONTS.body4,  color: 'white', textAlign: 'left', marginLeft: 5, fontWeight: 'bold' }}>
                        { timeTracked }
                    </Text>
                </View> 
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome5 key="fa-home" name="stopwatch" size={16} color={COLORS.blue[400]}></FontAwesome5>
                    <Text style={{...FONTS.body4,  color: COLORS.blue[400], textAlign: 'left', marginLeft: 5, fontWeight: 'bold' }}>
                        Started: { task.tracks.length }
                    </Text>
                </View> 
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome5 key="fa-home" name="stopwatch" size={16} color={COLORS.green[400]}></FontAwesome5>
                    <Text style={{...FONTS.body4,  color: COLORS.green[400], textAlign: 'left', marginLeft: 5, fontWeight: 'bold' }}>
                        Completed: {  task.tracks.filter(track => track.completed).length }
                    </Text>
                </View> 
            </View>

            <View style={{ padding: SIZES.padding }}>
                { task.checklist.map((item, index) => {
                    return (<Text style={{color:'white'}}>{index+1} - {item.title}</Text>)
                })}
            </View>
          </View>
          }


          <View style={{ 
            backgroundColor: COLORS.bgPanelColor, 
            paddingHorizontal: SIZES.padding, 
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            borderTopColor: COLORS.primary,
            borderTopWidth: 1,
            paddingVertical: 8
        }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5  name="check-circle" size={14} color="white"></FontAwesome5>
                <Text style={{marginLeft: 3, color: 'white'}}> Mark as done </Text>
                </TouchableOpacity>
        
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5 key="fa-home" name="calendar" size={14} color={COLORS.blue[300]}></FontAwesome5>
                    <Text style={{  color: COLORS.blue[300], marginLeft: 5 , fontWeight: 'bold'}}> Edit
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 150,
        backgroundColor: COLORS.bgPanelColor,
        overflow: 'hidden',
    },
    entityText: {
        fontSize: 14,
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold'
    },
    entityDate: {
        fontSize: 14,
        color: '#60A5FA',
        fontWeight: "bold",
        marginRight: 5
    },
})

type TaskViewProps = {
    task: Task,
    tracker: Duration | null,
    onUpdateTimeTask: (data: any) => {}
  }