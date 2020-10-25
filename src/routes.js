import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import WrapRoute from './components/WrapRoute'

import { 
    Main as MainLayout
} from './layouts';
/*
import { 
    Main as MainLayout,
    Minimal as MinimalLayout 
} from './layouts';
*/

import {
    Dashboard      as DashboardView,
    ItemTable      as TableView,
    Chart          as ChartView,
    CheckList      as CheckListView,
    TableAdd       as TableAddView,
    Settings       as SettingsView,
    Login          as LoginView,
    OAuth2Redirect as GoogleRedirectView
} from './pages';

export default function Routes(props) {

    return (
      <Switch>
        <Redirect  exact from="/" to="/dashboard"/>
        <WrapRoute exact path="/dashboard"                  component={DashboardView} wrap={MainLayout}/>
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
