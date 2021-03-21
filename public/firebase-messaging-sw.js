importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
const config =  { 
	apiKey:  "AIzaSyCwNU0s6FikXidM6GFbLAUIqURYJ_jTMx4", 
	authDomain:  "j-project-manager.firebaseapp.com", 
	databaseURL:  "https://j-project-manager.firebaseio.com", 
	projectId:  "j-project-manager", 
	storageBucket:  "j-project-manager.appspot.com", 
	messagingSenderId:  "608956176256"  
}; 

firebase.initializeApp(config);