import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import TableChartIcon from '@material-ui/icons/TableChart';

import Profile     from './Profile';
import SidebarNav  from './SidebarNav';
import UpgradePlan from './UpgradePlan';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));


export default function Sidebar(props) {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: '대시보드',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: '그래프',
      href: '/chart',
      icon: <InsertChartIcon />
    },
    {
      title: '테이블',
      href: '/table',
      icon: <TableChartIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        <UpgradePlan />
      </div>
    </Drawer>
  );
};