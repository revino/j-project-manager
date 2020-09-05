//React
import React from 'react';

//Material UI
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';

//Style
const useStyles = makeStyles((theme) => ({
  formDate: {
    margin: theme.spacing(1),
    width: '100%',
    float: "left"
  },
  formProvider: {
    width: '100%',

  }
}));



function DatePicker(props) {
  
  const classes = useStyles();

  const {label, value, onChange, componentKey} = props;

  //disabled={category === 1
  return (
    <MuiPickersUtilsProvider className={classes.formProvider} utils={DateFnsUtils}>
      <KeyboardDatePicker className={classes.formDate}
        disableToolbar
        variant="inline"
        format="yy-MM-dd"
        margin="normal"
        id={"date-picker-"+ componentKey}
        label={label}
        value={value}
        onChange={onChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
  </MuiPickersUtilsProvider> 
  );

}

export default React.memo(DatePicker);