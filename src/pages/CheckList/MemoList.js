import React from 'react';

//Material Icons

//Material
import {makeStyles, LinearProgress} from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';

//View
import MemoItem from './MemoItem'


//Style
const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5, 0),
    width: '100%',
  }
}));


function MemoList(props) {
 const {data} = props;
 const classes = useStyles();
  return (
    <div className={classes.root}>
      { !data && <LinearProgress />}
      { !!data && data.length>0 ? data.map( (el,idx) => <MemoItem item={el} idx={idx} key={idx} onUpdate={props.onUpdate}/>):
        [<MemoItem key='date' skeleton={true}/>,<MemoItem key='Head' skeleton={true}/>]
      }
    </div>
  )
}
export default withWidth()(MemoList);