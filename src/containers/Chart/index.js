import React, {useState, useEffect, useCallback} from 'react';

//Component
import ChartView from "./ChartView"

//Material UI
import 'date-fns';
import { Button, FormControl, InputLabel, MenuItem, Select, Grid } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/styles';

//Time
import moment from 'moment'

//API
import SheetApi from '../../api/SpreadSheetApi'


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

//function
function ChartItem(id, pic, pjtName, start, end, company, line, pjtno, category ) {
       if(category === 0)  this.category=pjtName;
  else if(category === 1)  this.category=pic;
  else if(category === 2)  this.category=company;
  this.id = id;
  this.pic = pic;
  this.pjtName = pjtName;
  this.start = start;
  this.end = end;
  this.company = company;
  this.line = line;
  this.pjtno = pjtno
  this.sort = category;
}

export default function Chart() {
    const classes = useStyles();
    const [ChartData, setChartData] = useState(null);
    const [SortCategory, setSortCategory] = useState("J");
    const [YCategory, setYCategory] = useState(1);
    const [selectedStartDate, setSelectedStartDate] = useState(moment());
    const [selectedEndDate, setSelectedEndDate] = useState(moment().add(20, 'days'));
    
    //Get Data 
    const getChartData = useCallback(async() =>{
      const queryObject  = {tq: `select A, F, J, G, H, C, D, I where G <= date '${moment(selectedEndDate).format("YYYY-MM-DD")}' and H >= date '${moment(selectedStartDate).format("YYYY-MM-DD")}' order by ${SortCategory} asc`}
      const queryObject2 = {tq: `select A where A is not null offset 1`, sheet: `Prop_Types`}
      
      //API REQUEST
      const resChartDataJson  = await SheetApi.getQueryData(queryObject);
      const chartDataArray = resChartDataJson.table.rows.map(el => {
        return new ChartItem(el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].f,el.c[4].f,el.c[5].v,el.c[6].v,el.c[7].v,YCategory);
      });

      //API REQUEST 
      if(YCategory === 1){
        const resNameDataJson  = await SheetApi.getQueryData(queryObject2);
        const chartDataArray = resNameDataJson.table.rows.map(el => {
          return new ChartItem(null,el.c[0].v,null,null,null,null,null,null,null,YCategory);
        });
        chartDataArray.concat(chartDataArray);
      }

      setChartData(chartDataArray);
    }, [YCategory,selectedStartDate,selectedEndDate,SortCategory])

    //handle
    const handleStartDateChange = (date) => {
      setSelectedStartDate(date);
    };
  
    const handleEndDateChange = (date) => {
      setSelectedEndDate(date);
    };

    useEffect(() =>{
      getChartData();
    }, [getChartData])

    return (
    <div className={classes.root}>
      <Grid container spacing={2}>

        <Grid item lg={2} md ={2} sm={2} xl={1} xs={12} container>
          <Button className={classes.refreshButton} size="large" color = "primary" variant="outlined" onClick={getChartData}> 갱신</Button>
        </Grid>  

        <Grid item lg={3} md ={4} sm={4} xl={2} xs={12} container>
          <FormControl className={classes.formControl}>
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
/*
<Grid container spacing={4}>
        <Grid item lg={3} sm={6}  xl={3} xs={12}> <Budget />         </Grid>
        <Grid item lg={3} sm={6}  xl={3} xs={12}> <TotalUsers />     </Grid>
        <Grid item lg={3} sm={6}  xl={3} xs={12}> <TasksProgress />  </Grid>
        <Grid item lg={3} sm={6}  xl={3} xs={12}> <TotalProfit />    </Grid>

        <Grid item lg={8} md={12} xl={9} xs={12}> <LatestSales />    </Grid>
        <Grid item lg={4} md={6}  xl={3} xs={12}> <UsersByDevice />  </Grid>

        <Grid item lg={4} md={6}  xl={3} xs={12}> <LatestProducts /> </Grid>
        <Grid item lg={8} md={12} xl={9} xs={12}> <LatestOrders />   </Grid>
      </Grid>
*/