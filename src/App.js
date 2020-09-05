import React from 'react';
import {Router} from "react-router-dom";
import Routes from './routes';

import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import './App.css';

import history from './history';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
        <Router history={history}>
          <Routes />
        </Router>
    </ThemeProvider>
  );
}
