import React from 'react';

//Material Icons

//Material
import {makeStyles} from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';


//View
import MemoItem from './MemoItem'


//Style
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));


function MemoList(props) {
 const {data} = props;
 const classes = useStyles();
  
  return (
    <div className={classes.root}>
      {data.map( (el,idx) => <MemoItem item={el} idx={idx} key={idx} onUpdate={props.onUpdate}/>)}
    </div>
  )
}

export default withWidth()(MemoList);