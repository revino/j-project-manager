
import { createAction} from 'redux-actions';
import { takeLatest  } from 'redux-saga/effects';

import {
  handleAsyncActions,
  reducerUtils,
  createPromiseSaga
} from '../asyncUtils';

//API
import {getQueryData} from '../../api/SpreadSheetApi';

//Time
import moment from 'moment'

//types
const GET_SUMMARY_STATUS          = "reducer/getSummaryStatus";
const GET_SUMMARY_STATUS_SUCCESS  = "reducer/getSummaryStatusSuccess";
const GET_SUMMARY_STATUS_FAILURE  = "reducer/getSummaryStatusFailure";

const GET_SUMMARY_COMPANY         = "reducer/getSummaryCompany";
const GET_SUMMARY_COMPANY_SUCCESS = "reducer/getSummaryCompanySuccess";
const GET_SUMMARY_COMPANY_FAILURE = "reducer/getSummaryCompanyFAILURE";

const GET_SUMMARY_CHART           = "reducer/getSummaryChart";
const GET_SUMMARY_CHART_SUCCESS   = "reducer/getSummaryChartSuccess";
const GET_SUMMARY_CHART_FAILURE   = "reducer/getSummaryChartFAILURE";


const GET_SUMMARY_TABLE           = "reducer/getSummaryTable";
const GET_SUMMARY_TABLE_SUCCESS   = "reducer/getSummaryTableSuccess";
const GET_SUMMARY_TABLE_FAILURE   = "reducer/getSummaryTableFAILURE";


// action creators
const getSummaryStatus  = createAction(GET_SUMMARY_STATUS );
const getSummaryCompany = createAction(GET_SUMMARY_COMPANY);
const getSummaryChart   = createAction(GET_SUMMARY_CHART  );
const getSummaryTable   = createAction(GET_SUMMARY_TABLE  );


const initialState = {
  status: reducerUtils.initial([]),
  company: reducerUtils.initial([]),
  chart  : reducerUtils.initial([]),
  table  : reducerUtils.initial([])
};

//saga

const jsonParse = (data) =>{
  return JSON.parse(data.substring(47,data.length-2));;
}

const parserStatus = async(data) =>{
  const resText = await data.text();
  const resJson = jsonParse(resText);
  const result  = resJson.table.rows.map (el => ({name: el.c[0].v, value:el.c[1].v}));

  return result;
}

const parserChart = async(data) =>{
  const makeItem = (id, pic, pjtName, start, end, company, line, pjtno,progress, category ) => {
    return {
    category:company + ":" + pic,
    id:id,
    pic:pic,
    pjtName:pjtName,
    start:start,
    end:end,
    company:company,
    line:line,
    pjtno:pjtno,
    sort:category,
    progress:progress}
  }
  const resText = await data.text();
  const resJson = jsonParse(resText);
  const result  = resJson.table.rows.map(el => {
    let startdate = el.c[3].f;
    let enddate = el.c[4].f;
    if(moment(startdate) < moment()) startdate = moment().format("YYYY-MM-DD");
    if(moment(enddate) > moment()) enddate = moment().add(7, 'days').format("YYYY-MM-DD");
    
    return new makeItem(el.c[0].v,el.c[1].v,el.c[2].v,startdate,enddate,el.c[5].v,el.c[6].v,el.c[7].v,el.c[8].v, 2);
  });

  return result;
}

const parserTable = async(data) =>{
  const  createData = (id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content ) =>{
    return {id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content};
  }
  const resText = await data.text();
  const resJson = jsonParse(resText);
  const result  = resJson.table.rows.map(el => new createData( el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].v,el.c[4].v,el.c[5].v,el.c[6].f,el.c[7].f,el.c[8].v,el.c[9].v,el.c[10].v))
    
  return result;
}

const getStatusSaga  = createPromiseSaga(GET_SUMMARY_STATUS , getQueryData,parserStatus);
const getCompanySaga = createPromiseSaga(GET_SUMMARY_COMPANY, getQueryData,parserStatus);
const getChartSaga   = createPromiseSaga(GET_SUMMARY_CHART  , getQueryData,parserChart );
const getTableSaga   = createPromiseSaga(GET_SUMMARY_TABLE  , getQueryData,parserTable );


export function* summarySaga() {
  yield takeLatest(GET_SUMMARY_STATUS , getStatusSaga);
  yield takeLatest(GET_SUMMARY_COMPANY, getCompanySaga);
  yield takeLatest(GET_SUMMARY_CHART  , getChartSaga);
  yield takeLatest(GET_SUMMARY_TABLE  , getTableSaga);
}

// Reducer
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_SUMMARY_STATUS:
    case GET_SUMMARY_STATUS_SUCCESS:
    case GET_SUMMARY_STATUS_FAILURE:
      return handleAsyncActions(GET_SUMMARY_STATUS, 'status', true)(state, action);

    case GET_SUMMARY_COMPANY:
    case GET_SUMMARY_COMPANY_SUCCESS:
    case GET_SUMMARY_COMPANY_FAILURE:
      return handleAsyncActions(GET_SUMMARY_COMPANY, 'company', true)(state, action);

    case GET_SUMMARY_CHART:
    case GET_SUMMARY_CHART_SUCCESS:
    case GET_SUMMARY_CHART_FAILURE:
      return handleAsyncActions(GET_SUMMARY_CHART, 'chart', true)(state, action);

    case GET_SUMMARY_TABLE:
    case GET_SUMMARY_TABLE_SUCCESS:
    case GET_SUMMARY_TABLE_FAILURE:
      return handleAsyncActions(GET_SUMMARY_TABLE, 'table', true)(state, action);

    default:
      return state;
  }
}

export {
  getSummaryStatus,
  getSummaryCompany,
  getSummaryChart,
  getSummaryTable
}
