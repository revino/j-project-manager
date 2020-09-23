import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar,  Hidden, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import InputIcon from '@material-ui/icons/Input';

import {auth} from '../../firebase'
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  const mainclass = useMainStyles();
  const miniclass = useMinimalStyles();
  
  const classes = minimal? miniclass : mainclass;

  const handleSignOut = event => {
    auth.signOut().then(() =>{
      history.push('/login');
    }).catch((e)=>{
      console.log(e);
    });
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
                <MenuIcon/>
              </IconButton>
            </Hidden>
            </React.Fragment>
        }
        
      </Toolbar>
    </AppBar>
  );
};
