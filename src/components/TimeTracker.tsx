import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Duration, Interval, DateTime } from "luxon";
import { FONTS, COLORS, SIZES } from "../config/constants";
import { FontAwesome5 } from "@expo/vector-icons"

export default function TimeTracker({ task}) {
    const [track, setTrack] = useState({
        uid: null,
        task_uid: null,
        started_at: null,
        ended_at: null,
        type: "promodoro",
        duration: null,
        target_time: null,
        completed: false
      });
      
    const [state, setState] = useState({
    template: [
        "promodoro",
        "rest",
        "promodoro",
        "rest",
        "promodoro",
        "rest",
        "promodoro",
        "long",
    ],
    currentStep: 0,
    modes: {
        long: {
        label: "Long Rest",
        min: 15,
        sec: 0,
        color: "text-green-400",
        colorBg: "bg-green-400",
        colorBorder: "border-green-400",
        },
        promodoro: {
        min: 25,
        sec: 0,
        color: "text-red-400",
        colorBg: "bg-red-400",
        colorBorder: "border-red-400",
        text: "Pomodoro session",
        },
        rest: {
        min: 5,
        sec: 0,
        color: "text-blue-400",
        colorBg: "bg-blue-400",
        colorBorder: "border-blue-400",
        text: "Take a short break",
        },
    },
    now: null,
    mode: "promodoro",
    volume: 100,
    timer: null,
    pushSubscription: null,
    durationTarget: null,
    });

    // ui
    const trackerIcon = () => state.now ? 'stop': 'play';
    const trackerText = () => state.now ? 'Stop': 'Start';
    const trackerMode = () => state.modes[state.mode];


    // Time manipulation
    const setDurationTarget = () => {
        const { min, sec } = state.modes[state.mode];
        state.durationTarget = Duration.fromISO(`PT${min}M${sec}S`);
    };
  
    setDurationTarget();

    const [targetTime, setTargetTime] = useState(null);
    
    useEffect(() => {
        if (track.started_at && state.now) {
            setTargetTime(DateTime.fromJSDate(track.started_at).plus(state.durationTarget));
        } else {
            setTargetTime(null)
        }
    }, [track.started_at, state.now]);
      
    const [currentTime, setCurrentTime] = useState(state.durationTarget ? state.durationTarget.toFormat("mm:ss") : "00:00");
    const updateCurrentTime = (time) => {
        if (time != currentTime) {
            setCurrentTime(time)
        }
    }
    useEffect(() => {
        if (track.started_at && state.now && state.durationTarget) {
            let duration = Interval.fromDateTimes(track.started_at, state.now).toDuration()
            track.currentTime = duration;
            if (duration) {
                duration = state.durationTarget.minus(duration).plus({ seconds: 0.9 });
                updateCurrentTime(duration.as("seconds") < 0 ? "00:00" : duration.toFormat("mm:ss"));
            } else {
                updateCurrentTime("00:00");
            }
        } else {
            updateCurrentTime(state.durationTarget.toFormat("mm:ss"));
        }
    }, [track.started_at, state.now, state.durationTarget]);
      
      
    useEffect(() => {
        if (targetTime && state.now && targetTime.diffNow() < 0) {
            setState({...state, completed: true });
            stop();
        }
    }, [targetTime, state.now ]);
      
    // state
    const clearTrack = () => {
        if (state.timer) {
            clearInterval(state.timer);
        }
        
        setTrack({
            ...track, 
            started_at: null,
            ended_at: null,
            duration: null,
            target_time: null,
            completed: false
        })
    };
  
   // Controls
    const toggleTracker = () => {
        track.started_at ? stop(null, true) : play();
    };
    
    const play = () => {    
        const startDate = new Date()
        setTrack({...track, started_at: startDate});
        setState({...state, now: startDate });
        const timer = setInterval(() => {
            setState({ ...state, now: new Date(), timer: timer })
        }, 100);
    };
    
    const stop = (shouldCallNextMode = true, silent = false) => {
        setTrack({...track, ended_at: new Date() });
    
        const wasRunning = Boolean(state.now);
        const previousMode = state.mode;
        const message = track.completed ? "finished" : "stopped";
        
        clearTrack();
        if (state.timer) {
            clearInterval(state.timer);
            setState({...state, now: null, timer: null });
        }   
    };
    
    const nextMode = () => {
        if (state.now) {
        stop(false);
        }
    
        const canIncrement = state.currentStep < state.template.length - 1;
        const nextMode = canIncrement ? state.currentStep + 1 : 0;
        setState({...state, mode: state.template[nextMode], currentStep: nextMode });
        setDurationTarget();
    };

    return (
        <View style={styles.entityContainer}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: "flex-end", maxHeight: 100 }}>
                    <Text style={styles.clockText}>
                        {currentTime}
                    </Text> 
                </View>
                <Pressable style={{ 
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        justifyContent: "center",
                        alignItems: 'center',
                        flexDirection: "row", 
                        borderRadius: SIZES.radius + 2,
                        maxHeight: 40,
                        minHeight: 40,
                        padding: 10,
                        width: 100
                    }}
                    onPress={toggleTracker}
                >
                    <FontAwesome5 name={trackerIcon()} color="white" style={{ marginRight: 5 }}></FontAwesome5>
                    <Text style={styles.entityTitle}>
                        { trackerText() }
                    </Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    entityContainer: {
        flex: 1,
        marginTop: 16,
        width: "100%",
        textAlign: "center",
        justifyContent:"center",
        alignItems: "center",
        minHeight: 40,
        borderRadius: 100,
        borderWidth: 3,
        maxWidth: 200,
        minWidth: 200,
        maxHeight: 200,
        height: 200,
        padding: SIZES.padding,
        borderColor: 'white',
        overflow: 'hidden'
    },
    entityTitle: {
        fontSize: 14,
        color: 'white',
        marginRight: 5
    },
    clockText: {
        marginRight: 5,
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold'
    },
    entityDate: {
        fontSize: 14,
        color: '#60A5FA',
        fontWeight: "bold",
        marginRight: 5
    },
})