import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Duration, Interval, DateTime } from "luxon";
import { FONTS, COLORS, SIZES } from "../config/constants";
import { FontAwesome5 } from "@expo/vector-icons"
import { Task } from '../utils/data';

export default function TimeTracker({ task, onPomodoroStarted, onPomodoroStopped, onTick, config } : TimeTrackerProps) {
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
                color: COLORS.green[400],
                text: "Take a longer brake",
            },
            promodoro: {
                label: 'Pomodoro',
                min: 25,
                sec: 0,
                color: COLORS.red[400],
                text: "Pomodoro session",
            },
            rest: {
                label: 'Rest',
                min: 5,
                sec: 0,
                color: COLORS.blue[400],
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

    const [trackerMode, setTrackerMode] = useState(state.modes.promodoro);

    useEffect(() => {
        setTrackerMode(state.modes[state.mode] || state.modes.promodoro)
    }, [state.mode])

    // ui
    const trackerIcon = () => state.now ? 'stop': 'play';


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
            setTargetTime(null)
        }
    }, []);
      
    const [currentTime, setCurrentTime] = useState(state.durationTarget ? state.durationTarget.toFormat("mm:ss") : "00:00");
    const updateCurrentTime = (timeString: string) => {
        if (timeString != currentTime) {
            setCurrentTime(timeString)
            if (state.now) {
                onTick(track.currentTime)
            }
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

    const isPomodoro = () => {
        return state.mode == 'promodoro';
      }
    
    const play = () => {    
        const startDate = new Date(Date.now())
        setTrack({...track, started_at: startDate});
        setState({...state, now: startDate });

        if (isPomodoro()) {
            onPomodoroStarted(track);
        }

    };
    
    const stop = (shouldCallNextMode: boolean|null = true, silent: boolean|null = false) => {
        const endDate = new Date(Date.now()) 
        setTrack((oldTrack) => {return {...oldTrack, ended_at: endDate}});
        if (isPomodoro() && state.now) {
            if (track.started_at) {
                const duration = Interval.fromDateTimes(track.started_at, endDate).toDuration();
                onPomodoroStopped({ 
                    ...track,
                    ended_at: endDate,
                    duration_ms: duration.as('milliseconds'),
                    duration_iso: duration.toISO(),
                });
            }
        }
    
        const wasRunning = Boolean(state.now);
        const previousMode = state.mode;
        const message = track.completed ? "finished" : "stopped";
        
        clearTrack();
        if (state.timer) {
            clearInterval(state.timer);
            setState({...state, now: null, timer: null });
            onTick(null)
        }   
    };
    
    const previousMode = () => {
        if (state.now) {
            stop(false);
        }
    
        const canDecrement = state.currentStep > 0;
        const nextMode = canDecrement ? state.currentStep - 1 : 0;
        setState({...state, mode: state.template[nextMode], currentStep: nextMode });
        setDurationTarget();
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
        <>
            <Text style={{ color: trackerMode.color, ...FONTS.h2, fontWeight: 'bold' }}> { trackerMode.label }: </Text>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginBottom: SIZES.padding / 3 }}> { trackerMode.text }! </Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
            }}>
                {/* Left Arrow */}
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '33%', opacity: state.currentStep == 0 ? 0.3 : 1 }} onPress={() => previousMode()}>
                    <FontAwesome5 name="chevron-left" color="white" size={40}></FontAwesome5>
                </TouchableOpacity>

                {/* Clock */}
                <TouchableOpacity style={styles.entityContainer}   
                    testID='btnPlay'
                    onPress={() => toggleTracker()}
                >
                    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "flex-end", maxHeight: 100 }}>
                        <Text style={styles.clockText} testID='txtTime'>
                            {currentTime}
                        </Text> 
                    </View>
                    <View 
                        testID='btnPlay'
                        style={{ 
                                flex: 1,
                                justifyContent: "center",
                                alignItems: 'center',
                                flexDirection: "row", 
                                borderRadius: SIZES.radius + 2,
                                maxHeight: 40,
                                minHeight: 40,
                                padding: 10,
                                width: 100,
                        }}
                    >
                        <FontAwesome5 name={trackerIcon()} color="white" size={30}></FontAwesome5>
                    </View>
                </TouchableOpacity>

                {/* Left arrow */}

                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '33%' }} onPress={() => nextMode()}>
                    <FontAwesome5 name="chevron-right" color="white" size={40}></FontAwesome5>
                </TouchableOpacity>
            </View>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: SIZES.padding / 2 }}> Round: { trackerMode.text }! </Text>
        </>
    )
}


const styles = StyleSheet.create({
    entityContainer: {
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
        paddingVertical: SIZES.padding,
        borderColor: 'white',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
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
    onPomodoroStopped: (data: any) => {},
    onTick: (data: any) => {},
    task: Task,
    config: TimeTrackerConfig
}

export type TimeTrack = {
    uid: string | null,
    task_uid: string | null,
    description: string | null,
    started_at: Date | null ,
    ended_at: Date | null,
    type: "promodoro" | 'stopwatch' | 'timer',
    duration: string | null,
    target_time: string| null,
    completed: boolean,
    currentTime: Duration | null
    duration_ms: number
    duration_iso: string
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
    text: string
}

type TimeTrackerConfig = {
    tickTime: number
}