//React
import React, {useState, useEffect, useCallback, forwardRef} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

//Material UI
import {Box, CardHeader, Button, Card, Divider} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

//Component
import CollapsibleTable from "../ItemTable/CollapsibleTable"

//API
import SheetApi from '../../api/SpreadSheetApi';

function createData(id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content ) {
    return {id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content};
}

export default function CardTable(props) {
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);

  const CustomRouterLink = forwardRef((props, ref) => (
    <RouterLink {...props} />
  ));

    //Request Data
  const getTableData = useCallback(async() =>{
    try{
    setLoading(true);

    const queryObject = { tq: `select * where (A is not null) order by A desc limit 5`, sheet: `Item_Tables`}
    
    //API REQUEST
    const resJson = await SheetApi.getQueryData(queryObject);
    
    //make Array
    const itemArray = resJson.table.rows.map(el => new createData( el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].v,el.c[4].v,el.c[5].v,el.c[6].f,el.c[7].f,el.c[8].v,el.c[9].v,el.c[10].v))
    
    setTableData(itemArray);
    setLoading(false);
    }catch(err){
      console.log(err);
    }
  }, [])

  useEffect(() =>{
      getTableData()
    }, [getTableData])

  return (
    <Card>
      <CardHeader title="최근 추가 10개" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          { !loading &&
          <CollapsibleTable data={tableData} summary/>
          }
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