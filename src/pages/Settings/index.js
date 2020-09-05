import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { requestSheetInfo, updateSheetInfo } from '../../reducers/modules/sheetInfo'

//Maerial UI
import { Typography, Grid, Button, Switch, TextField, IconButton  } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AddCircleOutline} from '@material-ui/icons';
import { useSnackbar } from 'notistack';

//View
import FormRadio from '../../components/FormRadio';

//hooks
import useSelect from '../../hooks/useSelect';
import useInput from '../../hooks/useInput';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    width: '100%',
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  settingBody:{

    display: 'flex'
    
  },
  settingHeader:{

    minWidth: 70,
    paddingRight: theme.spacing(1),
    
  },
  settingContent:{
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
    display: 'block',
    minHeight: 90,
  },
  sheetInputLabel:{
    margin: theme.spacing(0,2,0,0),
    width: 200
  },
  sheetInputLink:{
    margin: theme.spacing(0,2,0,0),
    width: 300
  },
  sheetInputAdd:{
    margin: theme.spacing(0,2,0,0),
  },
  sheetInputForm:{
    alignItems: 'center'
  }
}));

//    alignItems: 'center',sheetInputAdd

function Settings(props) {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {sheetList, selectSheetId, isListOk, isFetching, updateSheetInfo, requestSheetInfo} = props;

    const [viewSheetList, setViewSheetList] = useState(sheetList);
    
    const [showSnackbar,setSnackbar ]  = useState(false); 
    const settings = useRef({ selectSheetId:selectSheetId, sheetList:sheetList}); 

    const [sheetId,onChnageSheetId  ]  = useSelect(selectSheetId);
    const [addView,onChnageAddView  ]  = useSelect(false,"checkbox");

    const [newLabel,onChnageNewLabel]  = useInput({initialValue:''});
    const [newLink,onChnageNewLink  ]  = useInput({initialValue:''});

    const handleRefreshClick = (e) => { requestSheetInfo();};
    const handleUpdateClick  = (e) => { 
      settings.current.selectSheetId = sheetId;
      settings.current.sheetList     = viewSheetList;
      updateSheetInfo(settings.current); 
      setSnackbar(true)
    };

    const handleSheetListAdd = (e) => {
      if( newLabel !== '' && newLink !== ''){
        const addDate = [...viewSheetList,{label:newLabel,link:newLink}];
        setViewSheetList(addDate);
      }
    }

    useEffect(() =>{
      if(showSnackbar && isFetching === false){
             if( isListOk) {enqueueSnackbar('업데이트 성공', { variant: 'success' } ); setSnackbar(false);}
        else if(!isListOk) {enqueueSnackbar('업데이트 실패', { variant: 'error'   } ); setSnackbar(false);}
      }
    }, [showSnackbar,isListOk, isFetching, enqueueSnackbar])

    useEffect(()=>{
      setViewSheetList(sheetList);
    },[sheetList]);



    return (
      <Grid container spacing={2} className={classes.root}>
        <Grid item lg={1} md ={1} sm={1} xl={1} xs={12} container>
          <Button className={classes.refreshButton} size="large" color = "primary" variant="outlined" onClick={handleRefreshClick}> 갱신</Button>
        </Grid>
        <Grid item lg={1} md ={1} sm={1} xl={1} xs={12} container>
          <Button className={classes.refreshButton} size="large" color = "primary" variant="outlined" onClick={handleUpdateClick}> 적용</Button>
        </Grid>  

        <Grid item lg={12} sm={12} xl={12} xs={12}>
          <div className={classes.settingBody}>
            <div className={classes.settingHeader}>
              <Typography className={classes.detailsHeader }>Sheet ID</Typography>
              <Switch
                checked={addView}
                onChange={onChnageAddView}
                color="primary"
                name="add"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
            <div className={classes.settingContent}>
              <FormRadio componentKey="sheetid" list={viewSheetList} label="sheetid" value={sheetId} onChange={onChnageSheetId} />
              {!!addView && 
                <form className={classes.sheetInputForm} noValidate autoComplete="off">
                  <TextField className={classes.sheetInputLabel} id="addsheetlabel" label="이름" variant="outlined" onChange={onChnageNewLabel}/>
                  <TextField className={classes.sheetInputLink } id="addsheetlink"  label="링크" variant="outlined" onChange={onChnageNewLink }/>
                  <label className={classes.sheetInputAdd} htmlFor="icon-button-file">
                    <IconButton color="primary" aria-label="sheetlist-add" component="span" onClick={handleSheetListAdd}>
                      <AddCircleOutline fontSize='large'/>
                    </IconButton>
                  </label>
                </form>
              }
            </div>
          </div>
        </Grid>

      </Grid>

    );

}

const mapStateToProps = state => ({
  sheetList: state.sheetInfo.sheetList,
  selectSheetId: state.sheetInfo.selectSheetId,
  isListOk: state.sheetInfo.isList,
  isFetching: state.sheetInfo.fetching,
})

const mapDispatchToProps = dispatch => ({
  requestSheetInfo: () => dispatch(requestSheetInfo()),
  updateSheetInfo: (settings) => dispatch(updateSheetInfo(settings))
  
})


export default connect(mapStateToProps, mapDispatchToProps)(Settings)

