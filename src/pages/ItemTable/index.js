import React, {useState, useEffect, useCallback} from 'react';

//Material
import { Grid,FormLabel,FormControl,FormGroup,Checkbox,Button,FormControlLabel, LinearProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//View
import ItemAddModal from '../../components/ItemAddModal'
import Table from '../../components/Table'
import DetailContent from './DetailContent'

//API
import {storage} from '../../firebase'

//hook
import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';
import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';
import useWrapSnackBar from '../../hooks/useWrapSnackbar';

import { headQuery, tableQuery, tableUpdate, tableDelete, tableAdd} from './query';

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

//data parsing
const headParsing = (headData) =>{
  let result = {};
  if(!!headData){
    headData.docs.forEach( doc=>{
      const data = doc.data();
      if(doc.id === 'progress' || doc.id === 'company' ) result[doc.id]=Object.keys(data.fieldList);
      else result[doc.id]=data.list;
    })
  }
  else result = null;
  return result;
}

const checkBoxDefault  = { cb1: true, cb2: true, cb3: true, cb4: true, cb5: true, cb6: true, cb7: true};
const checkBoxDefault2 = { cb1: false, cb2: false, cb3: false, cb4: false, cb5: false, cb6: false, cb7: false}


function ItemTable(props) {
  const classes = useStyles();

  //State
  const [fieldData,setFieldData]   = useState(null);

  const [cbState, setCbState]      = useState(checkBoxDefault2);
  const [modalOpen, setModalOpen]  = useState(false);

  const {data:headData}            = useFirebaseOnceCollection(headQuery);
  const {data:tableData, setRef}   = useFirebaseListenCollection(tableQuery.orderBy("created_at", "desc"));
  const [WrapSnackBar]             = useWrapSnackBar();

  const checkBoxerror = Object.values(cbState).filter((v) => v).length < 1;
  const ModalError    = !fieldData;//? Object.keys(fieldData).filter(v => v == null || v === []).length > 0: false

  useEffect(()=>{
    const result = headParsing(headData)
    if(!!result) setFieldData(result);
  },[headData])

  //table data handle
  const insertTableData = useCallback(async(insertItem)=>{
    const addfunc = async() => await tableAdd(tableQuery,insertItem);
    WrapSnackBar({event:addfunc,successMessage:'추가 성공',failMessage:'추가 실패 다시 시도 해주세요',redirectUrl:'/login'})
  },[WrapSnackBar]);

  const updateTableData = useCallback(async(newData, oldData) =>{
    const updatefunc = async() => await tableUpdate(tableQuery.doc(newData.id),newData,oldData)
    WrapSnackBar({event:updatefunc,successMessage:'업데이트 성공',failMessage:'업데이트 실패 다시 시도 해주세요',redirectUrl:'/login'})
  },[WrapSnackBar]);

  const deleteTableData = useCallback(async(oldData) =>{
    const deletefunc = async() => await tableDelete(tableQuery.doc(oldData.id),oldData);
    WrapSnackBar({event:deletefunc,successMessage:'삭제 성공',failMessage:'삭제 실패 다시 시도 해주세요',redirectUrl:'/login'})
  },[WrapSnackBar]);

  //image data handle
  const uploadImage = useCallback( async({path,files}) =>{
    const response = await storage.ref().child(path).put(files);
    if(response.state === 'success') return true;
    else                             return false;
  },[])

  const deleteImage = useCallback( async({path}) =>{
    await storage.refFromURL(path).delete();
    return true;
  },[])
  
  const getImgUrl = useCallback(async(imageObj) => {
    const imgUrl = await storage.refFromURL(imageObj.src).getDownloadURL()
    return {...imageObj, src:imgUrl};
  },[]);

  //handle
  const handleCheckBoxChange = (e) => { 
    const checkbox = { ...cbState, [e.target.name]: e.target.checked }
    setCbState(checkbox); 
    const valid = Object.values(checkbox).filter((v) => v).length < 1;
    if(valid) return;
    const checkBoxConArray = !!fieldData ? fieldData.progress.filter((el,idx) => Object.values(checkbox)[idx] === true):[''];
    const Query = tableQuery.where('progress','in',checkBoxConArray);

    setRef(Query);
  }
  const handleCheckDisabled = () => {
    if(cbState === checkBoxDefault) setCbState(checkBoxDefault2); 
    else setCbState(checkBoxDefault); 
    setRef(tableQuery);
  }
  
  const handleAddModal = () => { setModalOpen(true); }
  const handleClose = () => { setModalOpen(false); }

  const detailContent = (rowData) =>{
    return (<DetailContent onRowUpdate={updateTableData} getImgUrl={getImgUrl} deleteImage={deleteImage} uploadImage={uploadImage} rowData={rowData}/>)
  }

  return (
  <div className={classes.root}>
    { modalOpen && <ItemAddModal open={modalOpen} handleClose={handleClose} fieldData={fieldData} insertTableData={insertTableData}/>}

    <Grid container spacing={2}>
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center">
        <Button className={classes.refreshButton}
          color = "primary"
          variant="outlined"
          onClick={handleAddModal}
          disabled={ModalError}
        > 추가
        </Button>
      </Grid>
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center">
        <Button className={classes.refreshButton}
          color = "inherit"
          variant="outlined"
          onClick={handleCheckDisabled}
          disabled={ModalError}
        > 전체선택
        </Button>
      </Grid>

      <Grid item lg={10} md={12} sm={12} xl={10} xs={12} container>
        <FormControl required error={checkBoxerror} component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">1개 이상 선택</FormLabel>
          <FormGroup className={classes.formGroup}>
            {!!fieldData && fieldData.progress.map((el,idx) => (
              <FormControlLabel
                key={`cb${idx+1}`} control={<Checkbox checked={cbState[`cb${idx+1}`]} onChange={handleCheckBoxChange} name={`cb${idx+1}`} color="primary"/>} label={el}
              />
            ))} 
          </FormGroup>
        </FormControl>  
      </Grid>
  
      <Grid item lg={12} sm={12} xl={12} xs={12}>
        {!tableData && <LinearProgress />}
        {
        <Table 
          data={!!tableData?tableData.docs.map(doc=>doc.data()):[]} fieldData={fieldData} detailContent={detailContent}
          onRowUpdate={updateTableData} onRowDelete={deleteTableData}/>
        }
      </Grid>
    </Grid>
  </div>
  );
}

export default ItemTable