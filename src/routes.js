import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import WrapRoute from './components/WrapRoute'

import { 
    Main as MainLayout, 
    Minimal as MinimalLayout 
} from './layouts';

import {
    Dashboard      as DashboardView,
    ItemTable      as TableView,
    Chart          as ChartView,
    Login          as LoginView,
    OAuth2Redirect as GoogleRedirectView
} from './containers';

const WithWrap = (WrappedComponent) => {
  return (props) => {
    return (
        <MinimalLayout><WrappedComponent {...props}/></MinimalLayout >
    );
  };
}

export default function Routes(props) {

    return (
      <Switch>
        <Redirect  exact from="/" to="/dashboard"/>
        <WrapRoute exact path="/dashboard"     component={DashboardView} wrap={MainLayout}/>
        <WrapRoute exact path="/chart"         component={ChartView}     wrap={MainLayout}/>
        <WrapRoute exact path="/table"         component={TableView}     wrap={MainLayout}/>
        <Route     exact path="/login"         component={WithWrap(LoginView)}                      />
        <Route           path="/login/google/" component={GoogleRedirectView}             />
      </Switch>
    );
}
