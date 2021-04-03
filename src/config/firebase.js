import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAbdYdOOW6GSl0upqGnClM_gENLHLhlDMQ",
    authDomain: "appzen-367e1.firebaseapp.com",
    databaseURL: "https://appzen-367e1-default-rtdb.firebaseio.com",
    projectId: "appzen-367e1",
    storageBucket: "appzen-367e1.appspot.com",
    messagingSenderId: "505825563328",
    appId: "1:505825563328:web:a38fbb124b3e8195cd1325",
    measurementId: "G-T2DK41WYM1"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };