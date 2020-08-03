import React, {useState, useEffect, useCallback} from 'react';

//Material
import { Grid,FormLabel,FormControl,FormGroup,Checkbox,Button,FormControlLabel} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//View
import CollapsibleTable from './CollapsibleTable';
import AddModal from '../../components/AddModal'

//API
import SheetApi from '../../api/SpreadSheetApi';

//Style
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
  },
  formControl: {
    display:"inline",
  },
  formGroup: {
    display:"inline",

  },
  refreshButton:{
    width: "100%",
    padding: theme.spacing(2),
  }
}));


function createData(id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content ) {
  return {id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content};
}

export default function ItemTable(props) {
  const classes = useStyles();
  
  //State
  const [tableData,setTableData] = useState([]);
  const [progressData,setProgessData] = useState(["접수","진행중","진행대기","완료","접수대기"]);
  const [state, setState] = useState({ cb1: true, cb2: true, cb3: true, cb4: false, cb5: true,});
  const [modalOpen, setModalOpen] = useState(false);
  
  const { cb1, cb2, cb3, cb4, cb5 } = state;
  const error = [cb1, cb2, cb3, cb4, cb5].filter((v) => v).length < 1;
  
  //handle
  const handleChange = (event) => { setState({ ...state, [event.target.name]: event.target.checked }); };
  const handleOpen = () => { setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); };

  
  //Request Data
  const getTableData = useCallback(async() =>{
    const cbArray          = Object.values(state);//[state.cb1, state.cb2, state.cb3, state.cb4, state.cb5]
    const checkBoxConArray = progressData.filter((el,idx) => cbArray[idx] === true).map(el => `B='${el}'`);
    const checkBoxConStr   = checkBoxConArray.join(" or ");
    const queryObject      = { tq: `select * where  (A is not null) and (${checkBoxConStr}) order by C`, sheet: `Item_Tables`}
    
    //API REQUEST
    const resJson          = await SheetApi.getQueryData(queryObject);
    
    //make Array
    const itemArray = resJson.table.rows.map(el => new createData( el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].v,el.c[4].v,el.c[5].v,el.c[6].f,el.c[7].f,el.c[8].v,el.c[9].v,el.c[10].v))
    
    setTableData(itemArray);
  }, [progressData, state])

  const getProgressData = async() =>{
    const queryObject   = { tq: `select C where  C is not null offset 1`, sheet: `Prop_Types`};

    //API REQUEST
    const resJson       = await SheetApi.getQueryData(queryObject);

    //make Arrau
    const proGressArray = resJson.table.rows.map(el => el.c[0].v);
    
    setProgessData(proGressArray);
  }

  //Update Data
  const updateData = async(newData, oldData) =>{
    console.log("데이터 업데이트");
    await SheetApi.setData(newData.id,newData);
    await getTableData();
  }

  const deleteData = async(oldData) =>{
  }
  const changeContent  = async(e) =>{

    const array = tableData;
    console.log(e.target.value);
    console.log(e.target.id-1);
    console.log(array[e.target.id-1].content);
    array[e.target.id-1].content=e.target.value;
    setTableData(array);
  }
  useEffect(() => { 
    getProgressData(); 
  }, []);

  useEffect(() =>{
    getTableData()
  }, [getTableData])

  return (
  <div className={classes.root}>
    { modalOpen &&
    <AddModal open={modalOpen} handleClose={handleClose}/>
    }
    <Grid container spacing={2}>
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center" >
        {/*<IconButton aria-label="refresh" color = "primary" onClick={getTableData} disabled={error}>
          <Refresh />갱신
        </IconButton>*/}
        { <Button className={classes.refreshButton}
            color = "primary"
            variant="outlined"
            onClick={getTableData}
            disabled={error}
          > 갱신
          </Button>}
      </Grid>
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center">
        {/*<IconButton aria-label="refresh" color = "inherit" onClick={handleOpen}>
          <Add />추가
        </IconButton>*/}
        {<Button className={classes.refreshButton}
          color = "inherit"
          variant="outlined"
          onClick={handleOpen}
        > 추가
        </Button>}

      </Grid>
      <Grid item lg={10} md={12} sm={12} xl={10} xs={12} container>
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
        <CollapsibleTable data={tableData} onRowUpdate={updateData} onRowDelete={deleteData} onContentChange={changeContent}/>
      </Grid>
    </Grid>
  </div>
  );


}
