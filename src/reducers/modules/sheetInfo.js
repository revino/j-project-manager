
import { createAction, handleActions  } from 'redux-actions';
import { put, call, takeLatest } from 'redux-saga/effects';

//API
import {getSetting, updateSetting} from '../../api/firestore/setting';
import {getQueryData} from '../../api/SpreadSheetApi';

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

const defaultProgressData = ["접수(작지X)","진행중","접수 완료(작지O)","완료","모니터링中","보고서상신","보류"];
const defaultPicData= ["유영준","유현준","김지웅"];
const defaultLineData= ["이천TDBI","이천MVP","청주TDBI","청주MVP","하이텍","충칭","윈팩","하이셈"];
const defaultComapanyData= ["HYNIX","하이텍","윈팩","하이셈"];
const defaultPlData= ["유영준","유현준"];
const defaultSheetList= [
  {label:'test2',link:'16qTlqWa0f7V8bIIVDwDmZr2knmQNvKcMOPfqMMzR8eQ'},
  {label:'하이닉스',link:'1Eb2Bwx7aRWc2vwVyqw8rK4vKeM9U99bDPRNnJWIcC_s'},
  {label:'test3',link:'1T3VPAPTVJoECISHMbjtTQzBbo2Y4XW0BQoC0_MbAMIc'},
  {link:'aa',label:'aa'},
  {label:'bb',link:'bb'}

]

const defaultFieldData = {pic: defaultPicData,line: defaultLineData,progress: defaultProgressData,company: defaultComapanyData,pl: defaultPlData };
//const defaultFieldData = {pic: [],line: [],progress: [],company: [],pl: [] };



// Initial State
const initialState = {
  sheetList: defaultSheetList,
  selectSheetId: "16qTlqWa0f7V8bIIVDwDmZr2knmQNvKcMOPfqMMzR8eQ",
  fetching: false,
  isList: false,
  isUpdate: false,
  fieldData: defaultFieldData
};

const parserProp = async(data) =>{
  const fieldData   = {pic:[],line:[],progress:[],company:[],pl:[]}

  const resText   = await data.text();
  const resData   = JSON.parse(resText.substring(47,resText.length-2));;

  //make Array
  for (let el of resData.table.rows) {
    if(el.c[0] !== null && el.c[0].v !== null) fieldData['pic'].push(el.c[0].v);
    if(el.c[1] !== null && el.c[1].v !== null) fieldData['line'].push(el.c[1].v);
    if(el.c[2] !== null && el.c[2].v !== null) fieldData['progress'].push(el.c[2].v);
    if(el.c[3] !== null && el.c[3].v !== null) fieldData['company'].push(el.c[3].v);
    if(el.c[4] !== null && el.c[4].v !== null) fieldData['pl'].push(el.c[4].v);
  }
  return fieldData;
}

//saga
function* sheetInfoRequestSaga() {
  try {

    const conArray    =  ["A is not null","B is not null","C is not null","D is not null","E is not null"]
    const ConStr      = conArray.join(" or ");
    const queryObject =  { tq: `select A,B,C,D,E where (${ConStr}) offset 1`, sheet: `Prop_Types`};

    const resSetting   = yield getSetting();

    const resSheetProp = yield getQueryData({...queryObject, selectSheetId:resSetting.selectSheetId});
    if(!resSheetProp.ok) throw new Error(resSheetProp);
    const fieldData    = yield parserProp(resSheetProp);

    const response = {...resSetting, fieldData}

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
    return { ...state, fetching:false, isList:true, sheetList:action.payload.sheetList, selectSheetId:action.payload.selectSheetId, fieldData:action.payload.fieldData};
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
