//React
import React, {useLayoutEffect, useRef} from 'react';

//Material UI
import { makeStyles } from '@material-ui/styles';

//Am Chart
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

//Style
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


const colorSet = new am4core.ColorSet();
const tooltip = "[bold]기간: [/]{openDateX} ~ [/]{dateX}\n[bold]사이트: [/]{company} {line}\n[bold]이름: [/]{pjtName}\n[bold]No: [/]{pjtno}\n[bold]담당자: [/]{pic}";

colorSet.saturation = 0.4;
am4core.useTheme(am4themes_animated);

export default function ChartView(props) {

  const chart = useRef(null);
  const classes = useStyles();
  
  useLayoutEffect((props) => {

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

    let series1 = x.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(60);
    series1.columns.template.tooltipText = tooltip;

    series1.dataFields.openDateX = "start";
    series1.dataFields.dateX = "end";
    series1.dataFields.categoryY = "category";

    series1.columns.template.propertyFields.fill = "color";
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 1;


    // Sell Auto Adjust
    let cellSize = 30;
    x.events.on("datavalidated", function(ev) {

      // Get objects
      let chart = ev.target;
      let categoryAxis = chart.yAxes.getIndex(0);
      const itemArray = chart.data.map(el => el.category);
      const CategoryArray = Array.from(new Set(itemArray));

      // Calculate how we need to adjust chart height
      let adjustHeight = CategoryArray.length * cellSize - categoryAxis.pixelHeight;
      let targetHeight = chart.pixelHeight + adjustHeight;
    
      // Set it on chart's container
      chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
    
    x.scrollbarX = new am4core.Scrollbar();
    chart.current = x;

    return () => {
      x.dispose();
    };
  }, []);

  useLayoutEffect(() => {
    chart.current.data = props.data;
  }, [props.data]);

  return (
      <div className={classes.root} id="chartdiv"></div>
  );

}