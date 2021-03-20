//React
import React from 'react';

//Material UI
import {Box, Grid, Card,CardContent,makeStyles} from '@material-ui/core';



import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      matringTop: theme.spacing(4)
    },
    Card_HeadTop: {
      lineHeight: 1.5,
      color: "#495057",
      textAlign: "left",
      fontSize: "1.2em",
      fontWeight: "800",
    },
    Card_HeadBtm: {
      lineHeight: 1.5,
      color: theme.palette.primary.light,
      textAlign: "left",
      fontSize: ".75em",
      fontWeight: "550"
    },
    Card_HeadRight: {
      lineHeight: 1.5,
      textAlign: "right",

      fontWeight: "800",
      '& span:first-child':{
        fontSize: ".9em",
        color: "#495057"
      },
      '& span:last-child':{
        fontSize: "1.2em",
        color: theme.palette.success.main
      }
    },
    Card_MainRight: {
      lineHeight: 1.5,
      textAlign: "right",
      fontWeight: "800",
      '& span:first-child':{
        fontSize: ".9em",
        color: "#495057"
      }
    },
  }));

function CardOverTime(props) {
  const classe = useStyles();
  const {className, workTimes, totalTime} = props;
  const workTime = !!workTimes? workTimes.reduce((a,b)=> a+b).toFixed(1) : 0;
  const percent = (workTime > 0 && totalTime>0)? workTime>totalTime? 100 : (workTime/totalTime * 100) : 0;

  return (
    <Card className={className}>
    <CardContent className={classe.Card_TopContent}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item lg={6}  sm={6}  xl={6}  xs={6}> <Box className={classe.Card_HeadTop  }>초과 근무 시간</Box> <Box className={classe.Card_HeadBtm}>역일 X (12h / 7일)</Box></Grid>
        <Grid item lg={6}  sm={6}  xl={6}  xs={6} ><Box className={classe.Card_HeadRight}><span>{workTime}</span> / <span>{totalTime}H</span></Box> </Grid>
      </Grid>
    </CardContent>

    <CardContent>
      <LinearProgressWithLabel variant="determinate" value={percent} />
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item lg={6}  sm={6}  xl={6}  xs={6}> <Box className={classe.Card_HeadBtm}>Money Time {workTime>20? (workTime>totalTime?totalTime:workTime) - 20 : 0}h</Box></Grid>
          <Grid item lg={6}  sm={6}  xl={6}  xs={6} ><Box className={classe.Card_MainRight}><span>완료까지{workTime> totalTime? 0:totalTime - workTime}시간</span></Box> </Grid>
        </Grid>
    </CardContent>
  </Card>
  );
}

export default CardOverTime;
