import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';

import { connect } from 'react-redux';

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

function Profile(props) {

  const { className,user , ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      {<Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={ !!user?user.photo:''}
        to="/settings"
      />}
      
      <Typography
        className={classes.name}
        variant="h4"
      >
        {!!user?user.name:''}
      </Typography>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
