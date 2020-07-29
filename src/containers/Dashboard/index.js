import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(4)
    }
  }));

export default function DashBoard() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            DashBoard
        </div>

    );

}