import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import WrapRoute from './components/WrapRoute'

import {
    Main as MainLayout
} from './layouts';

import asyncRoute from './lib/asyncRoute';

export const DashboardView      = asyncRoute(() => import('./pages/Dashboard'));
export const WorkTime           = asyncRoute(() => import('./pages/WorkTime'));
export const TableView          = asyncRoute(() => import('./pages/ItemTable/List'));
export const ChartView          = asyncRoute(() => import('./pages/Chart'));
export const CheckListView      = asyncRoute(() => import('./pages/CheckList'));
export const TableAddView       = asyncRoute(() => import('./pages/Settings/Table'));
export const SettingsView       = asyncRoute(() => import('./pages/Settings'));
export const LoginView          = asyncRoute(() => import('./pages/Login'));
export const GoogleRedirectView = asyncRoute(() => import('./pages/Oauth2/OAuth2Redirect'));

export default function Routes(props) {

    return (
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
    );
}
