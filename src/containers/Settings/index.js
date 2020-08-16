import React from 'react';

//Maerial
import { makeStyles } from '@material-ui/styles';


//View


const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    }
  }));

export default function Settings() {
    const classes = useStyles();

    return (
      <div className={classes.root}>

      </div>
    );

}