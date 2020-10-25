import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

//Material
import { makeStyles } from '@material-ui/styles';
import { Button, Grid, Typography } from '@material-ui/core';

import { headAdd,headDelete,tableDelete,headQuery} from './query';
import useFirebaseOnceCollection from '../../../hooks/useFirebaseOnceCollection';

import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import { Delete } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';


//Style
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
  },
  tagifyOutside:{
    order: -1,
    flex: '100%',
    border: 0,
    marginBottom: '1em',
    transition: '.1s',
    '& > span':{
      order: -1,
      flex: '100%',
      border: '1px solid var(--tags-border-color)',
      marginBottom: '1em',
      transition: '.1s'
    }
  }
}));

const tagSettings = {
  maxTags:10,
  dropdown:{
    position: 'input',
    enabled:0
  }
}

//data parsing
const headParsing = (headData) =>{
  let result;
  if(!!headData){
    result = headData.docs.map((doc) => {
      const ret = {}
      ret.name = doc.data().name;
      ret.list = Object.keys(doc.data().list);
      return ret;
    })
  }
  else result = null;
  return result;
}

function TableUpdate(props) {
  const classes = useStyles();
  const history = useHistory()

  const {urlSheetId} = props.match.params;

  const [fieldData,setFieldData]   = useState(null);

  const {data:headData} = useFirebaseOnceCollection(headQuery(urlSheetId));

  const onTagAdd = (e)=>{
    const value = e.detail.data.value;
    const fieldId = e.detail.tagify.settings.placeholder;
    headAdd(urlSheetId,fieldId,value)
  }
  const onTagDelete = (e) =>{
    const value = e.detail.data.value;
    const fieldId = e.detail.tagify.settings.placeholder;
    headDelete(urlSheetId,fieldId,value)
  }

  const handleTableRemove = () =>{
    tableDelete(urlSheetId);
    history.push('/settings');
  }

  useEffect(()=>{
    const result = headParsing(headData)
    if(!!result) setFieldData(result);
  },[headData])

  return (
  <div className={classes.root}>
    <Grid container className={classes.section3}>
      <Button variant="outlined" size="large" color="secondary" onClick={handleTableRemove} startIcon={<Delete />} >삭제</Button>
      {!!fieldData &&
      fieldData.map((doc,id)=>{
        return(
          <React.Fragment key={id}>
            <Grid  item lg={12} md={12} sm={12} xl={12} xs={12} container>
              <Typography gutterBottom variant="h5" component="h2">
              필드 : {doc.name}
              </Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
            <Tags
              placeholder={doc.name}
              className={classes.tagifyOutside}
              name={doc.name}    
              settings={tagSettings}  // tagify settings object
              value={doc.list}  // dynamic props such as "loading", "showDropdown:'abc'", "value"
              onAdd={onTagAdd}
              onRemove={onTagDelete}
            />
            </Grid>
          </React.Fragment>
        )
      })}
    </Grid>
  </div>
  );
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(TableUpdate)
