import React from 'react';

//Maerial
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

//View
import CardStatus from './CardStatus';
import CardCompany from './CardCompany';
import CardChart from './CardChart'
import CardTable from './CardTable'


const defaultSort = "F";
const defaultYAxis = 2;
const defaultEndTime = 7;

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    }
  }));
export default function DashBoard(props) {
    const classes = useStyles();
    return (
      <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={6}  sm={6}  xl={6}  xs={12}> <CardStatus/> </Grid>
        <Grid item lg={6}  sm={6}  xl={6}  xs={12}> <CardCompany/> </Grid>
        <Grid item lg={12} sm={12} xl={12} xs={12}> <CardTable/> </Grid>
        <Grid item lg={12} sm={12} xl={12} xs={12}> <CardChart endTime={defaultEndTime} yAxis={defaultYAxis} sort={defaultSort}/> </Grid>
      </Grid>
      </div>
    );
}
