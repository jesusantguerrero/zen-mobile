import { format, isSameDay } from "date-fns";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"
import { useWeekPager } from "../utils/useWeekPager";
import { COLORS } from "../config/constants";

export default function WeekPager({ onDayChanged }) {
    const { selectedDay, selectedWeek, controls, endDate, startDate, checkWeek } = useWeekPager({ 
        nextMode: 'week'
    }) 

    const [selectedDayLocal, setSelectedDayLocal] = useState(selectedDay);
    const [selectedWeekLocal, setSelectedWeekLocal] = useState(checkWeek());
    
    const getDate  = (date: Date) => {
        return format(date, 'dd');
    }

    const getDayName  = (date: Date) => {
        return format(date, 'iii');
    }

    onDayChanged(selectedDay);

    const changeSelectedDate = (date: Date) => {
        setSelectedDayLocal(date);
        onDayChanged(selectedDay);
    }


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => controls.previous()}>
                <FontAwesome5 name="chevron-left" color="white" size={20}></FontAwesome5>
            </TouchableOpacity>

            { selectedWeekLocal.map(day => {
                return (<TouchableOpacity 
                    style={{ flex: 1, backgroundColor: isSameDay(day, selectedDay) ? COLORS.primary : COLORS.bgPanelColor, width: 20, justifyContent: 'center', alignItems: 'center'}} key={day}
                    onPress={() => changeSelectedDate(day)}
                    >
                    <Text style={{ color: 'white' }}>
                       { getDayName(day) }
                    </Text> 
                    <Text style={{ color: 'white' }}>
                       { getDate(day) }
                    </Text> 
                </TouchableOpacity>)
            })}

            <TouchableOpacity onPress={() => controls.next()}>
                <FontAwesome5 name="chevron-right" color="white" size={20}></FontAwesome5>
            </TouchableOpacity>
        </View>
    )
}