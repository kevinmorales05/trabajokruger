
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDM9sFzS8TmOXOqdmK4UqdqxuVWBK6UI64",
    authDomain: "ejerciciofirestore.firebaseapp.com",
    projectId: "ejerciciofirestore",
    storageBucket: "ejerciciofirestore.appspot.com",
    messagingSenderId: "250438100379",
    appId: "1:250438100379:web:6131adf187f83bfb456d3e"
  };

firebase.initializeApp(firebaseConfig);

export {firebase};