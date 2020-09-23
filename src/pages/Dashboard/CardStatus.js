//React
import React from 'react';

//import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';

import CardSummary from '../../components/Card/CardSummary';

//const tableQuery       = db.collection(`tables`).doc('HYNIX').collection(`props`).doc('progress');

function CardStatus(props) {
  //props

  const title = "전체 상태";


  return (
    <CardSummary title={title}/>
  );

}

export default CardStatus