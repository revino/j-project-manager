//React
import React, {useLayoutEffect, useEffect,useRef, useCallback} from 'react';

//Material UI
import { makeStyles } from '@material-ui/styles';


//Am Chart
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


//Style
const useStyles = makeStyles(theme => ({
    root: {
      width: "100%",
      height: "250px",
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


const tooltip = "[bold]기간: [/]{tipStart} ~ [/]{tipEnd}\n[bold]상태: [/]{progress}\n[bold]사이트: [/]{company} {line}\n[bold]이름: [/]{project_name}\n[bold]No: [/]{project_no}\n[bold]담당자: [/]{pic}";

am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);

const addChartColor = (data) =>{
  let colorSet = new am4core.ColorSet();
  colorSet.saturation = 0.5;
  let colorIndex = -1, colorBrighten = 1;
  let lastName;
  const colorChartData = data.map(el => {
    if(lastName !== el.pic) {colorBrighten  =1; colorIndex+=1; }
    else                    {colorBrighten -=0.2;              }
    lastName = el.pic;
    return {...el,color:colorSet.getIndex(colorIndex).brighten(colorBrighten)}
  });
  return colorChartData;
}

function GanttChart(props) {

  const chart = useRef(null);
  const classes = useStyles();
  const {data} = props;


  const makeChart = useCallback(() => {
    let x = am4core.create("chartdiv", am4charts.XYChart);

    //설정
    x.hiddenState.properties.opacity = 0;
    x.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
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
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 50;

    let series1 = x.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(60);
    series1.columns.template.tooltipText = tooltip;
    

    series1.dataFields.openDateX = "start";
    series1.dataFields.dateX = "end";
    series1.dataFields.categoryY = "category";

    series1.columns.template.propertyFields.fill = "color";
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 1;

    series1.tooltip.animationDuration = 500
    /* Add chart cursor */
    x.cursor = new am4charts.XYCursor();
    x.cursor.xAxis = categoryAxis;
    x.cursor.fullWidthLineX = true;

  
    x.colors.step = 2;

    // Sell Auto Adjust
    let cellSize = 50;
    x.events.on("datavalidated", function(ev) {
      // Get objects
      let chart = ev.target;
      let categoryAxis = chart.yAxes.getIndex(0);
      const itemArray = chart.data.map(el => el.category);
      const CategoryArray = Array.from(new Set(itemArray));

      // Calculate how we need to adjust chart height
      let adjustHeight = CategoryArray.length * cellSize - categoryAxis.pixelHeight;
      let targetHeight = chart.pixelHeight + adjustHeight;
      console.log(CategoryArray.length ,categoryAxis.pixelHeight,targetHeight);
      // Set it on chart's container
      chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
    x.scrollbarX = new am4core.Scrollbar();
    return x;

  },[])
  
  useLayoutEffect(()=>{
    chart.current = makeChart();

    return () => {
      chart.current.dispose()
      
    };
  }, [makeChart]);
  

  useEffect(()=>{
    if(!!data && data.length> 0) {
      chart.current.data= addChartColor(data);
    }
  }, [data]);
  

  return (
      <div className={classes.root} id="chartdiv"></div>
  );

}


export default React.memo(GanttChart)