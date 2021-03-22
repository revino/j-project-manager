//React
import React,{useEffect, useState} from 'react';

//Material UI
import {Box, Grid, Card,CardContent,makeStyles, TextField} from '@material-ui/core';

import NumberFormat from 'react-number-format';

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      matringTop: theme.spacing(4)
    },
    Card_HeadTop: {
      lineHeight: 1.5,
      color: "#495057",
      textAlign: "left",
      fontSize: "115%",
      fontWeight: "800",
    },
    Card_HeadRight: {
      lineHeight: 1.5,
      textAlign: "right",

      fontWeight: "800",
      '& span:first-child':{
        fontSize: "90%",
        color: "#495057"
      },
      '& span:last-child':{
        fontSize: "115%",
        color: theme.palette.primary.main
      }
    },
    Card_input:{
      maxWidth: "7em"
    },
    Card_MainRight: {
      lineHeight: 1.5,
      textAlign: "right",
      fontWeight: "800",
      '& span:first-child':{
        fontSize: "90%",
        color: "#495057"
      }
    },
    Card_Bottom:{
      paddingTop: ".7em"
    },
    Card_HeadBtm: {
      lineHeight: 1.5,
      color: theme.palette.primary.light,
      textAlign: "left",
      fontSize: "75%",
      fontWeight: "550"
    },
  }));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      suffix="원"
    />
  );
}
/*

const calcPay = (fixPay, workTimes, totalTime)=>{
  const hourPay = fixPay / 20;
  const workTime = !!workTimes? workTimes.reduce((a,b)=> a+b).toFixed(1) : 0;
  const moneyTime =  (workTime > 20)? workTime - 20 : 0;
  return Math.ceil(hourPay * moneyTime);
}
*/
const calcPay2 = (fixedPay,  workTimes, holidays,maxOverTime) => {
  if(holidays === null || holidays.length ===0) return 0;
  if(workTimes === null || workTimes.length === 0) return 0;
  console.log(holidays, "log")
       const hourPay = fixedPay/20; 
  
        const maxMoneyTime = maxOverTime-20; 
  
      const holidayTime = workTimes.reduce((acc,cur,idx)=>acc+(holidays[idx]===1? cur: 0 ),0); 
  
       const totalTime = workTimes.reduce((acc,cur)=> acc+ cur); 
  
       let moneyTime=0; 
  
       moneyTime += holidayTime ;
       if(totalTime > maxOverTime-20){
           moneyTime += (maxMoneyTime-holidayTime) ;
       }
       else if(totalTime>20){
            moneyTime += totalTime;
        }

       return moneyTime * hourPay;
  }
  



function CardBasicTime(props) {
  const classe = useStyles();
  const {className, workTimes, totalTime, fixedPay, updateFixedPay, holidays} = props;
  const [extraPay, setExtraPay] = useState(calcPay2(fixedPay,workTimes,holidays, totalTime));
  const handleChange = (event) => {
    const extraPay = calcPay2(event.target.value,workTimes,holidays,totalTime);
    updateFixedPay(event.target.value);
    setExtraPay(extraPay);
  };

  useEffect(()=>{
    const extraPay = calcPay2(fixedPay,workTimes,holidays,totalTime);
    setExtraPay(extraPay);
  },[workTimes, totalTime, fixedPay,holidays])


  return (
    <Card className={className}>
    <CardContent>
      <Grid
        container3
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item lg={8}  sm={8}  xl={8}  xs={8}> <Box className={classe.Card_HeadTop  }>기본 근무 시간</Box> <Box className={classe.Card_HeadBtm}>근무일 X 8h</Box></Grid>
        <Grid item lg={4}  sm={4}  xl={4}  xs={4} ><Box className={classe.Card_HeadRight}></Box> </Grid>
      </Grid>
    </CardContent>

    <CardContent className={classe.Card_Bottom}>
      <Grid
        container
        justify="center"
        alignItems="center"
      >
        <Grid item lg={6}  sm={6}  xl={6}  xs={6}>
          <Box className={classe.Card_input}>
            <TextField
              label="고정 근무 수당"
              value={fixedPay}
              onChange={handleChange}
              name="numberformat"
              id="fixedMoney"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </Box>
        </Grid>
        <Grid item lg={6}  sm={6}  xl={6}  xs={6} >
          <Box className={classe.Card_MainRight}>
            <TextField
                label="받는 금액"
                value={extraPay}
                name="numberformat"
                id="totalMoney"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  readOnly: true,
                }}
            />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
  );
}

export default CardBasicTime;
