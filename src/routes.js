import React,{Suspense } from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import WrapRoute from './components/WrapRoute'

import {Backdrop, CircularProgress } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';


const MainLayout      =  React.lazy(() => import('./layouts/Main'));

const DashboardView      =  React.lazy(() => import('./pages/Dashboard'));
const WorkTime           =  React.lazy(() => import('./pages/WorkTime'));
const TableView          =  React.lazy(() => import('./pages/ItemTable/List'));
const ChartView          =  React.lazy(() => import('./pages/Chart'));
const CheckListView      =  React.lazy(() => import('./pages/CheckList'));
const TableAddView       =  React.lazy(() => import('./pages/Settings/Table'));
const SettingsView       =  React.lazy(() => import('./pages/Settings'));
const LoginView          =  React.lazy(() => import('./pages/Login'));
const GoogleRedirectView =  React.lazy(() => import('./pages/Oauth2/OAuth2Redirect'));

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

export default function Routes(props) {
    const classes = useStyles();
    return (
      <Suspense fallback={<Backdrop className={classes.backdrop} open={true}><CircularProgress color="inherit" /></Backdrop>}>
      <Switch>
        <Redirect  exact from="/" to="/dashboard"/>
        <WrapRoute exact path="/dashboard"                  component={DashboardView} wrap={MainLayout}/>
        <WrapRoute exact path="/worktime"                   component={WorkTime}      wrap={MainLayout}/>
        <WrapRoute exact path="/chart"                      component={ChartView}     wrap={MainLayout}/>
        <WrapRoute exact path="/table"                      component={TableView}     wrap={MainLayout}/>
        <WrapRoute       path="/table/update"               component={TableAddView}  wrap={MainLayout}/>
        <WrapRoute exact path="/checklist"                  component={CheckListView} wrap={MainLayout}/>
        <WrapRoute exact path="/settings"                   component={SettingsView}  wrap={MainLayout}/>
        <WrapRoute       path="/settings/table/:urlSheetId" component={TableAddView}  wrap={MainLayout}/>
        <WrapRoute exact path="/login"                      component={LoginView}     wrap={MainLayout} allow={true}/>
        <Route           path="/login/google/"              component={GoogleRedirectView}             />
      </Switch>
      </Suspense>
    );
}
