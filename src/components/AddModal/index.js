import React, {useState,useEffect} from 'react';

//Material UI
import 'date-fns';
import {Grid, FormControl, InputLabel, MenuItem, Select, TextareaAutosize, Modal, Divider, TextField, Button, makeStyles} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';


//API
import SheetApi from '../../api/SpreadSheetApi'

//Time
import moment from 'moment'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
root: {
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: "50%",
    },
    },
  paper: {
    position: 'absolute',
    width: "70%",
    height: "90%",
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "auto"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
    float: "left"
  },
  dateform: {
    margin: theme.spacing(1),
    minWidth: 140,
    float: "left"
  },
  textarea: {
    margin: theme.spacing(1),
    width: "98%"
  },
  button: {
    margin: theme.spacing(1),
    width: "100%"
  },

}));

const defaultData = ["LOADING"]

function createData(id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content ) {
    return {id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content};
  }

export default function AddModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  //Field
  const [progessField, setProgessField] = useState(defaultData);
  const [companyField, setCompanyField] = useState(defaultData);
  const [plField, setPlField] = useState(defaultData);
  const [picField, setPicField] = useState(defaultData);
  const [lineField, setLineField] = useState(defaultData);

  //data
  const [progress, setProgress] = useState(0);
  const [company, setCompnay] = useState(0);
  const [pl, setPl] = useState(0);
  const [pic, setPic] = useState(0);
  const [line, setLine] = useState(0);
  const [content, setContent] = useState("");
  const [pjtno, setPjtno] = useState("");
  const [pjtname, setPjtname] = useState("");


  const [selectedStartDate, setSelectedStartDate] = useState(moment());
  const [selectedEndDate, setSelectedEndDate] = useState(moment().add(20, 'days'));
  

  const getField = async(filed) =>{
    let filedCol;
    let handleState;
         if(filed === "progress") {filedCol="C"; handleState=setProgessField}
    else if(filed === "company" ) {filedCol="D"; handleState=setCompanyField}
    else if(filed === "pl"      ) {filedCol="E"; handleState=setPlField}
    else if(filed === "pic"     ) {filedCol="A"; handleState=setPicField}
    else if(filed === "site"    ) {filedCol="B"; handleState=setLineField}
    
    const queryObject   = { tq: `select ${filedCol} where ${filedCol} is not null offset 1`, sheet: `Prop_Types`};
    const resJson       = await SheetApi.getQueryData(queryObject);
    const progressArray = resJson.table.rows.map(el => el.c[0].v);
    handleState(progressArray);
  }

  const handleSubmit= async(event) => {
    const start = moment(selectedStartDate).format("YYYY-MM-DD");
    const end = moment(selectedEndDate).format("YYYY-MM-DD");
    
    const data = createData(1,progessField[progress],companyField[company],lineField[line],plField[pl],picField[pic],start,end,pjtno,pjtname,content);
    
    await SheetApi.addData(data);
    
    props.handleClose();
    event.preventDefault();
  }

  useEffect(() => { 
    getField("progress");
    getField("company");
    getField("pl");
    getField("pic");
    getField("site");
  }, []);

  const SelectForm = (field,label,data,onChange)=>{
      const id = `select-${label}`;
      return(
        <Grid item lg={2} md={3} sm={3} xl={2} xs={6} container>
        <FormControl className={classes.formControl}>
            <InputLabel id={id}>{label}</InputLabel>
            <Select labelId={id} value={data} onChange={({ target: { value } }) => onChange(value)}>
                {field.map((el,idx) => ( <MenuItem key={idx} value={idx}>{el}</MenuItem>))}
            </Select>
        </FormControl>
        </Grid>
      );
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">아이템 추가</h2>
        <form className={classes.root} noValidate autoComplete="off">
        <Grid container >
            {SelectForm(progessField,"진행도",progress,setProgress)}
            {SelectForm(companyField,"사이트",company ,setCompnay)}
            {SelectForm(plField     ,"PL"   ,pl,setPl)}
            {SelectForm(picField    ,"담당자",pic,setPic)}
            {SelectForm(lineField   ,"라인"  ,line,setLine)}
            <Divider light/>
            <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker className={classes.dateform}
                  margin="normal"
                  id="date-picker-dialog"
                  label="시작일"
                  format="yyyy-MM-dd"
                  value={selectedStartDate}
                  onChange={(date) => {setSelectedStartDate(date);}}
                  KeyboardButtonProps={{'aria-label': 'change date',}}
                  />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker className={classes.dateform}
                  margin="normal"
                  id="date-picker-dialog"
                  label="종료일"
                  format="yyyy-MM-dd"
                  value={selectedEndDate}
                  onChange={(date) => {setSelectedEndDate(date);}}
                  KeyboardButtonProps={{'aria-label': 'change date',}}
                  />
              </MuiPickersUtilsProvider>
            </Grid>
            <Divider light/>
            <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
              <TextField className={classes.textarea} id="standard-helperText" label="PJT No" helperText="Project 번호" variant="standard" value={pjtno} onChange={({ target: { value } }) => setPjtno(value)}/>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
              <TextField className={classes.textarea} id="standard-helperText" label="PJT Name" helperText="Project 이름" variant="standard" value={pjtname} onChange={({ target: { value } }) => setPjtname(value)}/>
            </Grid>
            <Divider light/>
            <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
              <TextareaAutosize className={classes.textarea} aria-label="minimum height" rowsMin={3} rowsMax={5} placeholder="내용 입력" value={content} onChange={({ target: { value } }) => setContent(value)}/>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                onClick={handleSubmit}
              >Upload
              </Button>
            </Grid>
        </Grid>
        </form>
    </div>
  );

  return (
    <Modal
    open={props.open}
    onClose={props.handleClose}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    >
    {body}
    </Modal>
  );
}