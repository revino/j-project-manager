//React
import React from 'react';

//Material UI
import {Radio, RadioGroup, FormControlLabel, FormControl} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import clsx from 'clsx';

//Style
const useStyles = makeStyles(theme => ({
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
  }
}));

function DropBox(props) {

  const classes = useStyles();
  const {list, label, value, onChange, componentKey} = props;

  function StyledRadio(props) {

    return (
      <Radio
        disableRipple
        color="default"
        checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
        icon={<span className={classes.icon} />}
        {...props}
      />
    );
  }

  return (
    <FormControl component="fieldset">
    { list.length > 0 &&
      <RadioGroup value={value} aria-label={label} name={"customized-radios-" + componentKey} onChange={onChange}>
        {list.map( (el,idx) =>{
          return(<FormControlLabel key={idx} disabled={!el.link} value={el.link} control={<StyledRadio />} label={el.label} />)
        })}
      </RadioGroup>
    }
    </FormControl>
  );

}
/*
function PropsAreEqual(prev, next) {
  const compareCon = prev.label === next.label && prev.value === next.value
  return (
    compareCon
  );
}
*/
export default React.memo(DropBox);