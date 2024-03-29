import { DateTime } from "luxon";
import { TimeTrack } from "../components/TimeTracker";
import { db, firebase} from "./useFirebase";

export function useTrackFirestore() {
    const user = firebase.auth().currentUser
    const saveTrack = (track: TimeTrack) => {
        return db.collection("tracks").add({
            ...track,
            user_uid: user.uid,
            created_at: new Date()
        })
        .then(docRef => {
            return docRef.id
        })
    }

    const updateTrack = (track: TimeTrack) => {
            const trackRef = db.collection("tracks").doc(track.uid)
            return trackRef.set(track, { merge: true })
            .then(() => {
                return track.uid;
            })

    }

    const deleteTrack = (track: TimeTrack) => {
        return db.collection("tracks").doc(track.uid).delete()
        .then(docRef => {
            return docRef.id
        })
    }

    const getAllTracksOfTask = async (taskId: string) => {
        const tracks: any[] = [];
        await db.collection('tracks').where(
            'task_uid', '==', taskId 
        ).where("user_uid", "==", user.uid).get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                tracks.push({...doc.data(), uid: doc.id });
            });
        })
        return tracks;
    }

    const getAllTracks = async (where = {}) => {
        const tracks: any[] = [];
        await db.collection('tracks').get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                tracks.push({...doc.data(), uid: doc.id });
            });
        })

        return tracks;
    }

    const getTracksByDates = async (startDate: Date = new Date(), endDate: Date | null) => {
        const start = new Date(DateTime.fromJSDate(startDate).startOf('day').toJSDate())
        const end = new Date(DateTime.fromJSDate(endDate || startDate).endOf('day').toJSDate())
        
        const trackRef = db.collection('tracks')
        .where("user_uid", "==", user.uid)
        .where('started_at', ">=", start)
        .where('started_at', "<=", end)
        return trackRef
    }

    return {
        saveTrack,
        deleteTrack,
        updateTrack,
        getAllTracks,
        getAllTracksOfTask,
        getTracksByDates
    }

}