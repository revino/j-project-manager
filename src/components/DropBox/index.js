//React
import React from 'react';

//UI

//Material UI
import {FormControl, InputLabel, MenuItem, Select,FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//Style
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100px",
    width: '100%',
    float: "left"
  }
}));



function DropBox(props) {

  const classes = useStyles();

  const {list, label, value, onChange, componentKey, helperText, error} = props;
  //disabled={category === 1
  return (
    <FormControl className={classes.formControl} error={error}>
      <InputLabel shrink id={"select-"+componentKey}>{label}</InputLabel>
      <Select labelId={"select-sort"+componentKey} id="sort-select" value={value} onChange={onChange}>
        { list.length>0 && list.map((el,idx) => (
          <MenuItem key={idx} value={el.value}>{el.label}</MenuItem>
        ))}
      </Select>
      { !!helperText &&
      <FormHelperText>{helperText}</FormHelperText>
      }
    </FormControl>
  );

}

function PropsAreEqual(prev, next) {
  const compareCon = prev.label === next.label && prev.value === next.value && prev.error === next.error
  return (
    compareCon
  );
}

export default React.memo(DropBox,PropsAreEqual);