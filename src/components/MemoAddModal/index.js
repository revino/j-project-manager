import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';

//Material UI
import 'date-fns';
import {Grid, TextareaAutosize, 
Modal, Divider, TextField, Button, makeStyles, FormControlLabel, Checkbox } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

//UI
import { useSnackbar } from 'notistack';

//API
import {db} from '../../firebase'
import {getUid} from '../../firebase/auth'

import DropBox from '../DropBox'

import useSelect from '../../hooks/useSelect'
import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';


import { getMyWorkListQuery } from './query';

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

function MemoAddModal(props) {
  const {onUpdate, userName, selectSheetId} = props;

  const {enqueueSnackbar} = useSnackbar();

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  //data
  const [content, setContent]         = useState("");
  const [title, setTitle]             = useState("");
  const [useLinkItme , setUseLinkItem ] = useState(false);
  const [useShareItem, setUseShareItem] = useState(false);

  const {data} = useFirebaseOnceCollection(getMyWorkListQuery(selectSheetId,userName));

  const [linkItem, onChangelinkItem]  = useSelect('');

  useEffect(()=>{
    if(!!data){
      console.log(data.docs);
    }

  },[data])

  const addMemo = async() =>{
    try{
      const memoData = await createMemo(getUid(), userName, moment().format(), moment().format(), title, content, useLinkItme?linkItem:null);
      if(!useShareItem){
        await db.collection(`users`).doc(getUid()).collection(`memos`).add(memoData);
      }
      else{
        await db.collection(`tables`).doc(selectSheetId).collection(`memos`).add(memoData);
      }
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

  const handleLinkChecked  = (e) => { setUseLinkItem(e.target.checked);};
  const handleShareChecked = (e) => { setUseShareItem(e.target.checked);};

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
              disabled={!data}
            />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
            <FormControlLabel className={classes.checkbox}
              control={
                <Checkbox
                  checked={useShareItem}
                  onChange={handleShareChecked}
                  name="checkedShare"
                  color="primary"
                />
              }
              label="공유 사용"
              disabled={!data}
            />
          </Grid>

          { useLinkItme &&
            <DropBox componentKey="itemlist" list={!!data?data.docs.map(doc=>doc.data()):[]}  label={"아이템"} value={linkItem} onChange={onChangelinkItem} helperText={"담당자인 아이템이 표시됩니다."}/>
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
              disabled={!data}
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