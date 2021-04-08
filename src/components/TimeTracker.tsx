import React, { useEffect, useState } from 'react';
import { InteractionManager, Pressable, StyleSheet, Text, View } from 'react-native';
import { Duration, Interval, DateTime } from "luxon";
import { FONTS, COLORS, SIZES } from "../config/constants";
import { FontAwesome5 } from "@expo/vector-icons"
import { Task } from '../utils/data';

export default function TimeTracker({ task, onPomodoroStarted, onPomodoroStoped, onTick, config } : TimeTrackerProps) {
    const [track, setTrack] = useState<TimeTrack>({
        uid: undefined,
        task_uid: undefined,
        started_at: null,
        ended_at: null,
        type: "promodoro",
        duration: null,
        target_time: null,
        completed: false,
        currentTime: null
    });
      
    const [state, setState] = useState<TimeTrackerState>({
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
        tickTime: 100,
        now: null,
        mode: "promodoro",
        volume: 100,
        timer: null,
        durationTarget: null,
    });

    
    useEffect(() => {
        if (task && task.uid) {
            setTrack({...track, task_uid: task.uid })
        }
        setState({ ...state, ...config})
    }, [])

    useEffect(() => {
        if (track.started_at) {
            const timer = setInterval(() => {
                setState({ ...state, now: new Date(Date.now()), timer: state.timer || timer })
            }, state.tickTime);
        }
    }, [track.started_at])

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

    const [targetTime, setTargetTime] = useState<DateTime|null>(null);
    
    useEffect(() => {
        if (track.started_at && state.now && state.durationTarget) {
            setTargetTime(DateTime.fromJSDate(track.started_at).plus(state.durationTarget));
        } else {
            onTick(null);
            setTargetTime(null)
        }
    }, []);
      
    const [currentTime, setCurrentTime] = useState(state.durationTarget ? state.durationTarget.toFormat("mm:ss") : "00:00");
    const updateCurrentTime = (timeString: string) => {
        if (timeString != currentTime) {
            setCurrentTime(timeString)
            onTick(track.currentTime)
        }
    }

    useEffect(() => {
        if (track.started_at && state.now ) {
            let duration: Duration | null = Interval.fromDateTimes(track.started_at, state.now).toDuration()
            track.currentTime = duration;
            if (duration && state.durationTarget) {
                duration =  state.durationTarget.minus(duration).plus({ seconds: 0.9 });
                if (duration) {
                    updateCurrentTime(duration.as("seconds") < 0 ? "00:00" : duration.toFormat("mm:ss"));
                }
            } else {
                updateCurrentTime("00:00");
            }
        } else {
            if (state.durationTarget) {
                updateCurrentTime(state.durationTarget.toFormat("mm:ss"));
            }
        }
    }, [track.started_at, state.now]);
      
      
    useEffect(() => {
        if (targetTime && state.now && targetTime.diffNow().as('seconds') < 0) {
            setTrack({...track, completed: true });
            stop();
        }
    }, [targetTime, state.now]);
      
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
        const startDate = new Date(Date.now())
        setTrack({...track, started_at: startDate});
        setState({...state, now: startDate });
    };
    
    const stop = (shouldCallNextMode: boolean|null = true, silent: boolean|null = false) => {
        setTrack({...track, ended_at: new Date(Date.now()) });
    
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
                    <Text style={styles.clockText} testID='txtTime'>
                        {currentTime}
                    </Text> 
                </View>
                <Pressable 
                    testID='btnPlay'
                    style={{ 
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
                    onPress={() => toggleTracker()}
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


type TimeTrackerProps = {
    onPomodoroStarted: (data: any) => {},
    onPomodoroStoped: (data: any) => {},
    onTick: (data: any) => {},
    task: Task,
    config: TimeTrackerConfig
}

type TimeTrack = {
    uid: string | undefined,
    task_uid: string | undefined,
    started_at: Date | null ,
    ended_at: Date | null,
    type: "promodoro" | 'stopwatch' | 'timer',
    duration: string | null,
    target_time: string| null,
    completed: boolean,
    currentTime: Duration| null
}

type TimeTrackerState = {
    template: string[],
    currentStep: 0,
    modes: TimeTrackerModes
    now: null | Date,
    mode: "promodoro" | 'long' | 'rest',
    volume: number,
    timer: null | NodeJS.Timeout,
    pushSubscription: null,
    durationTarget: null | Duration,
    tickTime: number
}

type TimeTrackerModes = {
    promodoro: TimeTrackerMode,
    long: TimeTrackerMode,
    rest: TimeTrackerMode
}

type TimeTrackerMode = {
    label: string,
    min: number,
    sec: number,
    color: string,
    colorBg: string,
    colorBorder: string,
}

type TimeTrackerConfig = {
    tickTime: number
}