import { format as formatDate} from "date-fns"
import firebase from "firebase";
import { Task } from "./data";
import { db } from "./useFirebase";
const collectionName = "tasks";

const getDate = (task: Task) => {
    return task.due_date instanceof Date ? formatDate(task.due_date, "yyyy-MM-dd") : task.due_date;
}

export function useTaskFirestore() {
    const user = firebase.auth().currentUser
    const saveTask = (task: Task) => {
        if (task.due_date) {
            task.due_date = getDate(task)
        }
        return db.collection(collectionName).add({
            ...task,
            user_uid: user.uid,
            created_at: new Date()
        })
        .then((docRef) => {
            return docRef.id;
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    const updateTask = (task: Task) => {
        const trackRef = db.collection(collectionName).doc(task.uid)
        if (task.due_date) {
            task.due_date = getDate(task)
        }
        return trackRef.update(task)
        .then(() => {
            return task.uid;
        })
    }

    const updateTaskBatch = (tasks: Task[]) => {
        const batch = db.batch()
        tasks.forEach((task) => {
            const trackRef = db.collection(collectionName).doc(task.uid)
            trackRef.update({
                order: task.order
            }, { merge: true })

        })
        return batch.commit().then(() => {
            return
        })
        .then(() => {
            return tasks;
        })
    }

    const deleteTask = (task: Task) => {
        return db.collection(collectionName).doc(task.uid).delete()
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    const getAllFromUser = async (where = {}) => {
        const tasks = [];
        await db.collection(collectionName).where("user_uid", "==", user.uid).get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                tasks.push({...doc.data(), uid: doc.id });
            });
        })

        return tasks;
    }

    const getCommitedTasks = async (date = new Date()) => {
        const tasks = [];
        const commitDate = formatDate(date, 'yyyy-MM-dd')
        await db.collection(collectionName)
        .where("user_uid", "==", user.uid)
        .where("done", "==", true)
        .where("commit_date", "==", commitDate)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                tasks.push({...doc.data(), uid: doc.id });
            });
        })

        return tasks;
    }

    const getUncommitedTasks = async (date: string, userUuid: string) => {
        const tasks:Task[] = [];
        await db.collection(collectionName)
        .where("user_uid", "==", userUuid || user.uid)
        .where("done", "==", false)
        .orderBy("order")
        .get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
            querySnapshot.forEach((doc) => {
                tasks.push(mapTask(doc.data(), doc.id ));
            });
        })
        return tasks;
    }

    const getTaskByMatrix = async (matrix: string) => {
        const matrixRef = db.collection(collectionName)
            .where("user_uid", "==", user.uid)
            .where("done", "==", false)
            .where("matrix", "==", matrix)
            .orderBy("order")
            
        return matrixRef
    }

    const mapTask = (data: firebase.firestore.DocumentData, id: string) => {
        return {
            uid: id,
            done: data.done,
            title: data.title,
            description: data.description,
            commit_date: data.commit_date,
            contacts: data.contacts,
            due_date: data.due_date,
            duration: data.duration,
            duration_ms: data.duration_ms,
            matrix: data.matrix,
            order: data.order,
            tags: data.tags,
            tracks: [],
            checklist: data.checklist,
          }
    }

    return {
        saveTask,
        updateTask,
        updateTaskBatch,
        deleteTask,
        getTaskByMatrix,
        getUncommitedTasks,
        getCommitedTasks,
        getAllFromUser,
        mapTask
    }

}
