import React from 'react';

//Component
import DropBox from '../../components/DropBox'
import DatePicker from '../../components/DatePicker'
import GanttChart from '../../components/GanttChart'

//UI
import 'date-fns';
import { makeStyles } from '@material-ui/styles';
import { Grid, LinearProgress } from '@material-ui/core';

//Time
import moment from 'moment'

//hooks
import useSelect from '../../hooks/useSelect'
import useSelectDate from '../../hooks/useSelectDate'
import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';

import { db } from '../../firebase'
import { connect } from 'react-redux';
import { chartQuery } from './query';


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



const defaultSort = "pic";
const defaultYAxis = 1;
const defaultDuration = 20;
const defaultStart= moment().format("YYYY-MM-DD");
const defaultEnd  = moment().add(defaultDuration, 'days').format("YYYY-MM-DD")

const sortGroup = [{ value:"created_at", label: "ID"}, {value:"pic", label:"담당자"}, {value:"project_name", label:"PJT 이름"}, {value:"company", label:"사이트"}, {value:"project_no", label:"PJT No"}]
const yAxisGroup = [{ value:0, label: "PJT 이름"}, {value:1, label:"담당자"}, {value:2, label:"사이트"}]

function Chart(props) {

  //props

  const classes = useStyles();
  const {selectSheetId} = props;

  //Select Box
  const [sortValue, onChangeSort]           = useSelect(defaultSort);
  const [yAxisValue, onChangeYAxis]         = useSelect(defaultYAxis);
  const [startDateValue, onChangeStartDate] = useSelectDate(defaultStart);
  const [endDateValue, onChangeEndDate]     = useSelectDate(defaultEnd);

  const {data, setRef}   = useFirebaseListenCollection(chartQuery(selectSheetId,startDateValue,endDateValue));

//!!data?data.docs.map(doc=>doc.data()):[]
  const AxisConvert = (docs) =>{

    const data = docs.map((doc, idx)=>{
      const data = doc.data();

      if(!data) return {}
      const start = moment(data.start_date.toDate()).format("YYYY-MM-DD")
      const end  = moment(data.end_date.toDate()).format("YYYY-MM-DD")
      if(moment(endDateValue) < moment(data.start_date.toDate())) return {};

      let yCategory = data.pic + ":" + idx;
      let startdate = start
      let enddate   = end

           if(yAxisValue === 0) yCategory=data.project_name;
      else if(yAxisValue === 1) yCategory=data.pic + ":" + idx;
      else if(yAxisValue === 2) yCategory=data.company + ":" + data.pic + idx;

      if(moment(startdate) < moment(startDateValue)) startdate = moment(startDateValue).format("YYYY-MM-DD");
      if(moment(enddate  ) > moment(endDateValue  )) enddate   = moment(endDateValue).format("YYYY-MM-DD");
      return {...data, category:yCategory, start:startdate, end:enddate,tipStart:start,tipEnd:end};
    });
    data.sort((a,b)=>{
      var nameA = a.pic.toUpperCase(); // ignore upper and lowercase
      var nameB = b.pic.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      // 이름이 같을 경우
      return 0;
    });
    return data;
}

  const handleEndDate = (date)=>{

    onChangeEndDate(date);
  }
  const handleStartDate = (date)=>{
    setRef(db.collection(`tables`).doc(selectSheetId).collection(`items`).where("end_date", ">=",new Date(date)));
    onChangeStartDate(date);
  }


  return (
  <div className={classes.root}>
    <Grid container spacing={2}>

      <Grid item container lg={2} md={2} sm={4} xl={1} xs={6}>
        <DropBox componentKey="sort" list={sortGroup}  label={"정렬"} value={sortValue} onChange={onChangeSort}/>
      </Grid>

      <Grid item container lg={2} md={2} sm={4} xl={1} xs={6}>
        <DropBox componentKey="yaxis" list={yAxisGroup} label={"기준"} value={yAxisValue} onChange={onChangeYAxis}/>
      </Grid>

      <Grid item container lg={2} md={2} sm={4} xl={2} xs={6}>
        <DatePicker componentKey="start" label={"시작일"} value={startDateValue} onChange={handleStartDate}/>
      </Grid>

      <Grid item container lg={2} md={2} sm={4} xl={2} xs={6}>
        <DatePicker componentKey="end" label={"종료일"} value={endDateValue} onChange={handleEndDate}/>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
        {!data && <LinearProgress color="secondary"/>}
        <GanttChart data={!!data? AxisConvert(data.docs): []} />
      </Grid>

    </Grid>
  </div>
  );
}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(Chart)
