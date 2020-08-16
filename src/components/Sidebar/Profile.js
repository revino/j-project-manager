import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';

import {getUserPicture, getUserName} from '../../auth'



const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 120,
    height: 120
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

export default function Profile(props) {

  const { className,user , ...rest } = props;

  const classes = useStyles();
  /*
    const user = {
      avatar: process.env.PUBLIC_URL + '/favicon.ico',
    };
  */

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      {<Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={getUserPicture()}
        to="/settings"
      />}
      
      <Typography
        className={classes.name}
        variant="h4"
      >
        {getUserName()}
      </Typography>
    </div>
  );
};
