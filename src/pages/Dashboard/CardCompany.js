//React
import React from 'react';
import CardSummary from '../../components/Card/CardSummary';
import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';
import { companyQuery } from './query';

//API

function CardCompany(props) {
  //props

  const title = "사이트 상태";

  const {data}= useFirebaseOnceCollection(companyQuery);

  return (
    <CardSummary title={title} data={!!data?data.data():null}/>
  );

}

export default CardCompany