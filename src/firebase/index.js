// This import loads the firebase namespace.
import firebase from 'firebase/app';
 
// These imports load individual services into the firebase namespace.
import 'firebase/firestore';
import '@firebase/storage';
import 'firebase/auth';

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRE_BASE_API_KEY,
  authDomain: process.env.REACT_APP_FIRE_BASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIRE_BASE_DATA_BASE_URL,
  projectId: process.env.REACT_APP_FIRE_BASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRE_BASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRE_BASE_MESSAGEING_SENDER_ID,
  appId: process.env.REACT_APP_FIRE_BASE_APP_ID
};

firebase.initializeApp(firebaseConfig);

export const auth    = firebase.auth();
export const db      = firebase.firestore();
export const storage = firebase.storage();
export const Timestamp = firebase.firestore.Timestamp;



export const signInWithGoogle = async() => {

  let provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt: 'select_account'});

  provider.addScope("https://www.googleapis.com/auth/spreadsheets");
  provider.addScope("https://www.googleapis.com/auth/drive")
  provider.addScope("https://www.googleapis.com/auth/drive.file")
  await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  return auth.signInWithPopup(provider)
}

export const signInWithEmail = async() => {

  return auth.signInWithEmailAndPassword;
}


export default firebase;
