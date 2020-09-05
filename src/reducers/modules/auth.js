
import { createAction, handleActions } from 'redux-actions';
import { put, takeLatest, getContext, take } from 'redux-saga/effects';


//API
import googleLogin from '../../api/GoogleLoginApi';


import {getExpire, getUid, getUserName, getUserPicture} from '../../auth';

//action
import {requestSheetInfo, SHEET_INFO_SUCCESS} from './sheetInfo'

//types
export const LOGIN = 'LOGIN';
export const LOGIN_REQUEST = 'reducer/loginRequest';
export const LOGIN_SUCCESS = 'reducer/loginSuccess';
export const LOGIN_FAILURE = 'reducer/loginFailure';

// action creators
const requestLogin   = createAction(LOGIN_REQUEST);
const successLogin   = createAction(LOGIN_SUCCESS);
const successFailure = createAction(LOGIN_FAILURE);

//saga
function* loginRequestSaga() {
  try {
    const response = yield googleLogin.authGoogle();
    const history = yield getContext('history');
    const token = yield getExpire();
    const user = {user: {
      id: getUid(),
      name: getUserName(),
      accessToken:response.credential.accessToken,
      photo:getUserPicture(),
      expire:token,
    }}

    if(!!response.credential.accessToken) {
      localStorage.setItem('ACCESS_TOKEN', response.credential.accessToken);
    }
    yield put(requestSheetInfo());
    yield take(SHEET_INFO_SUCCESS);
    yield put(successLogin(user));

    history.push('/dashboard');
  } catch (err) {
    console.log(err);
    yield put(successFailure(err));
  }
}


// Initial State
const initialState = {
  fetchingUpdate: false,
  isLoggedIn: false,
  user: {
    id: "o1gLuUabqWNloOxiha0g4u3JEbB2",
    name: "김지웅",
    accessToken:"",
    photo:"https://lh3.googleusercontent.com/a-/AOh14GjBKAHbl_gX-jRsAm4dJ91bm1zlHpZnR9f8cFDO",
    expire:"Sat, 05 Sep 2020 13:24:21 GMT",
  }

};

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginRequestSaga); 
}

// Reducer
export default handleActions({
  [LOGIN_REQUEST]: (state, action) => {
    return { ...state, fetchingUpdate:true, isLoggedIn:false};
  },

  [LOGIN_SUCCESS]: (state, action) => {
    return { ...state, fetchingUpdate:false, isLoggedIn:true, user:action.payload.user};
  },

  [LOGIN_FAILURE]: (state, action) => {
    return { ...state, fetchingUpdate:false, isLoggedIn:false};
  }

}, initialState);

export {
  requestLogin

}
