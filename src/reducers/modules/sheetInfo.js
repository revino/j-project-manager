
import { createAction, handleActions  } from 'redux-actions';
import { put, call, takeLatest } from 'redux-saga/effects';

//API
import {getSetting, updateSetting} from '../../firebase/firestore/setting';


//types
const  SHEET_INFO_REQUEST = "reducer/requestSheetInfo";
const  SHEET_INFO_UPDATE  = "reducer/updateSheetInfo";

const  SHEET_INFO_SUCCESS = 'reducer/sheetInfoSuccess';
const  SHEET_INFO_FAILURE = 'reducer/sheetInfoFailure';

const  SHEET_INFO_UPDATE_SUCCESS = 'reducer/sheetInfoUpdateSuccess';


// action creators
const requestSheetInfo = createAction(SHEET_INFO_REQUEST);
const updateSheetInfo  = createAction(SHEET_INFO_UPDATE);
const successSheetInfo = createAction(SHEET_INFO_SUCCESS);
const failureSheetInfo = createAction(SHEET_INFO_FAILURE);
const successUpdateSheetInfo = createAction(SHEET_INFO_UPDATE_SUCCESS);

// Initial State
const initialState = {
  sheetList: [],
  selectSheetId: '',
  fetching: false,
  isList: false,
  isUpdate: false
};

//saga
function* sheetInfoRequestSaga() {
  try {
    const resSetting   = yield getSetting();
    const response = {...resSetting}
    yield put(successSheetInfo(response));
    
  } catch (err) {
    console.log(err);
    yield put(failureSheetInfo(err));
  }
}

function* sheetInfoUpdateSaga(action) {
  try {
    //
    const response = yield call(updateSetting,action.payload);

    //
    if(!response) yield put(successUpdateSheetInfo(action.payload));
    else          throw new Error(response);
    
  } catch (err) {
    yield put(failureSheetInfo(err));
  }
}


export function* sheetInfoSaga() {
  yield takeLatest(SHEET_INFO_REQUEST, sheetInfoRequestSaga);
  yield takeLatest(SHEET_INFO_UPDATE, sheetInfoUpdateSaga);
  
}

// Reducer
export default handleActions({

  [SHEET_INFO_REQUEST]: (state, action) => {
    return { ...state, fetching:true, isList:false};
  },
  
  [SHEET_INFO_UPDATE]: (state, action) => {
    return { ...state, fetching:true, isList:false, isUpdate:true};
  },

  [SHEET_INFO_SUCCESS]: (state, action) => {
    return { ...state, fetching:false, isList:true, sheetList:action.payload.sheetList, selectSheetId:action.payload.selectSheetId};
  },

  [SHEET_INFO_UPDATE_SUCCESS]: (state, action) => {
    return { ...state, fetching:false, isList:true, isUpdate:true, sheetList:action.payload.sheetList, selectSheetId:action.payload.selectSheetId};
  },

  [SHEET_INFO_FAILURE]: (state, action) => {
    return { ...state, fetching:false, isList:false, isUpdate:false};
  }

}, initialState);

export {
  requestSheetInfo,
  updateSheetInfo,
  SHEET_INFO_SUCCESS
}
