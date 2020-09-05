//React
import React, {useLayoutEffect} from 'react';
import { connect } from 'react-redux';

import CardSummary from '../../components/Card/CardSummary';

//API
import { getSummaryStatus} from '../../reducers/modules/summary'


function CardStatus(props) {
  //props
  const { status, getSummaryStatusData, selectSheetId} = props;
  const title = "전체 상태";

  //getData
  useLayoutEffect(() =>{
      getSummaryStatusData({ tq: `select B,count(B) where B is not null group by B order by B desc`, selectSheetId});
  }, [getSummaryStatusData,selectSheetId]);
  


  return (
    <CardSummary data={status.data} title={title} error={status.error}/>
  );

}


const mapStateToProps = state => ({
  status: state.summary.status,
  selectSheetId: state.sheetInfo.selectSheetId,

})

const mapDispatchToProps = dispatch => ({
  getSummaryStatusData: (payload) => dispatch(getSummaryStatus(payload)),
})


export default connect(mapStateToProps, mapDispatchToProps)(CardStatus)