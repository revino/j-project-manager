import React,{ useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

//Maerial
import { makeStyles } from '@material-ui/styles';
import { Grid, Tabs, Tab,Card, Typography, AppBar } from '@material-ui/core';
import Calendar from '../../components/Calendar'
import LongCalendar from '../../components/LongCalendar'
import withWidth, {isWidthDown } from '@material-ui/core/withWidth';
import {Event, List}  from '@material-ui/icons';

//View
import CardOverTime from './CardOverTime'
import CardBasicTime from './CardBasicTime'
import BackToTop from '../../components/BackToTop'

import { format, differenceInCalendarDays, addMonths, startOfMonth, addDays, endOfMonth, endOfWeek} from "date-fns";

//hooks
import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';

//Api
import {db} from '../../firebase'
import {getUid} from '../../firebase/auth'
import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';
import isSunday from 'date-fns/isSunday';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(1)
    },
    container_calendar:{
      minWidth: "65em",
      maxWidth: "70em",
      display: "block",
      margin: ".5em",
      marginTop: 0,
      "*":{
        boxSizing: "border-box"
      },
      boxSizing: "border-box"
    },
    container_calendar_mini:{
      display: "block",
      margin: ".5em",
      "*":{
        boxSizing: "border-box"
      },
      boxSizing: "border-box"
    },
    container_card:{
      minWidth: "20em",
      display: "block",
      margin: ".5em",
      "*":{
        boxSizing: "border-box"
      },
      boxSizing: "border-box"
    },
    container_card_mini:{
      display: "block",
      margin: ".5em",
      "*":{
        boxSizing: "border-box"
      },
      boxSizing: "border-box"
    },
  }));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (

          <Typography
          component="div"
          role="tabpanel"
          >
            {children}
          </Typography>

      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const workTimeQuery   = (month)=> db.collection(`users`).doc(getUid()).collection(`workOverTimes`).doc(format(month, 'yyyy-MM'));
const directListQuery = (month)=> db.collection(`users`).doc(getUid()).collection(`workDirect`).doc(format(month, 'yyyy-MM'));
const getHolydays = (month)=>{

  const monthStart = startOfMonth(month);
  const monthEnd   = endOfMonth  (monthStart);
  const endDate    = endOfWeek   (monthEnd);
  let day      = monthStart;
  let holidays = [];

  while (day <= endDate) {
    holidays.push(isSunday(day)? 1 : 0);
    day = addDays(day, 1);
  }

  return holidays;
};


function WorkTime(props) {

    const {width} = props;

    const classes = useStyles();

    const [value      , setValue      ] = useState(0);
    const [totalTime  , setTotalTime  ] = useState(0);
    const [fixedPay   , setFixedPay   ] = useState(0);
    const [Month      , setMonth      ] = useState({currentMonth: new Date(),selectedDate: new Date()});
    const [workTimes  , setWorkTimes  ] = useState(Array.from({length: 31}, () => 0));
    const [holidays   , setHolidays   ] = useState(getHolydays(new Date()))
    const [directList , setDirectList ] = useState(Array.from({length: 31}, () => {return {checkin:"", checkout:""};}))

    //custom Hook
    const {data           , setRef             } = useFirebaseListenCollection(workTimeQuery(Month.currentMonth));
    const {data:directData, setRef:setDirectRef} = useFirebaseListenCollection(directListQuery(Month.currentMonth));
    const {data:userdata                       } = useFirebaseOnceCollection  (db.collection(`users`).doc(getUid()));

    //Data request
    const updateWorkTimes = useCallback(async(worktime) =>{

      try{
        const memosRef = db.collection(`users`).doc(getUid()).collection(`workOverTimes`).doc(format(Month.currentMonth, 'yyyy-MM'));

        await memosRef.set({times:worktime});
      }catch(err){
        console.log(err);
      }
    },[Month])

    const updateFixedPay = useCallback(async(fixedpay) =>{
      try{
        const memosRef = db.collection(`users`).doc(getUid());

        await memosRef.update({fixedPay:fixedpay});
      }catch(err){
        console.log(err);
      }
    },[])

    useEffect(()=>{
      if(fixedPay > 0) updateFixedPay(fixedPay);
    },[fixedPay, updateFixedPay])

    //Handle
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const onChangeWorkTime = useCallback(e => {
      e.preventDefault();
      const {value, id} = e.target;
      const worktime = [...workTimes];
      const day = id-1;
      if(day<0 || day>31) return;

      worktime[day]= Number(value);
      setWorkTimes(worktime);
      updateWorkTimes(worktime);
    }, [workTimes,updateWorkTimes]);

    const clearWorkTimes = useCallback(e => {
      let timeArray = new Array(31).fill(0);
      setWorkTimes(timeArray);
    }, []);

    const clearDirectList = useCallback(e => {
      let array = Array.from({length: 31}, () => {return {checkin:"", checkout:""}});
      setDirectList(array);
    }, []);

    const changeMonth = (changeMonth)=>{
      setMonth(changeMonth);
      setHolidays(getHolydays(changeMonth.currentMonth));
      setRef(workTimeQuery(changeMonth.currentMonth));
      setDirectRef(directListQuery(changeMonth.currentMonth));
    }

    const updateDirectist = useCallback(async(list) =>{

      try{
        const memosRef = db.collection(`users`).doc(getUid()).collection(`workDirect`).doc(format(Month.currentMonth, 'yyyy-MM'));

        await memosRef.set({list:list});
      }catch(err){
        console.log(err);
      }
    },[Month])

    const onChangeDirect = useCallback(e => {
      e.preventDefault();
      const {value, name} = e.target;
      const data = name.split(",");
      const list = [...directList];
      const id = Number(data[1]) - 1;
      if(data[1]<0 || data[1]>31) return;

      if(data[0] === "checkout"){
        list[id].checkout = value;
      }
      else if(data[0] ==="checkin" ){
        list[id].checkin = value;
      }
      else return;

      setDirectList(list);
      updateDirectist(list);


    }, [directList, setDirectList,updateDirectist]);

    //UseEffect
    useEffect(() =>{
      const isMobile = isWidthDown('sm', width);
      const tabidx = isMobile? 1 : 0;
      setValue(tabidx);
    }, [width]);

    useEffect(()=>{
      setTotalTime(Math.floor(differenceInCalendarDays(addMonths(Month.currentMonth,1),Month.currentMonth) * 12 / 7));
      //setHolidays(getHolydays(Month.currentMonth))
    },[Month])

    useEffect(()=>{
      try{
        if(!!data){
          const d = data.data()
          if(!!d) {
            let timeArray = new Array(31).fill(0);

            d.times.forEach((el,id) => {
              timeArray[id]= el
            });
            setWorkTimes(timeArray);
          }
          else{
            clearWorkTimes();
          }
        }
      }catch(err){
        console.log(err);
        clearWorkTimes();
      }
    },[data,clearWorkTimes])

    useEffect(()=>{
      try{
        if(!!directData){
          const d = directData.data()
          if(!!d) {
            let array = new Array(31).fill(0);

            d.list.forEach((el,id) => {
              array[id]= el
            });
            setDirectList(array);
          }
          else{
            clearDirectList();
          }
        }
      }catch(err){
        console.log(err);
        clearDirectList();
      }
    },[directData,clearDirectList])

    useEffect(()=>{
      if(!!userdata && !!userdata.data()){
        setFixedPay(userdata.data().fixedPay)
      }
    },[userdata,setFixedPay])

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" id="back-to-top-anchor">
        <Tabs
          value={value} onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
            >
          <Tab icon={<Event />} label="달력" {...a11yProps(0)} />
          <Tab icon={<List />} label="리스트" {...a11yProps(1)} />

        </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Grid container spacing={1}>
            <Grid item lg={4}  sm={4}  xl={3}  xs={12}> <CardOverTime  className={`${classes.container_card}`} Month={Month.currentMonth} workTimes={workTimes} holidays={holidays} totalTime={totalTime}/> </Grid>
            <Grid item lg={4}  sm={4}  xl={3}  xs={12}> <CardBasicTime className={`${classes.container_card}`} Month={Month.currentMonth} workTimes={workTimes} holidays={holidays} totalTime={totalTime} fixedPay={fixedPay} updateFixedPay={setFixedPay}/> </Grid>
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <Card className={`${classes.container_calendar}`} >
                <Calendar workTimes={workTimes} setWorkTimes={onChangeWorkTime} Month={Month} setMonth={changeMonth}/>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={1}>
            <Grid item lg={4} sm={12} xl={4} xs={12}> <CardOverTime  mini className={`${classes.container_card_mini}`} Month={Month.currentMonth} workTimes={workTimes} holidays={holidays} totalTime={totalTime} directList = {directList}/> </Grid>
            <Grid item lg={4} sm={12} xl={4} xs={12}> <CardBasicTime mini className={`${classes.container_card_mini}`} Month={Month.currentMonth} workTimes={workTimes} holidays={holidays} totalTime={totalTime} directList = {directList} fixedPay={fixedPay} updateFixedPay={setFixedPay}/> </Grid>
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <Card className={`${classes.container_calendar_mini}`} >
                <LongCalendar
                  workTimes={workTimes} setWorkTimes={onChangeWorkTime}
                  directList = {directList} setDriects={onChangeDirect}
                  Month={Month} setMonth={changeMonth}/>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <BackToTop/>
      </div>
    );
}

export default React.memo(withWidth()(WorkTime));