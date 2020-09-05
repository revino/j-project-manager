import React, {useState, useEffect, useCallback} from 'react';
import { connect } from 'react-redux';

//Material
import { Grid,FormLabel,FormControl,FormGroup,Checkbox,Button,FormControlLabel, LinearProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//View
import ItemAddModal from '../../components/ItemAddModal'
import Table from '../../components/Table'

//API
import useAsyncSheetData from '../../hooks/useAsyncSheetData'

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

const checkBoxDefault = { cb1: true, cb2: true, cb3: true, cb4: false, cb5: true, cb6: true, cb7: false};

const parseTable = (data) =>{
  const result  = data.table.rows.map(el => {
      return {id : el.c[0].v, progress : el.c[1].v, company : el.c[2].v,line : el.c[3].v,pl : el.c[4].v,pic : el.c[5].v,start : el.c[6].f,end : el.c[7].f,pjtno : el.c[8].v,pjtname : el.c[9].v,content : el.c[10].v}
  });
  return result;
};

function ItemTable(props) {
  const classes = useStyles();
  const {selectSheetId, fieldData} = props;
  
  //State
  const [cbState, setCbState] = useState(checkBoxDefault);
  const [modalOpen, setModalOpen] = useState(false);
  const {sheetData,loadSheetData, isLoading, updateSheetData, deleteSheetData} = useAsyncSheetData({selectSheetId, parserFn:parseTable});

  //error con
  const checkBoxerror = Object.values(cbState).filter((v) => v).length < 1;
  const ModalError    = Object.keys(fieldData).filter(v => v == null || v === []).length > 0;

  const getTableData = useCallback((cbState) =>{
    const cbArray          = Object.values(cbState);
    const checkBoxConArray = fieldData.progress.filter((el,idx) => cbArray[idx] === true).map(el => `B='${el}'`);
    const checkBoxConStr   = checkBoxConArray.join(" or ");
    const queryObject      = {tq:`select * where  (A is not null) and (${checkBoxConStr}) order by C`, sheet: `Item_Tables`};
    loadSheetData({...queryObject});
  },[fieldData,loadSheetData]);

  const updateTableData = useCallback(async(newData, oldData) =>{
    updateSheetData(newData, oldData);
  },[updateSheetData]);

  const deleteTableData = useCallback(async(oldData) =>{
    deleteSheetData(oldData);
  },[deleteSheetData]);

  //handle
  const handleCheckBoxChange = (event) => { setCbState({ ...cbState, [event.target.name]: event.target.checked }); }
  const handleAddModal       = ()      => { setModalOpen(true); }
  const handleClose          = ()      => { setModalOpen(false); }
  const handleRefreshClick   = ()      => { getTableData(cbState)}

  useEffect(()=>{
    getTableData(checkBoxDefault);
  },[getTableData])

  return (
  <div className={classes.root}>
    { modalOpen && <ItemAddModal open={modalOpen} handleClose={handleClose} fieldData={fieldData}/>}

    <Grid container spacing={2}>
      <Grid item lg={1} md={2} sm={2} xl={1} xs={3} container justify="center" >
        <Button className={classes.refreshButton}
            color = "primary"
            variant="outlined"
            onClick={handleRefreshClick}
            disabled={checkBoxerror}
          > 갱신
        </Button>
      </Grid>
      
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
            {fieldData.progress.map((el,idx) => (
              <FormControlLabel
                key={`cb${idx+1}`} control={<Checkbox checked={cbState[`cb${idx+1}`]} onChange={handleCheckBoxChange} name={`cb${idx+1}`} color="primary"/>} label={el}
              />
            ))} 
          </FormGroup>
        </FormControl>  
      </Grid>
  
      <Grid item lg={12} sm={12} xl={12} xs={12}>
        {isLoading && <LinearProgress />}
        <Table data={sheetData} onRowUpdate={updateTableData} onRowDelete={deleteTableData} fieldData={fieldData}/>
      </Grid>
    </Grid>
  </div>
  );


}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId,
  fieldData:state.sheetInfo.fieldData
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(ItemTable)