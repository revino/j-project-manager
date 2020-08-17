import React, {useState, useCallback, useEffect} from 'react';
import browserHistory from '../../history'

//Material UI
import 'date-fns';
import {Grid, FormControl, InputLabel, MenuItem, Select, TextareaAutosize, 
Modal, Divider, TextField, Button, makeStyles, FormControlLabel, Checkbox, CircularProgress, FormHelperText  } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

//UI
import { useSnackbar } from 'notistack';

//API
import SheetApi from '../../api/SpreadSheetApi';
import {getUserName} from '../../auth'
import {db} from '../../api/firebase'
import {getUid} from '../../auth'

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
    width: "100%",
    maxWidth: "100%"

  },
  textarea: {
    margin: theme.spacing(1),
    width: "97%"
  },
  button: {
    margin: theme.spacing(1),
    width: "100%"
  },
  checkbox: {
    margin: theme.spacing(0.1),
  },

}));

function createData(id, pjtname) {
  return {id, pjtname};
}

function createMemo(uid, owner, updateDate, createdDate, title, content, linkId) {
  
  if(!!linkId) return {uid, owner, updateDate, createdDate, title, content, linkId};
  else         return {uid, owner, updateDate, createdDate, title, content};
}

export default function MemoAddModal(props) {

  const {enqueueSnackbar} = useSnackbar();

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const {onUpdate} = props;

  //data
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [item, setItem] = useState(1);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLinkItme, setLinkItem] = useState(false);

  //Request Data
  const getTableData = useCallback(async() =>{
    try{
      setLoading(true);

      const username    = getUserName();
      const ConStr      = `(F='${username}') and (B !='완료')`;
      const queryObject = { tq: `select A, J, B, F where  (A is not null) and (${ConStr})`, sheet: `Item_Tables`}
      
      //API REQUEST
      const response     = await SheetApi.getQueryData(queryObject);

      if(response === "403") {
        browserHistory.push("/settings");
        enqueueSnackbar('권한이 없습니다.', { variant: 'error' } );
        throw new Error(response);
      }
      else if(response === "401") {
        enqueueSnackbar('인증이 실패하였습니다.', { variant: 'error' } );
        browserHistory.push("/login");
        throw new Error(response)
      }

      //make Array
      const itemArray = response.table.rows.map(el => new createData( el.c[0].v,el.c[1].v))

      setItemList(itemArray);
      setItem(itemArray[0].id);
      setLoading(false);
    }catch(err){
      console.log(err);
    }
  }, [enqueueSnackbar])

  const addMemo = async() =>{
    try{
      const memoData = await createMemo(getUid(), getUserName(), moment().format(), moment().format(), title, content, isLinkItme?item:null);
      await db.collection(`users`).doc(getUid()).collection(`memos`).add(memoData);
      onUpdate();
      enqueueSnackbar('추가 성공', { variant: 'success' } );
    }catch(err){
      enqueueSnackbar('추가 실패 다시 시도 해주세요', { variant: 'error' } );
      console.log(err);
    }
  }

  const handleSubmit = async(event) => {
      await addMemo();
      props.handleClose();
  }

  const handleLinkChecked = (e) => { setLinkItem(e.target.checked);};

  const SelectForm = (field,label,data,onChange)=>{
      const id = `select-${label}`;
      return(
        <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
        <FormControl className={classes.formControl} disabled={loading}>
            <InputLabel id={id}>{label}</InputLabel>
            <Select labelId={id} value={data} onChange={({ target: { value } }) => onChange(value)}>
                {field.map((el,idx) => ( <MenuItem key={idx+1} value={el.id}> {el.id} : {el.pjtname}</MenuItem>))}
            </Select>
            <FormHelperText>담당자인 아이템이 표시됩니다.</FormHelperText>
        </FormControl>
        </Grid>
      );
  }

  useEffect(() =>{
    getTableData()
  }, [getTableData])

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">메모 입력</h2>
        <form className={classes.root} noValidate autoComplete="off">

        <Divider light/>
        <Grid container >
          {loading? <CircularProgress />:
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
            <FormControlLabel className={classes.checkbox}
              control={
                <Checkbox
                  checked={isLinkItme}
                  onChange={handleLinkChecked}
                  name="checkedB"
                  color="primary"
                />
              }
              label="링크 사용"
              disabled={loading}
            />
          </Grid>
          }
          {isLinkItme && SelectForm(itemList,"아이템" ,item,setItem)}
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
            <TextField className={classes.textarea} id="standard-helperText" label="제목" variant="standard" value={title} onChange={({ target: { value } }) => setTitle(value)}/>
          </Grid>
          <Divider light/>
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
            <TextareaAutosize className={classes.textarea} aria-label="minimum height" rowsMin={30} rowsMax={50} placeholder="내용 입력" value={content} onChange={({ target: { value } }) => setContent(value)}/>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<CloudUploadIcon />}
              onClick={handleSubmit}
              disabled={loading}
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