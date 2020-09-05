//React
import React, {useEffect} from 'react';

//Material UI
import {Avatar,Card,CardContent,Grid,Typography,colors,makeStyles, List, ListItem, ListItemAvatar, ListItemText} from '@material-ui/core';
import { deepOrange, teal, indigo, brown, blueGrey } from '@material-ui/core/colors';

import useApiErrorSnackbar from '../../hooks/useApiErrorSnackbar'

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%'
    },
    avatar: {
      backgroundColor: colors.red[600],
      height: 56,
      width: 56
    },
    differenceIcon: {
      color: colors.red[900]
    },
    differenceValue: {
      color: colors.red[900],
      marginRight: theme.spacing(1)
    },

    orange: {
        color: theme.palette.getContrastText(deepOrange[700]),
        backgroundColor: deepOrange[700],
      },
    teal: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
      },
    indigo: {
        color: theme.palette.getContrastText(indigo[500]),
        backgroundColor: indigo[500],
    },
    brown:{
        color: theme.palette.getContrastText(brown[500]),
        backgroundColor: brown[500],
    },
    blueGrey:{
      color: theme.palette.getContrastText(blueGrey[500]),
      backgroundColor: blueGrey[500],
    },
  }));



function CardSummary(props) {

  const classes = useStyles();
  const handelSnackbar = useApiErrorSnackbar();
  const avatarColor =[classes.indigo,classes.orange, classes.blueGrey, classes.teal ,classes.brown];
  
  const {data, title, error} = props;

  
  //Error
  useEffect(() =>{ handelSnackbar(error);}, [handelSnackbar, error]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <List dense={true}>
              {(!!data) && data.map( (el,idx) => 
                <ListItem key={idx}>
                  <ListItemAvatar>
                    <Avatar className={avatarColor[idx]}>
                      {el.value}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${el.name}`}/>
                </ListItem>   
              )}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

}

export default CardSummary;