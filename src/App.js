import React from 'react';
import {BrowserRouter } from "react-router-dom";
import Routes from './routes';

import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import './App.css';


export default function App() {
  return (
    <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
    </ThemeProvider>
  );
}
