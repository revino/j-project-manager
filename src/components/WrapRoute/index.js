import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {getUserInfo, removeUserInfo} from '../../auth';
import { SnackbarProvider } from 'notistack';
import { connect } from 'react-redux';
//import moment from 'moment';

function WrapRoute(props) {
    const { wrap: Wrap, component: Component,login,allow,user,...el} = props;
    return (
        <Route
            render={matchProps => {
                
                //if(!getUserInfo()) removeUserInfo();
                
                //const RouteCon = allow || (localStorage.getItem('ACCESS_TOKEN') && !!user.accessToken && moment() < moment(user.expire));

                const RouteCon = allow || (localStorage.getItem('ACCESS_TOKEN') );
                return (RouteCon)? 
                <Wrap><SnackbarProvider maxSnack={5}><Component {...matchProps} /></SnackbarProvider></Wrap>
                :
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }}
            {...el}
        />
    );

}

const mapStateToProps = state => ({
    user: state.auth.user
  })
  
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(WrapRoute)

