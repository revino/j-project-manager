import React from 'react';
import {Router} from "react-router-dom";
import Routes from './routes';

import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import './App.css';

import history from './history';

import firebase from './firebase'

const messaging = firebase.messaging();

//사용자에게 허가를 받아 토큰을 가져옵니다.
messaging.requestPermission()
.then(function() {
	return messaging.getToken(); 
})
.then(function(token) {
	console.log(token);
})
.catch(function(err) {
	console.log('fcm error : ', err);
})

messaging.onMessage(function(payload){
	console.log(payload.notification.title);
	console.log(payload.notification.body);
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
        <Router history={history}>
          <Routes />
        </Router>
    </ThemeProvider>
  );
}
