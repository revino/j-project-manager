// This import loads the firebase namespace.
import firebase from 'firebase/app';
 
// These imports load individual services into the firebase namespace.
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
  apiKey: "AIzaSyCwNU0s6FikXidM6GFbLAUIqURYJ_jTMx4",
  authDomain: "j-project-manager.firebaseapp.com",
  databaseURL: "https://j-project-manager.firebaseio.com",
  projectId: "j-project-manager",
  storageBucket: "j-project-manager.appspot.com",
  messagingSenderId: "608956176256",
  appId: "1:608956176256:web:ab0e9d353a3763c35d9365"
};

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({prompt: 'select_account'});

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)

export const signInWithGoogle = () => {
  //auth.signInWithPopup(provider);
  provider.addScope(SCOPE);
  return auth.signInWithPopup(provider)
}

export default firebase;
