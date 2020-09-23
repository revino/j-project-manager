import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {auth} from '../../firebase/index'
import { SnackbarProvider } from 'notistack';
import { connect } from 'react-redux';
import { successLogin} from '../../reducers/modules/auth'


function WrapRoute(props) {
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
            const userInfo = {user:{
                id: user.uid,
                name: user.displayName,
                accessToken:localStorage.getItem('ACCESS_TOKEN'),
                photo:user.photoURL,
                expire:localStorage.getItem('EXPIRE_TOKEN'),
              }}
            setLoginData(userInfo);
        }
    },[loading,setLoginData,user])

    return (
        <Route
            render={matchProps => {
                const RouteCon = allow || (isLoggedIn);

                if(!!loading || (!loading && !!user && !isLoggedIn)) return(
                    <Wrap><SnackbarProvider maxSnack={5}>로딩중
                    </SnackbarProvider></Wrap>
                    ) 
                
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
    isLoggedIn: state.auth.isLoggedIn
  })
  
const mapDispatchToProps = dispatch => ({
    setLoginData: (payload) => dispatch(successLogin(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapRoute)

