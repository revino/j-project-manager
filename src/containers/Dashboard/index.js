import React from 'react';

//Maerial
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

//View
import CardSummary from './CardSummary';
import CardChart from './CardChart'
import CardTable from './CardTable'

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    }
  }));

export default function DashBoard() {
    const classes = useStyles();

    return (
      <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={6}  sm={6}  xl={6}  xs={12}> <CardSummary total/> </Grid>
        <Grid item lg={6}  sm={6}  xl={6}  xs={12}> <CardSummary company/> </Grid>
        <Grid item lg={12} md={12} xl={12} xs={12}> <CardChart/> </Grid>
        <Grid item lg={12} md={12} xl={12} xs={12}> <CardTable/> </Grid>
      </Grid>
      </div>
    );

}