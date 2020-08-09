//React
import React, {useState, useEffect, useCallback, forwardRef} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

//Material UI
import {Box, CardHeader, Button, Card,CardContent,makeStyles ,Divider, CircularProgress} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

//Component
import ChartView from "../Chart/ChartView"

//API
import SheetApi from '../../api/SpreadSheetApi';

//Time
import moment from 'moment'

import * as am4core from "@amcharts/amcharts4/core";

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%'
    }
  }));

const defaultSort = "F";
const defaultYAxis = 2;
const defaultEndTime = 7;

//function
function ChartItem(id, pic, pjtName, start, end, company, line, pjtno,progress, category, color ) {
        if(category === 0)  this.category=pjtName;
    else if(category === 1)  this.category=pic + ":" + id;
    else if(category === 2)  this.category=company + ":" + pic;
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

export default function CardChart(props) {
  const classes = useStyles();
  const [ChartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const CustomRouterLink = forwardRef((props, ref) => (
      <RouterLink {...props} />
  ));
  

  //Get Data 
  const getChartData = useCallback(async(yAxis,start,end,sort) =>{
    setLoading(true);
    const queryObject  = {tq: `select A, F, J, G, H, C, D, I, B where G <= date '${moment(end).format("YYYY-MM-DD")}' and H >= date '${moment(start).format("YYYY-MM-DD")}' order by ${sort} asc`}
    const queryObject2 = {tq: `select A where A is not null offset 1`, sheet: `Prop_Types`}
    let colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;
    let colorIndex = -1, colorBrighten = 1;
    let lastName;
    
    //API REQUEST
    const resChartDataJson  = await SheetApi.getQueryData(queryObject);
    const chartDataArray = resChartDataJson.table.rows.map(el => {
      let startdate = el.c[3].f;
      let enddate = el.c[4].f;
      if(lastName !== el.c[1].v) {colorIndex+=2; colorBrighten =1; }
      else                       colorBrighten -=0.2;
      lastName = el.c[1].v;
      if(moment(startdate) < moment(start)) startdate = moment(start).format("YYYY-MM-DD");
      if(moment(enddate) > moment(end)) enddate = moment(end).format("YYYY-MM-DD");
       
      return new ChartItem(el.c[0].v,el.c[1].v,el.c[2].v,startdate,enddate,el.c[5].v,el.c[6].v,el.c[7].v,el.c[8].v,yAxis, colorSet.getIndex(colorIndex).brighten(colorBrighten));
    });

    //API REQUEST 
    if(yAxis === 1){
      const resNameDataJson  = await SheetApi.getQueryData(queryObject2);
      const chartDataArray = resNameDataJson.table.rows.map(el => {
        return new ChartItem(null,el.c[0].v,null,null,null,null,null,null,null,yAxis);
      });
      chartDataArray.concat(chartDataArray);
    }

    setChartData(chartDataArray);
    setLoading(false);
  }, [])

  useEffect(() =>{
    getChartData(defaultYAxis,moment(),moment().add(defaultEndTime, 'days'),defaultSort);
  }, [getChartData])


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
      { loading &&
          <div className={classes.root}>
          <CircularProgress />
          </div>
      }
      { !loading &&
        <ChartView data={ChartData}/>
      }
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