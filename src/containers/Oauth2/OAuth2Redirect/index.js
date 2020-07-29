import React from 'react';
import { Redirect } from 'react-router-dom'
import moment from 'moment'

import qs from "qs";

const Login = props => {
    console.log("redircet render")
    console.log(qs.parse(props.location.hash.substr(1)));

    const parm = qs.parse(props.location.hash.substr(1));

    const token     = parm.access_token;
    const tokenType = parm.token_type;
    const scope     = parm.scope;
    const expire    = moment().add(parm.expires_in, 'second'); 

    console.log(window.location.hash.substr(1));

    if(token) {
        localStorage.setItem("ACCESS_TOKEN", token);
        localStorage.setItem("TOKEN_TYPE", tokenType);
        localStorage.setItem("SCOPE", scope);
        localStorage.setItem("EXPIRE", expire);
    } 

return <Redirect to = "/"/>

};

export default function OAuth2Redirect(props) {
    return (
        Login(props)
    )
}
 
  
