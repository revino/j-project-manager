import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {auth} from '../../firebase/index'
import { SnackbarProvider } from 'notistack';
import { connect } from 'react-redux';
import { refreshLogin} from '../../reducers/modules/auth'

import { makeStyles } from '@material-ui/styles';
import {Backdrop, CircularProgress } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    }
  }));

function WrapRoute(props) {
    const classes = useStyles();
    const { wrap: Wrap, component: Component,allow,isLoggedIn, setLoginData, ...el} = props;

    const [user, setUser]  = useState(null);
    //const [error, setError]  = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((u)=>{
            setUser(u); 
            setLoading(false)
        }, (e)=>{
            console.log(e);
        });
        return () => {
            unsubscribe();
        };
    },[]);

    useEffect(()=>{
        if(!!user && !loading){
            /*
            const userInfo = {user:{
                id: user.uid,
                name: user.displayName,
                accessToken:localStorage.getItem('ACCESS_TOKEN'),
                photo:user.photoURL,
                expire:localStorage.getItem('EXPIRE_TOKEN'),
              }}*/
            setLoginData();
        }
    },[loading,setLoginData,user])

    return (
        <Route
            render={matchProps => {
                const RouteCon = allow || (isLoggedIn);

                if(!!loading || (!loading && !!user && !isLoggedIn)) return(
                <Backdrop className={classes.backdrop} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                )

                return (RouteCon)?
                <Wrap><SnackbarProvider maxSnack={5} preventDuplicate><Component {...matchProps} /></SnackbarProvider></Wrap>
                :
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }}
            {...el}
        />
    );

}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn
  })
  
const mapDispatchToProps = dispatch => ({
    setLoginData: () => dispatch(refreshLogin())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapRoute)

