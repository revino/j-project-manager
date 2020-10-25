//React
import React from 'react';
import { connect } from 'react-redux';
import CardSummary from '../../components/Card/CardSummary';
import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';
import { companyQuery } from './query';

//API

function CardCompany(props) {
  //props

  const title = "사이트 상태";

  const {selectSheetId}=  props;

  const {data}= useFirebaseOnceCollection(companyQuery(selectSheetId));

  return (
    <CardSummary title={title} data={!!data?data.data():null}/>
  );

}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CardCompany)
