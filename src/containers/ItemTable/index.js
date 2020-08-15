import React, {useState, useEffect, useCallback} from 'react';

//Material
import { Grid,FormLabel,FormControl,FormGroup,Checkbox,Button,FormControlLabel, CircularProgress} from '@material-ui/core';
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

const checkBoxDefault = { cb1: true, cb2: true, cb3: true, cb4: false, cb5: true, cb6: true};
const defaultProgressData = ["접수(작지X)","진행중","접수 완료(작지O)","완료","모니터링中"];
const defaultFieldData = {pic:[],line:[],progress:defaultProgressData,company:[],pl:[]};

function createData(id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content ) {
  return {id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content};
}

export default function ItemTable(props) {
  const classes = useStyles();
  
  //State
  const [tableData,setTableData] = useState([]);
  const [state, setState] = useState(checkBoxDefault);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  //Field
  const [fieldData, setFieldData] = useState(defaultFieldData);
  
  //error con
  //const error = [state.cb1, state.cb2, state.cb3, state.cb4, state.cb5, satte.cb6].filter((v) => v).length < 1;
  const error = [state].filter((v) => v).length < 1;
  const ModalError = Object.keys(fieldData).filter(v => v == null || v === []).length > 0;

  //handle
  const handleChange   = (event) => { setState({ ...state, [event.target.name]: event.target.checked }); }
  const handleOpen     = ()      => { setModalOpen(true); }
  const handleClose    = ()      => { setModalOpen(false); }
  const onRefreshClick = ()      => {const cbState = state; getTableData(cbState); }
  
  //Request Data
  const getTableData = useCallback(async(cbState) =>{
    setLoading(true);
    const cbArray          = Object.values(cbState);//[state.cb1, state.cb2, state.cb3, state.cb4, state.cb5]
    const checkBoxConArray = fieldData.progress.filter((el,idx) => cbArray[idx] === true).map(el => `B='${el}'`);
    const checkBoxConStr   = checkBoxConArray.join(" or ");
    const queryObject      = { tq: `select * where  (A is not null) and (${checkBoxConStr}) order by C`, sheet: `Item_Tables`}
    
    //API REQUEST
    const resJson          = await SheetApi.getQueryData(queryObject);
    
    //make Array
    const itemArray = resJson.table.rows.map(el => new createData( el.c[0].v,el.c[1].v,el.c[2].v,el.c[3].v,el.c[4].v,el.c[5].v,el.c[6].f,el.c[7].f,el.c[8].v,el.c[9].v,el.c[10].v))
    
    setTableData(itemArray);
    setLoading(false);
  }, [fieldData.progress])

  const getProgressData = async() =>{

    setLoading(true);
    const fieldData = {pic:[],line:[],progress:[],company:[],pl:[]}
    const conArray =  ["A is not null","B is not null","C is not null","D is not null","E is not null"]
    const ConStr   = conArray.join(" or ");
    const queryObject   = { tq: `select A,B,C,D,E where (${ConStr}) offset 1`, sheet: `Prop_Types`};

    //API REQUEST
    const resJson       = await SheetApi.getQueryData(queryObject);

    //make Array
    for (let el of resJson.table.rows) {
      if(el.c[0] !== null && el.c[0].v !== null) fieldData['pic'].push(el.c[0].v);
      if(el.c[1] !== null && el.c[1].v !== null)  fieldData['line'].push(el.c[1].v);
      if(el.c[2] !== null && el.c[2].v !== null) fieldData['progress'].push(el.c[2].v);
      if(el.c[3] !== null && el.c[3].v !== null) fieldData['company'].push(el.c[3].v);
      if(el.c[4] !== null && el.c[4].v !== null) fieldData['pl'].push(el.c[4].v);
    }
    setFieldData(fieldData);
    setLoading(false);
  }

  //Update Data
  const updateData = async(newData, oldData) =>{
    await SheetApi.setData(newData.id,newData);
    await getTableData(state);
  }

  const deleteData = async(oldData) =>{
    console.log("삭제콜백");
    await SheetApi.deleteData(oldData.id);
    await getTableData(state);
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
    getTableData(checkBoxDefault)
  }, [getTableData])



  return (
  <div className={classes.root}>
    { modalOpen &&
    <AddModal open={modalOpen} handleClose={handleClose} fieldData={fieldData}/>
    }
    <Grid container spacing={2}>
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center" >
        <Button className={classes.refreshButton}
            color = "primary"
            variant="outlined"
            onClick={onRefreshClick}
            disabled={error}
          > 갱신
        </Button>
      </Grid>
      
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center">
        <Button className={classes.refreshButton}
          color = "inherit"
          variant="outlined"
          onClick={handleOpen}
          disabled={ModalError}
        > 추가
        </Button>

      </Grid>

      <Grid item lg={10} md={12} sm={12} xl={10} xs={12} container>
        <FormControl required error={error} component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">1개 이상 선택</FormLabel>
          <FormGroup className={classes.formGroup}>
            {fieldData.progress.map((el,idx) => (
              <FormControlLabel
                key={`cb${idx+1}`} control={<Checkbox checked={state[`cb${idx+1}`]} onChange={handleChange} name={`cb${idx+1}`} />} label={el}
              />
            ))} 
          </FormGroup>
        </FormControl>  
      </Grid>
  
      <Grid item lg={12} sm={12} xl={12} xs={12}>
        { loading &&
          <div className={classes.root}>
          <CircularProgress />
          </div>
        }
        { !loading &&
        <CollapsibleTable data={tableData} onRowUpdate={updateData} onRowDelete={deleteData} onContentChange={changeContent} fieldData={fieldData}/>
        }
      </Grid>
    </Grid>
  </div>
  );


}
