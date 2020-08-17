import React, {useState, useEffect, useCallback} from 'react';
import browserHistory from '../../history'

//Component
import ChartView from "./ChartView"

//Material UI
import 'date-fns';
import { Button, FormControl, InputLabel, MenuItem, Select, Grid } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/styles';

//UI
import { useSnackbar } from 'notistack';

//Time
import moment from 'moment'

//API
import SheetApi from '../../api/SpreadSheetApi'

import * as am4core from "@amcharts/amcharts4/core";

//Style
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "140px",
    float: "left"
  },
  formDate: {
    margin: theme.spacing(1),
    width: "140px",
    float: "left"
  },
  refreshButton:{
    width: "100%",
    padding: theme.spacing(2),
  }
}));

//data
const SortGroup = [{ id:"A", label: "ID"}, {id:"F", label:"담당자"}, {id:"J", label:"PJT 이름"}, {id:"C", label:"사이트"}, {id:"I", label:"PJT No"}]
const defaultSort = "F";
const defaultYAxis = 1;
const defaultEndTime = 20;

//function
function ChartItem(id, pic, pjtName, start, end, company, line, pjtno,progress, category, color ) {
       if(category === 0)  this.category=pjtName;
  else if(category === 1)  this.category=pic + ":" + id;
  else if(category === 2)  this.category=company + ":" + pic + id;
  this.id = id;
  this.pic = pic;
  this.pjtName = pjtName;
  this.start = start;
  this.end = end;
  this.company = company;
  this.line = line;
  this.pjtno = pjtno
  this.sort = category;
  this.color = color;
  this.progress = progress;
}

export default function Chart() {
  const {enqueueSnackbar} = useSnackbar();
  const classes = useStyles();
  const [ChartData, setChartData] = useState(null);
  const [SortCategory, setSortCategory] = useState(defaultSort);
  const [YCategory, setYCategory] = useState(defaultYAxis);
  const [selectedStartDate, setSelectedStartDate] = useState(moment());
  const [selectedEndDate, setSelectedEndDate] = useState(moment().add(20, 'days'));
  
  //Get Data 
  const getChartData = useCallback(async(yAxis,start,end,sort) =>{
    try{
    const queryObject  = {tq: `select A, F, J, G, H, C, D, I, B where G <= date '${moment(end).format("YYYY-MM-DD")}' and H >= date '${moment(start).format("YYYY-MM-DD")}' order by ${sort} asc`}
    const queryObject2 = {tq: `select A where A is not null offset 1`, sheet: `Prop_Types`}
    let colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;
    let colorIndex = -1, colorBrighten = 1;
    let lastName;
    
    //API REQUEST
    const response  = await SheetApi.getQueryData(queryObject);

    if(response === "403") {
      browserHistory.push("/settings");
      enqueueSnackbar('권한이 없습니다.', { variant: 'error' } );
      throw new Error(response)
    }
    else if(response === "401") {
      browserHistory.push("/login");
      enqueueSnackbar('인증이 실패하였습니다.', { variant: 'error' } );
      throw new Error(response)
    }

    const chartDataArray = response.table.rows.map(el => {
      if(lastName !== el.c[1].v) {colorIndex+=2; colorBrighten =1; }
      else                       colorBrighten -=0.2;
      lastName = el.c[1].v;
      return new ChartItem(el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].f,el.c[4].f,el.c[5].v,el.c[6].v,el.c[7].v,el.c[8].v,yAxis, colorSet.getIndex(colorIndex).brighten(colorBrighten));
    });

    //API REQUEST 
    if(yAxis === 1){
      const response  = await SheetApi.getQueryData(queryObject2);

      if(response === "403") {
        browserHistory.push("/settings");
        enqueueSnackbar('권한이 없습니다.', { variant: 'error' } );
        throw new Error(response)
      }
      else if(response === "401") {
        browserHistory.push("/login");
        enqueueSnackbar('인증이 실패하였습니다.', { variant: 'error' } );
        throw new Error(response)
      }

      const chartDataArray = response.table.rows.map(el => {
        return new ChartItem(null,el.c[0].v,null,null,null,null,null,null,null,yAxis);
      });
      chartDataArray.concat(chartDataArray);
    }

    setChartData(chartDataArray);
  }catch(err){
    enqueueSnackbar('차트 로드 실패', { variant: 'error' } );
    console.log(err);
  }
  }, [enqueueSnackbar])

  //handle
  const handleStartDateChange = (date) => {setSelectedStartDate(date);};
  const handleEndDateChange = (date) => { setSelectedEndDate(date);};
  const handleRefreshClick = (e) => { 
    if(YCategory === 1 ) setSortCategory("F");
    getChartData(YCategory,selectedStartDate,selectedEndDate,SortCategory);
  };

  useEffect(() =>{
    getChartData(defaultYAxis,moment(),moment().add(defaultEndTime, 'days'),defaultSort);
  }, [getChartData])

  return (
  <div className={classes.root}>
    <Grid container spacing={2}>

      <Grid item lg={2} md ={2} sm={2} xl={1} xs={12} container>
        <Button className={classes.refreshButton} size="large" color = "primary" variant="outlined" onClick={handleRefreshClick}> 갱신</Button>
      </Grid>  

      <Grid item lg={3} md ={4} sm={4} xl={2} xs={12} container>
        <FormControl className={classes.formControl} disabled={YCategory === 1}>
          <InputLabel id="select-sort">정렬</InputLabel>
          <Select labelId="select-sort" id="sort-select" value={SortCategory} onChange={({ target: { value } }) => setSortCategory(value)}>
            {SortGroup.map(el => (
              <MenuItem key={el.id} value={el.id}>{el.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-category">기준</InputLabel>
          <Select labelId="select-category" id="category-select" value={YCategory} onChange={({ target: { value } }) => setYCategory(value)}>
            <MenuItem value={0}>PJT 이름</MenuItem>
            <MenuItem value={1}>담당자</MenuItem>
            <MenuItem value={2}>사이트</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item lg={7} md={6} sm={6} xl={9} xs={12} container>  
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker className={classes.formDate}
            disableToolbar
            variant="inline"
            format="yyyy-MM-dd"
            margin="normal"
            id="date-picker-inline"
            label="시작일"
            value={selectedStartDate}
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider> 
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker className={classes.formDate}
            margin="normal"
            id="date-picker-dialog"
            label="종료일"
            format="yyyy-MM-dd"
            value={selectedEndDate}
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>

      <Grid item lg={12} sm={12} xl={12} xs={12}>
        <ChartView data={ChartData}/>
      </Grid>
    </Grid>
  </div>
  );
}
