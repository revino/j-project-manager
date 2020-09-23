import { combineReducers } from 'redux';

import { all } from 'redux-saga/effects';

//reducers
import sheetInfo,{sheetInfoSaga} from './sheetInfo';
import auth,{authSaga} from './auth';

// reducer 랑 Router 묶기
const createRootReducer = () => combineReducers({
    sheetInfo,
    auth
})

export function* rootSaga() {
    yield all([authSaga(),sheetInfoSaga()]);
  }

export default createRootReducer