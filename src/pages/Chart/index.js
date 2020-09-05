import React, { useEffect, useCallback } from 'react';

import { connect } from 'react-redux';

//Component
import DropBox from '../../components/DropBox'
import DatePicker from '../../components/DatePicker'
import GanttChart from '../../components/GanttChart'

//UI
import 'date-fns';
import { makeStyles } from '@material-ui/styles';
import { Button, Grid, LinearProgress } from '@material-ui/core';

//UI
import useAsyncChartData from '../../hooks/useAsyncChartData'

//Time
import moment from 'moment'

//hooks
import useSelect from '../../hooks/useSelect'
import useSelectDate from '../../hooks/useSelectDate'
import useApiErrorSnackbar from '../../hooks/useApiErrorSnackbar'

//Style
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  refreshButton:{
    width: "100%",
    padding: theme.spacing(2),
  }
}));

const defaultSort = "F";
const defaultYAxis = 1;
const defaultDuration = 20;
const defaultStart= moment().format("YYYY-MM-DD");
const defaultEnd  = moment().add(defaultDuration, 'days').format("YYYY-MM-DD")
const sortGroup = [{ value:"A", label: "ID"}, {value:"F", label:"담당자"}, {value:"J", label:"PJT 이름"}, {value:"C", label:"사이트"}, {value:"I", label:"PJT No"}]
const yAxisGroup = [{ value:0, label: "PJT 이름"}, {value:1, label:"담당자"}, {value:2, label:"사이트"}]

function Chart(props) {
  //props
  const {selectSheetId} = props;
  const classes = useStyles();

  //Select Box
  const [sortValue, onChangeSort]           = useSelect(defaultSort);
  const [yAxisValue, onChangeYAxis]         = useSelect(defaultYAxis);
  const [startDateValue, onChangeStartDate] = useSelectDate(defaultStart);
  const [endDateValue, onChangeEndDate]     = useSelectDate(defaultEnd); 
  const { data, error,isLoading, loadData } = useAsyncChartData();

  useApiErrorSnackbar(error);

  const requestData = useCallback((tq, selectSheetId, yAxisValue,startDateValue,endDateValue)=>{ 
    loadData({tq, selectSheetId, yAxisValue,startDateValue,endDateValue});
  },[loadData])

  useEffect(() =>{ 
    requestData(`select A, F, J, G, H, C, D, I, B where G <= date '${moment(defaultEnd).format("YYYY-MM-DD")}' and H >= date '${moment(defaultStart).format("YYYY-MM-DD")}' order by ${defaultSort} asc`,
    selectSheetId,defaultYAxis,defaultStart,defaultEnd); 
  }, [requestData,selectSheetId]);

  const handleRefresh= ()=>{
    requestData(`select A, F, J, G, H, C, D, I, B where G <= date '${moment(endDateValue).format("YYYY-MM-DD")}' and H >= date '${moment(startDateValue).format("YYYY-MM-DD")}' order by ${sortValue} asc`,
    selectSheetId,yAxisValue,startDateValue,endDateValue); 
  }
  
  return (
  <div className={classes.root}>
    <Grid container spacing={2}> 

      <Grid item container lg={2} md={4} sm={4} xl={1} xs={12}>
        <Button className={classes.refreshButton} size="large" color = "primary" variant="outlined" onClick={handleRefresh}>갱신</Button>
      </Grid>

      <Grid item container lg={2} md={2} sm={4} xl={1} xs={6}>
        <DropBox componentKey="sort" list={sortGroup}  label={"정렬"} value={sortValue} onChange={onChangeSort}/>
      </Grid>

      <Grid item container lg={2} md={2} sm={4} xl={1} xs={6}>
        <DropBox componentKey="yaxis" list={yAxisGroup} label={"기준"} value={yAxisValue} onChange={onChangeYAxis}/>
      </Grid>

      <Grid item container lg={2} md={2} sm={4} xl={1} xs={6}>
        <DatePicker componentKey="start" label={"시작일"} value={startDateValue} onChange={onChangeStartDate}/>
      </Grid>
      
      <Grid item container lg={2} md={2} sm={4} xl={1} xs={6}>
        <DatePicker componentKey="end" label={"시작일"} value={endDateValue} onChange={onChangeEndDate}/>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
        {isLoading && <LinearProgress color="secondary"/>}
        <GanttChart data={data}/>
      </Grid>

    </Grid>
  </div>
  );
}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId,
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(Chart)
