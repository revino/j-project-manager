//React
import React, {useLayoutEffect, forwardRef} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { connect } from 'react-redux';

//Material UI
import {Box, CardHeader, Button, Card,CardContent,makeStyles ,Divider} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


//Component
import GanttChart from '../../components/GanttChart'

//Time
import moment from 'moment'


//API
import { getSummaryChart} from '../../reducers/modules/summary'

//hooks
import useApiErrorSnackbar from '../../hooks/useApiErrorSnackbar'

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%'
    }
  }));

//
/*
const addCartColor = (data) =>{
  let colorSet = new am4core.ColorSet();
  let colorIndex = -1, colorBrighten = 1;
  let lastName;
  const colorChartData = data.map(el => {
    if(lastName !== el.pic) {colorBrighten  =1; colorIndex+=2; }
    else                    {colorBrighten -=0.2;              }
    lastName = el.pic;
    return {...el,color:colorSet.getIndex(colorIndex).brighten(colorBrighten)}
  });
  return colorChartData;
}
*/

function CardChart(props) {
  const classes = useStyles();
  
  const {getSummaryChartData, data, endTime, sort, selectSheetId} = props;

  useApiErrorSnackbar();

  //getData
  useLayoutEffect(() =>{
      getSummaryChartData({ tq: `select A, F, J, G, H, C, D, I, B where G <= date '${moment().add(endTime, 'days').format("YYYY-MM-DD")}' and H >= date '${moment().format("YYYY-MM-DD")}' order by ${sort} asc`, selectSheetId});
  }, [getSummaryChartData,endTime,sort,selectSheetId]);

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
        <GanttChart data={data}/>
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

const mapStateToProps = state => ({
  data: state.summary.chart.data,
  error: state.summary.chart.error,
  selectSheetId: state.sheetInfo.selectSheetId,
})

const mapDispatchToProps = dispatch => ({
  getSummaryChartData: (payload) => dispatch(getSummaryChart(payload))
})


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CardChart))
