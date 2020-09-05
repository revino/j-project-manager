//React
import React, {useLayoutEffect, forwardRef} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';

//Material UI
import {Box, CardHeader, Button, Card, Divider} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

//Component
import Table from '../../components/Table'

//hooks
import useApiErrorSnackbar from '../../hooks/useApiErrorSnackbar'

//API
import { getSummaryTable} from '../../reducers/modules/summary'

function CardTable(props) {

  const {getSummaryTableData,selectSheetId, data, error} = props;
  useApiErrorSnackbar(error);


  const CustomRouterLink = forwardRef((props, ref) => (
    <RouterLink {...props} />
  ));


  useLayoutEffect(() =>{
     getSummaryTableData({ tq: `select * where (A is not null and B != "완료") order by A desc limit 5`, sheet: `Item_Tables`, selectSheetId});
  
  }, [getSummaryTableData,selectSheetId]);

  return (
    <Card>
      <CardHeader title="최근 추가 5개" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table data={data} isSummary/>
        </Box>
      </PerfectScrollbar>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button color="primary" endIcon={<ArrowRightIcon />} size="small" variant="text" to={"/table"} component={CustomRouterLink}>
          전체 보기
        </Button>
      </Box>
    </Card>
  );

}


const mapStateToProps = state => ({
  error: state.summary.table.error, 
  data: state.summary.table.data, 
  selectSheetId: state.sheetInfo.selectSheetId,
})

const mapDispatchToProps = dispatch => ({
  getSummaryTableData: (payload) => dispatch(getSummaryTable(payload))
})


export default connect(mapStateToProps, mapDispatchToProps)(CardTable)