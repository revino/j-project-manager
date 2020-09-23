//React
import React, {forwardRef} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';


//Material UI
import {Box, CardHeader, Button, Card, Divider} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

//Component
import Table from '../../components/Table'

import {db} from '../../firebase'
import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';
import moment from 'moment';

const talbeConverter = {
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options);
    const startdate = moment(data.start_date.toDate()).format("YYYY-MM-DD")
    const enddate   = moment(data.end_date.toDate()).format("YYYY-MM-DD")
    return {...data,start_date: startdate, end_date:enddate, id:data.id};
  }
};

const tableQuery = db.collection(`tables`).doc('HYNIX').collection(`items`).orderBy("created_at", "desc").limit(5).withConverter(talbeConverter);

const CustomRouterLink = forwardRef((props, ref) => (
  <RouterLink {...props} />
));

function CardTable(props) {

  const {data:tableData}   = useFirebaseListenCollection(tableQuery);

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

export default CardTable;