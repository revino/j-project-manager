import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {getUserInfo, removeUserInfo} from '../../auth';

export default function WrapRoute(props) {
    const { wrap: Wrap, component: Component,login ,...el } = props;
    return (
        <Route
            render={matchProps => {
                if(!getUserInfo()) removeUserInfo();

                return (getUserInfo())? 
                <Wrap><Component {...matchProps} /></Wrap>
                :
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }}
            {...el}
        />
    );

}
