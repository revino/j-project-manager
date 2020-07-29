import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import moment from 'moment'

export default function WrapRoute(props) {
    const { wrap: Wrap, component: Component,login ,...el } = props;
    console.log(props);
    return (
        <Route
            render={matchProps => (
                localStorage.getItem('ACCESS_TOKEN') || (moment() > moment(localStorage.getItem('EXPIRE')))? 
                <Wrap haistory={props.history}><Component {...matchProps} /></Wrap>
                :
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )}
            {...el}
        />
    );

}
