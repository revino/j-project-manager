import React, {useState, useEffect, useCallback} from 'react';
import { connect } from 'react-redux';

//Material
import { Grid,FormLabel,FormControl,FormGroup,Checkbox,Button,FormControlLabel, LinearProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//View
import ItemAddModal from '../../components/ItemAddModal'
import Table from '../../components/Table'
import DetailContent from './DetailContent'

//
import moment from 'moment';

//API
import {storage, db} from '../../firebase'
import useFirebaseOnceCollection from '../../hooks/useFirebaseOnceCollection';
import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';

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
      result[doc.id]=data.list;
    })
  }
  else result = null;
  return result;
}

const tableParsing = (tableData) =>{
  const result = !!tableData? tableData.docs.map((doc,idx)=>{
    const docData = doc.data();
    const startdate = moment.utc(docData.start_date.seconds * 1000).format("YYYY-MM-DD")
    const enddate  = moment.utc(docData.end_date.seconds* 1000).format("YYYY-MM-DD")
    return {...docData,start_date: startdate, end_date:enddate, id:doc.id}
  }) : [];
  return result;
}

const headQuery       = db.collection(`tables`).doc('HYNIX').collection(`props`);
const tableQuery      = db.collection(`tables`).doc('HYNIX').collection(`Items`);
const checkBoxDefault = { cb1: true, cb2: true, cb3: true, cb4: true, cb5: true, cb6: true, cb7: true};

function ItemTable(props) {
  const classes = useStyles();

  //State
  const [fieldData,setFieldData]   = useState(null);
  const [sheetData,setSheetData]   = useState([]);
  const [cbState, setCbState]      = useState(checkBoxDefault);
  const [modalOpen, setModalOpen]  = useState(false);

  const {data:headData}            = useFirebaseOnceCollection(headQuery);
  const {data:tableData, setRef}   = useFirebaseListenCollection(tableQuery);

  const checkBoxerror = Object.values(cbState).filter((v) => v).length < 1;
  const ModalError    = !fieldData;//? Object.keys(fieldData).filter(v => v == null || v === []).length > 0: false;

  useEffect(()=>{
    const result = headParsing(headData)
    if(!!result) setFieldData(result);
  },[headData])

  useEffect(()=>{
    const result = tableParsing(tableData);
    if(!!result ) setSheetData(result);
  },[tableData])

  //table data handle
  const updateTableData = useCallback(async(newData, oldData) =>{   
    const memosRef = tableQuery.doc(newData.id)
    await memosRef.update(newData);
  },[]);

  const deleteTableData = useCallback(async(oldData) =>{
    const memosRef = tableQuery.doc(oldData.id)
    await memosRef.delete();
  },[]);

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
    const checkBoxConArray = !!fieldData ? fieldData.progress.filter((el,idx) => Object.values(checkbox)[idx] === true):[''];
    const Query = tableQuery.where('progress','in',checkBoxConArray);
    setCbState(checkbox); 
    setRef(Query);
  }
  const handleAddModal       = ()      => { setModalOpen(true); }
  const handleClose          = ()      => { setModalOpen(false); }

  const detailContent = (rowData) =>{
    return (<DetailContent onRowUpdate={updateTableData} getImgUrl={getImgUrl} deleteImage={deleteImage} uploadImage={uploadImage} rowData={rowData}/>)
  }

  return (
  <div className={classes.root}>
    { modalOpen && <ItemAddModal open={modalOpen} handleClose={handleClose} fieldData={fieldData}/>}

    <Grid container spacing={2}>
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center">
        <Button className={classes.refreshButton}
          color = "inherit"
          variant="outlined"
          onClick={handleAddModal}
          disabled={ModalError}
        > 추가
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
          data={sheetData} fieldData={fieldData} detailContent={detailContent}
          onRowUpdate={updateTableData} onRowDelete={deleteTableData}/>
        }
      </Grid>
    </Grid>
  </div>
  );


}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId,
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(ItemTable)