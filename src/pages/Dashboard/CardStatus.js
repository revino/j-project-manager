//React
import React from 'react';
import { connect } from 'react-redux';

import CardSummary from '../../components/Card/CardSummary';

import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';

import {progressQuery} from './query';

function CardStatus(props) {
  //props

  const title = "진행 상태";

  const {selectSheetId}=  props;

  const {data}= useFirebaseOnceCollection(progressQuery(selectSheetId));

  return (
    <CardSummary title={title} data={!!data?data.data():null}/>
  );

}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(CardStatus)
