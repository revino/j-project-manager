import React, {useState} from 'react';
import { connect } from 'react-redux';

//Material UI
import 'date-fns';
import {Grid, TextField, Button, makeStyles, Typography} from '@material-ui/core';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import useInput from '../../hooks/useInput'

import { tableAdd } from './Table/query';

const useStyles = makeStyles((theme) => ({
  section1: {
    margin: theme.spacing(1, 0),
  },
  section2: {
    margin: theme.spacing(1, 0),
  },
  section3: {
    margin: theme.spacing(0.5, 0),
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


function TableAdd(props) {

  const classes = useStyles();
  
  //input
  const [tableName, onChangeTableName, isTableNameValid] = useInput({initialValue:""});
  const [tableId, onChangetableId, isTableIdValid] = useInput({initialValue:""});

  //error
  const [selectError,setSelectError] = useState({progress:false,company:false,pl:false,pic:false,line:false,pjtno:false,pjtname:false})
  const [formError,setformError] = useState(false);

  const checkForm = ()=>{
    const selectState = {table_name:tableName ==='', table_id:tableId===''};
    const selectError = Object.values(selectState).some((el)=> el===true);

    if(selectError) {
      setSelectError({...selectState});
      setformError(true);
    }

    return selectError;
  }
  const handleSubmit= async (event) => {
    if(checkForm()) return;

    const inputValue = {table_name:tableName, table_id:tableId}
    const item = {...inputValue}

    await tableAdd(item);
    props.handleClose();
    event.preventDefault();
    //history.push('/')
  }
  
  const body = (
    <React.Fragment>
      <h2 id="simple-modal-title">테이블 추가</h2>

        <Grid container className={classes.section3}>
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
            <TextField error={selectError.table_name || !isTableNameValid} className={classes.textarea} id="table name" label="테이블 이름" helperText="테이블 이름" variant="standard" value={tableName} onChange={onChangeTableName}/>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container> 
            <TextField error={selectError.table_id || !isTableIdValid} className={classes.textarea} id="table id" label="테이블 아이디" helperText="테이블 아이디" variant="standard" value={tableId} onChange={onChangetableId}/>
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
          {!!formError && <Typography>폼 에러</Typography>}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
            onClick={handleSubmit}

          >추가
          </Button>
        </Grid>

    </React.Fragment>
  );

  return (body);
}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(TableAdd)