import React, { useState } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';

const useMainStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  title: {
    textDecoration: 'none',
    color: 'white',
  }
}));

const useMinimalStyles = makeStyles(() => ({
    root: {
      boxShadow: 'none'
    },
    title: {
      textDecoration: 'none',
      color: 'white',
    }
  }));

export default function Topbar(props) {
  const { className, onSidebarOpen, minimal , ...rest } = props;

  const mainclass = useMainStyles();
  const miniclass = useMinimalStyles();
  
  const classes = minimal? miniclass : mainclass;

  const [notifications] = useState([]);


  const handleSignOut = event => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("TOKEN_TYPE");
    localStorage.removeItem("SCOPE");
    localStorage.removeItem("EXPIRE");
  };

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color= {minimal && "primary"}
      position= {minimal && "fixed"}
    >
      <Toolbar>
        <RouterLink className={classes.title} to="/">
          <Typography
            variant="h4"
          >
            작업 관리
          </Typography>
        </RouterLink>
        {   !minimal &&
            <React.Fragment>
            <div className={classes.flexGrow} />
            <Hidden mdDown>                 
              <IconButton
                className={classes.signOutButton}
                onClick={handleSignOut}
                color="inherit"
              >
                <InputIcon />
              </IconButton>
            </Hidden>
            <Hidden lgUp>
              <IconButton
                color="inherit"
                onClick={onSidebarOpen}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            </React.Fragment>
        }
        
      </Toolbar>
    </AppBar>
  );
};
