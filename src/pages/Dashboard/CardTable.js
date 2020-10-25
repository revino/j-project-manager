//React
import React, {forwardRef} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';


//Material UI
import {Box, CardHeader, Button, Card, Divider} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

//Component
import Table from '../../components/Table'

import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';

import { connect } from 'react-redux';


import {tableQuery} from './query';



const CustomRouterLink = forwardRef((props, ref) => (
  <RouterLink {...props} />
));

function CardTable(props) {

  const {selectSheetId}=  props;

  const {data:tableData}   = useFirebaseListenCollection(tableQuery(selectSheetId));
  
  return (
    <Card>
      <CardHeader title="최근 추가 5개" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table data={!!tableData?tableData.docs.map(doc=>doc.data()):[]} isSummary/>
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
  selectSheetId: state.sheetInfo.selectSheetId
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CardTable)
