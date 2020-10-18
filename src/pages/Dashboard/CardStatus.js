//React
import React from 'react';

import CardSummary from '../../components/Card/CardSummary';

import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';

import {progressQuery} from './query';

function CardStatus(props) {
  //props

  const title = "진행 상태";

  const {data}= useFirebaseOnceCollection(progressQuery);

  return (
    <CardSummary title={title} data={!!data?data.data():null}/>
  );

}

export default CardStatus