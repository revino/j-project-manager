import React, {useState, useEffect} from 'react';

//Material
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Button} from '@material-ui/core';

//View
import CollapsibleTable from './CollapsibleTable';

//API
import SheetApi from '../../api/SpreadSheetApi';

//Style
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
  return {id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content};
}

export default function ItemTable(props) {
  const classes = useStyles();
  const [tableData,setTableData] = useState([]);
  const [progressData,setProgessData] = useState(["완료","진행중","진행대기","접수","접수대기"]);
  const [state, setState] = useState({ cb1: false, cb2: true, cb3: true, cb4: true, cb5: true,});
  const { cb1, cb2, cb3, cb4, cb5 } = state;
  const error = [cb1, cb2, cb3, cb4, cb5].filter((v) => v).length < 1;
  
  //handle
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  
  //Request Data
  const getTableData = async() =>{
    const cbArray          = Object.values(state);//[state.cb1, state.cb2, state.cb3, state.cb4, state.cb5]
    const checkBoxConArray = progressData.filter((el,idx) => cbArray[idx] === true).map(el => `B='${el}'`);
    const checkBoxConStr   = checkBoxConArray.join(" or ");
    const queryObject      = { tq: `select * where  (A is not null) and (${checkBoxConStr}) order by C`, sheet: `Item_Tables`}
    
    //API REQUEST
    const resJson          = await SheetApi.getQueryData(queryObject);
    
    //make Array
    const itemArray = resJson.table.rows.map(el => new createData( el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].v,el.c[4].v,el.c[5].v,el.c[6].f,el.c[7].f,el.c[8].v,el.c[9].v,el.c[10].v))
    
    setTableData(itemArray);
  }

  const getProgressData = async() =>{
    const queryObject   = { tq: `select C where  C is not null offset 1`, sheet: `Prop_Types`};

    //API REQUEST
    const resJson       = await SheetApi.getQueryData(queryObject);

    //make Arrau
    const proGressArray = resJson.table.rows.map(el => el.c[0].v);
    
    setProgessData(proGressArray);
  }

  useEffect(() => {
    getProgressData();
  }, []);

  return (
  <div className={classes.root}>
    <Grid container spacing={4}>
      <Grid item lg={1} md={1} sm={2} xl={1} xs={2} container>
        <Button className={classes.refreshButton}
          color = "primary"
          variant="contained"
          onClick={getTableData}
        > 갱신
        </Button>
      </Grid>
      <Grid item lg={11} md={11} sm={10} xl={11} xs={10} container>
        <FormControl required error={error} component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">1개 이상 선택</FormLabel>
          <FormGroup className={classes.formGroup}>
            {progressData.map((el,idx) => (
              <FormControlLabel
                key={`cb${idx+1}`} control={<Checkbox checked={state[`cb${idx+1}`]} onChange={handleChange} name={`cb${idx+1}`} />} label={el}
              />
            ))} 
          </FormGroup>
        </FormControl>  
      </Grid>
  
      <Grid item lg={12} sm={12} xl={12} xs={12}>
        <CollapsibleTable data={tableData}/>
      </Grid>
    </Grid>
  </div>
  );


}
