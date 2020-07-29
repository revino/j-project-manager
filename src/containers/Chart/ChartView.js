import React, {useState,useLayoutEffect, useRef} from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';


import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import moment from 'moment'

import { Button, FormControl, InputLabel, MenuItem, Select, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import qs from "qs";

const useStyles = makeStyles(theme => ({
    root: {
      width: "100%",
      height: "60px",
      display: 'flex'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      float: "left"
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },

  }));

am4core.useTheme(am4themes_animated);

let colorSet = new am4core.ColorSet();
colorSet.saturation = 0.4;

const tooltip = "[bold]기간: [/]{openDateX} ~ [/]{dateX}\n[bold]사이트: [/]{company} {line}\n[bold]이름: [/]{pjtName}\n[bold]No: [/]{pjtno}\n[bold]담당자: [/]{pic}";

function ChartItem(id, pic, pjtName, start, end, company, line, pjtno, color, category ) {
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
  this.color = color;
  this.pjtno = pjtno
  this.sort = category;
}

export default function ChartView(props) {
  const [ChartData, setChartData] = useState(null);
  const [SortCategory, setSortCategory] = useState(3);
  const [YCategory, setYCategory] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState(moment());
  const [selectedEndDate, setSelectedEndDate] = useState(moment().add(20, 'days'));

 // const [selectedStartDate, setSelectedStartDate] = useState(new Date('2014-08-18T21:11:54'));
 // const [selectedEndDate, setSelectedEndDate] = useState(new Date('2014-08-18T21:11:54'));

  const chart = useRef(null);
  const classes = useStyles();
  
  const parseChartData = async(resdata, initData) =>{ 
    let data = [];
    let lastName;
    let color = -1;
    let colorbright = 1;
    if(Object.keys(initData).length > 0){
      console.log("init 데이터 초기화");
      for (const el of initData.table.rows) {
        let item = new ChartItem(null,el.c[0].v,null,null,null,null,null,null,null,YCategory)
        data.push(item);
      }
    }

    //A, F, J, G, H, C, D, I
    //id,charger,pjt name,start,end, company, line, pjtNo
    for (const el of resdata.table.rows) {
      if(lastName !== el.c[1].v) {color++; colorbright=1;lastName=el.c[1].v;}
      if(lastName === el.c[1].v ) {colorbright-=0.2;}
      let item = new ChartItem(el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].f,el.c[4].f,el.c[5].v,el.c[6].v,el.c[7].v,colorSet.getIndex(color).brighten(colorbright),YCategory)
      data.push(item);
      return item;
    }

    //console.log(data);
    setChartData(data);
  }

  const getChartData = async() =>{
    const token = localStorage.getItem('ACCESS_TOKEN');
    const tokeType = localStorage.getItem('TOKEN_TYPE');
    const path = "https://cors-anywhere.herokuapp.com/https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/1Eb2Bwx7aRWc2vwVyqw8rK4vKeM9U99bDPRNnJWIcC_s/gviz/tq"
    let   sort;
    let   initData = {};

         if(SortCategory === 0)  sort="A";
    else if(SortCategory === 1)  sort="F";
    else if(SortCategory === 2)  sort="J";
    else if(SortCategory === 3)  sort="C";
    else if(SortCategory === 4)  sort="I";

    const queryStr = qs.stringify({
      tq: `select A, F, J, G, H, C, D, I where G <= date '${moment(selectedEndDate).format("YYYY-MM-DD")}' and H >= date '${moment(selectedStartDate).format("YYYY-MM-DD")}' order by ${sort} asc`
    });

    console.log("시작일 : " + moment(selectedStartDate).format("YYYY-MM-DD"));
    console.log("종료일 : " + moment(selectedEndDate).format("YYYY-MM-DD"));


    const queryStr2 = qs.stringify({
      tq: `select A where A is not null offset 1`,
      sheet: `Prop_Types`
    });
    
    const fullpath =  path+ "?" + queryStr

    const resData = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token, AccessControlAllowOrigin: '*' },
      method : 'GET',
    })

    if(YCategory === 1){
      console.log("기준 이름 요청");
      const resName = await fetch(path+ "?" + queryStr2, {
        headers: { Authorization: tokeType + " " + token, AccessControlAllowOrigin: '*'},
        method : 'GET',
      })

      let resText = await resName.text();
      resText = resText.substr(47);
      resText = resText.substring(0,resText.length-2)
      initData = await JSON.parse(resText);
      console.log(initData);
    }

    let resText = await resData.text();
    resText = resText.substr(47);
    resText = resText.substring(0,resText.length-2)
    const resjson = await JSON.parse(resText);
    console.log(resjson);

    parseChartData(resjson,initData);


  }

  useLayoutEffect(() => {

    let x = am4core.create("chartdiv", am4charts.XYChart);

    //설정
    x.hiddenState.properties.opacity = 0;
    
    x.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

    let data = ChartData;

    x.data = data;
    x.dateFormatter.dateFormat = "MM월 dd일";
    x.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    
    //축 생성
    let categoryAxis = x.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.inversed = true;

    let dateAxis = x.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 40;
    dateAxis.baseInterval = { count: 1, timeUnit: "day" };
    dateAxis.dateFormats.setKey("day", "MM/dd");
    dateAxis.renderer.tooltipLocation = 0;

    let series1 = x.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(60);
    series1.columns.template.tooltipText = tooltip;

    series1.dataFields.openDateX = "start";
    series1.dataFields.dateX = "end";
    series1.dataFields.categoryY = "category";

    series1.columns.template.propertyFields.fill = "color";
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 1;


    // Set cell size in pixels
    let cellSize = 25;
    x.events.on("datavalidated", function(ev) {

    
      // Get objects of interest
      let chart = ev.target;
      let categoryAxis = chart.yAxes.getIndex(0);
      const itemArray = chart.data.map(el => el.category);
      const CategoryArray = Array.from(new Set(itemArray));
      console.log("item count:");
      console.log(itemArray);
      console.log(CategoryArray);

      // Calculate how we need to adjust chart height
      
      let adjustHeight = CategoryArray.length * cellSize - categoryAxis.pixelHeight;
      console.log("조정 높이:" + adjustHeight);
      console.log("카테고리 갯수:" +CategoryArray.length )
      // get current chart height
      let targetHeight = chart.pixelHeight + adjustHeight;
    
      // Set it on chart's container
      chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
    
    x.scrollbarX = new am4core.Scrollbar();


    chart.current = x;


    return () => {
      x.dispose();
    };
  }, [ChartData]);

  useLayoutEffect(() => {
    chart.current.data = ChartData;

  }, [ChartData]);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  return (
    <React.Fragment>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
      <Button className={classes.refreshButton}
      size="large" 
          color = "primary"
          variant="contained"
          onClick={getChartData}
        > 갱신
        </Button>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-sort">정렬</InputLabel>
        <Select
          labelId="select-sort"
          id="sort-select"
          value={SortCategory}
          onChange={({ target: { value } }) => setSortCategory(value)}
        >
          <MenuItem value={0}>ID</MenuItem>
          <MenuItem value={1}>담당자</MenuItem>
          <MenuItem value={2}>PJT 이름</MenuItem>
          <MenuItem value={3}>사이트</MenuItem>
          <MenuItem value={4}>PJT No</MenuItem>
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
      <InputLabel id="select-category">기준</InputLabel>
        <Select
          labelId="select-category"
          id="category-select"
          value={YCategory}
          onChange={({ target: { value } }) => setYCategory(value)}
        >
          <MenuItem value={0}>PJT 이름</MenuItem>
          <MenuItem value={1}>담당자</MenuItem>
          <MenuItem value={2}>사이트</MenuItem>
        </Select>
        </FormControl>
        <KeyboardDatePicker className={classes.formControl}
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
        <KeyboardDatePicker className={classes.formControl}
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="yyyy-MM-dd"
          value={selectedEndDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />

      </Grid>
    </MuiPickersUtilsProvider>


  

 
      <div className={classes.root} id="chartdiv"></div>
    </React.Fragment>
  );

}