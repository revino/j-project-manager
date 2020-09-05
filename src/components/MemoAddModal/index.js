import React, {useState, useCallback, useEffect} from 'react';
import { connect } from 'react-redux';

//Material UI
import 'date-fns';
import {Grid, TextareaAutosize, 
Modal, Divider, TextField, Button, makeStyles, FormControlLabel, Checkbox } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

//UI
import { useSnackbar } from 'notistack';

//API
import useAsyncSheetData from '../../hooks/useAsyncSheetData'
import {db} from '../../api/firebase'
import {getUid} from '../../auth'

import DropBox from '../DropBox'

import useSelect from '../../hooks/useSelect'

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

function createMemo(uid, owner, updateDate, createdDate, title, content, linkId) {
  
  if(!!linkId) return {uid, owner, updateDate, createdDate, title, content, linkId};
  else         return {uid, owner, updateDate, createdDate, title, content};
}

const parseTable = (data) =>(
  data.table.rows.map(el => ({value : el.c[0].v, label: `${el.c[0].v} : ${el.c[1].v}`}))
);


function MemoAddModal(props) {
  const {selectSheetId} = props;

  const {enqueueSnackbar} = useSnackbar();

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const {onUpdate, userName} = props;

  //data
  const [content, setContent]         = useState("");
  const [title, setTitle]             = useState("");
  const [useLinkItme, setUseLinkItem] = useState(false);

  const { sheetData:linkItemList, loadSheetData:loadLinkItemList, isLoading} = useAsyncSheetData({
    initialData:[],
    selectSheetId, 
    parserFn:parseTable
  });

  const [linkItem, onChangelinkItem]  = useSelect('');

  //Request Data
  const getTableData = useCallback(() =>{

    const ConStr      = `(F='${userName}') and (B !='완료')`;
    const queryObject = {tq: `select A, J, B, F where  (A is not null) and (${ConStr})`, sheet: `Item_Tables`};
    loadLinkItemList({...queryObject});
  },[loadLinkItemList,userName]);

  const addMemo = async() =>{
    try{
      const memoData = await createMemo(getUid(), userName, moment().format(), moment().format(), title, content, useLinkItme?linkItem:null);
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

  const handleLinkChecked = (e) => { setUseLinkItem(e.target.checked);};

  useEffect(() =>{
    getTableData()
  }, [getTableData])

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">메모 입력</h2>
        <form className={classes.root} noValidate autoComplete="off">

        <Divider light/>
        <Grid container >

          <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
            <FormControlLabel className={classes.checkbox}
              control={
                <Checkbox
                  checked={useLinkItme}
                  onChange={handleLinkChecked}
                  name="checkedB"
                  color="primary"
                />
              }
              label="링크 사용"
              disabled={isLoading}
            />
          </Grid>

          { useLinkItme && 
            <DropBox componentKey="itemlist" list={linkItemList}  label={"아이템"} value={linkItem} onChange={onChangelinkItem} helperText={"담당자인 아이템이 표시됩니다."}/>
          }
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
              disabled={isLoading}
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

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId,
  userName: state.auth.user.name
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(MemoAddModal)