import { combineReducers } from 'redux';

import { all } from 'redux-saga/effects';

//reducers
import sheetInfo,{sheetInfoSaga} from './sheetInfo';
import auth,{authSaga} from './auth';
import summary,{summarySaga} from './summary'

// reducer 랑 Router 묶기
const createRootReducer = () => combineReducers({
    sheetInfo,
    auth,
    summary
})

export function* rootSaga() {
    yield all([authSaga(),sheetInfoSaga(),summarySaga()]);
  }

export default createRootReducer