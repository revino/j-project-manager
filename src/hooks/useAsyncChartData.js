import { useState, useCallback } from 'react';

//Time
import moment from 'moment'

import {getQueryData} from '../api/SpreadSheetApi';

const parseChart = (data,params) =>{

  const result  = data.table.rows.map(el => {
    const chartData = {id : el.c[0].v,pic: el.c[1].v,pjtName: el.c[2].v,start: el.c[3].f,end: el.c[4].f,company: el.c[5].v,line: el.c[6].v,pjtno: el.c[7].v,progress:el.c[8].v};
    let yCategory = chartData.pic + ":" + chartData.id;
    let startdate = chartData.start;
    let enddate   = chartData.end; 
    let tipStart  = chartData.start;
    let tipEnd    = chartData.end;
         if(params.yAxisValue === 0)  yCategory=chartData.pjtName;
    else if(params.yAxisValue === 1)  yCategory=chartData.pic + ":" + chartData.id;
    else if(params.yAxisValue === 2)  yCategory=chartData.company + ":" + chartData.pic + chartData.id;
    if(moment(startdate) < moment(params.startDateValue)) startdate = moment(params.startDateValue).format("YYYY-MM-DD");
    if(moment(enddate  ) > moment(params.endDateValue  )) enddate   = moment(params.endDateValue).format("YYYY-MM-DD");
    return {...chartData, category:yCategory, start:startdate, end:enddate,tipStart,tipEnd};
  });


  return result;
};

const useAsyncChartData = () => {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async(prop) => {
    setIsLoading(true);
    try {
      const {tq, selectSheetId, yAxisValue,startDateValue,endDateValue} = prop;
      const response = await getQueryData({tq,selectSheetId});

      if(!response.ok) throw new Error(response.status);

      const resText = await response.text();
      const resData = JSON.parse(resText.substring(47,resText.length-2));
      const chartData = parseChart(resData, {yAxisValue,startDateValue,endDateValue});

      setData(chartData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setIsLoading(false);
    }
  },[]);

  return { data, isLoading, error, loadData };
}

export default useAsyncChartData