//React
import React, {forwardRef} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';


//Material UI
import {Box, CardHeader, Button, Card,CardContent,makeStyles ,Divider} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


//Component
import GanttChart from '../../components/GanttChart'


//Style
const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%'
    }
  }));

function CardChart(props) {
  const classes = useStyles();
  
  /*
  //getData
  useLayoutEffect(() =>{
      getSummaryChartData({ tq: `select A, F, J, G, H, C, D, I, B where G <= date '${moment().add(endTime, 'days').format("YYYY-MM-DD")}' and H >= date '${moment().format("YYYY-MM-DD")}' order by ${sort} asc`, selectSheetId});
  }, [getSummaryChartData,endTime,sort,selectSheetId]);
*/
  const CustomRouterLink = forwardRef((props, ref) => (
      <RouterLink {...props} />
  ));


  return (
    <Card className={classes.root}>
    <CardHeader
      action={(
        <Button endIcon={<ArrowDropDownIcon />} size="small" variant="text">
          최근 5일
        </Button>
      )}
      title="7일 그래프"
    />
    <Divider />
    <CardContent>
      <Box position="relative">
        <GanttChart/>
      </Box>
    </CardContent>
    <Divider />
    <Box display="flex" justifyContent="flex-end" p={2}>
      <Button color="primary" endIcon={<ArrowRightIcon />} size="small" variant="text" to={"/chart"} component={CustomRouterLink}>
        전체 보기
      </Button>
    </Box>
  </Card>
  );
}




export default CardChart;
