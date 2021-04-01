import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/messaging";
import "firebase/functions"
import "firebase/performance"

const firebaseConfig = {
    apiKey: "AIzaSyAbdYdOOW6GSl0upqGnClM_gENLHLhlDMQ",
    authDomain: "appzen-367e1.firebaseapp.com",
    databaseURL: "https://appzen-367e1-default-rtdb.firebaseio.com",
    projectId: "appzen-367e1",
    storageBucket: "appzen-367e1.appspot.com",
    messagingSenderId: "505825563328",
    appId: "1:505825563328:web:a38fbb124b3e8195cd1325",
    measurementId: "G-T2DK41WYM1"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

firebase.performance()
firebase.analytics()


export const register = async (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password).catch(reason => {
        throw new Error(reason.message);
    })
}

export const login = async (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password).catch((reason) => {
        throw new Error(reason.message);
    })
}

export const loginWithProvider = async(providerName) => {
    firebase.auth().getRedirectResult().then(result => {
        firebaseState.user = result.user
    })

    firebase.auth().signInWithPopup(getProvider(providerName)).then(() => {
        location.reload()
    })
}

const getProvider = (providerName) => {
    const providers = {
        google: {
            method: new firebase.auth.GoogleAuthProvider,
            scopes: ['profile', 'email']
        }
    }
    const providerData = providers[providerName]
    if (providerData) {
        const provider = providerData.method;
        providerData.scopes.forEach(() => {
            provider.addScope('profile');
            provider.addScope('email');
        })
        return provider;
    }
}

export const logout = () => {
    return firebase.auth().signOut()
}

// Database
export const db = firebase.firestore();
export const updateSettings = (settings) => {
    return updateUserSettings({
        user_uid: firebaseState.user.uid,
        uid: firebaseState.user.uid,
        ...settings
    }).then(() => {
        firebaseState.settings =  Object.assign(firebaseState.settings || {}, settings)
    })

}

const initFirebase = new Promise(resolve => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
           
        }
        resolve(user);
    })
})

export { firebase };

export const isAuthenticated = () => {
    return initFirebase;
}

