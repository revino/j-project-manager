import React, {useState, useEffect} from 'react';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import qs from "qs";
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import CollapsibleTable from './CollapsibleTable'

import { Button} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
  },
  formControl: {
    display:"inline",
    margin: theme.spacing(3),
  },
  formGroup: {
    display:"inline"
  },
  refreshButton:{
    padding: theme.spacing(4),
  }
}));


function createData(id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content ) {
  return {
    id, 
    progress, 
    company, 
    line, 
    pl, 
    pic, 
    start, 
    end, 
    pjtno, 
    pjtname,
    content
  };
}

export default function ItemTable(props) {
  const classes = useStyles();
  const [tableData,setTableData] = useState([]);
  const [progressData,setProgessData] = useState(["완료","진행중","진행대기","접수","접수대기"]);
  const [state, setState] = React.useState({
    cb1: false,
    cb2: true,
    cb3: true,
    cb4: true,
    cb5: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const { cb1, cb2, cb3, cb4, cb5 } = state;
  const error = [cb1, cb2, cb3, cb4, cb5].filter((v) => v).length < 1;

  const getTableData = async() =>{
    const token = localStorage.getItem('ACCESS_TOKEN');
    const tokeType = localStorage.getItem('TOKEN_TYPE');
    const path = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/1Eb2Bwx7aRWc2vwVyqw8rK4vKeM9U99bDPRNnJWIcC_s/gviz/tq"
    const cbArray = [state.cb1, state.cb2, state.cb3, state.cb4, state.cb5]
    let   item = [];

    let cbCon = ``

    for (const [idx, el] of cbArray) {
      if(el === true && cbCon !== '' )cbCon += " or ";
      if(el === true) cbCon += `B='${progressData[idx]}'`;
    }
    console.log(`select * where  (A is not null) and (${cbCon}) order by C`);
    const queryStr = qs.stringify({
      tq: `select * where  (A is not null) and (${cbCon}) order by C`,
      sheet: `Item_Tables`
    });
    const fullpath =  path+ "?" + queryStr

    const resData = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token, AccessControlAllowOrigin: '*' },
      method : 'GET',
    })

    let resText = await resData.text();
    resText = resText.substr(47);
    resText = resText.substring(0,resText.length-2)
    const resjson = await JSON.parse(resText);

    console.log("아이템 요청");
    console.log(resjson);

    for (var el of resjson.table.rows) {
      //createData(id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content )
      const i = new createData(
        el.c[0].v,
        el.c[1].v,
        el.c[2].v,
        el.c[3].v,
        el.c[4].v,
        el.c[5].v,
        el.c[6].f,
        el.c[7].f,
        el.c[8].v,
        el.c[9].v,
        el.c[10].v)
      item.push(i);
    };
    setTableData(item);
  }

  const getProgressData = async() =>{
    const token = localStorage.getItem('ACCESS_TOKEN');
    const tokeType = localStorage.getItem('TOKEN_TYPE');
    const path = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/1Eb2Bwx7aRWc2vwVyqw8rK4vKeM9U99bDPRNnJWIcC_s/gviz/tq"

    const queryStr = qs.stringify({
      tq: `select C where  C is not null offset 1`,
      sheet: `Prop_Types`
    });
    const fullpath =  path+ "?" + queryStr

    const resData = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token, AccessControlAllowOrigin: '*' },
      method : 'GET',
    })

    let resText = await resData.text();
    resText = resText.substr(47);
    resText = resText.substring(0,resText.length-2)
    const resjson = await JSON.parse(resText);

    setProgessData(resjson.table.rows.map((el,idx) => el.c[0].v));
  }

  useEffect(() => {
    getProgressData()
  }, []);


  return (
  <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={12} sm={12} xl={12} xs={12}>
        <Button className={classes.refreshButton}
          size="large" 
          color = "primary"
          variant="contained"
          onClick={getTableData}
        > 갱신
        </Button>
        <FormControl required error={error} component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">1개 이상 선택</FormLabel>
          <FormGroup className={classes.formGroup}>
            {progressData.map((el,idx) => (
              <FormControlLabel
              control={<Checkbox checked={state[`cb${idx+1}`]} onChange={handleChange} name={`cb${idx+1}`} />}
              label={el}
              />
            ))} 
          </FormGroup>
        </FormControl>  
        </Grid>
        <Grid item lg={12} sm={12} xl={12} xs={12}><CollapsibleTable data={tableData}/>  </Grid>
      </Grid>
  </div>
  );


}
