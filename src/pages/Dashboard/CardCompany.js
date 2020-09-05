//React
import React, {useLayoutEffect} from 'react';
import { connect } from 'react-redux';

import CardSummary from '../../components/Card/CardSummary';

//API
import {getSummaryCompany} from '../../reducers/modules/summary'

function CardCompany(props) {
  //props
  const { data, error, selectSheetId, getSummaryCompanyData} = props;
  const title = "전체 상태";

  //getData
  useLayoutEffect(() =>{
    getSummaryCompanyData({ tq: `select C,count(C) where C is not null and B != "완료" group by C`, selectSheetId});

  }, [getSummaryCompanyData, selectSheetId]);

  return (
    <CardSummary data={data} title={title} error={error}/>
  );

}


const mapStateToProps = state => ({
  error: state.summary.company.error,
  data : state.summary.company.data,
  selectSheetId: state.sheetInfo.selectSheetId,
  
})

const mapDispatchToProps = dispatch => ({
  getSummaryCompanyData: (payload) => dispatch(getSummaryCompany(payload))
})


export default connect(mapStateToProps, mapDispatchToProps)(CardCompany)