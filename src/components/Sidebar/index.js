import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';

import {Dashboard, SpeakerNotes, InsertChart, TableChart, SettingsApplications, Timer } from '@material-ui/icons';

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
      icon: <Dashboard />
    },
    {
      title: '작업시간',
      href: '/worktime',
      icon: <Timer />
    },
    {
      title: '그래프',
      href: '/chart',
      icon: <InsertChart />
    },
    {
      title: '아이템들',
      href: '/table',
      icon: <TableChart />
    },
    {
      title: '메모',
      href: '/checklist',
      icon: <SpeakerNotes />
    },
    {
      title: '설정',
      href: '/settings',
      icon: <SettingsApplications />
    },
    {
      title: '로그아웃',
      href: '/login',
      icon: <SettingsApplications />
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
        <Profile/>
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
          onClose={onClose}
        />
        <UpgradePlan />
      </div>
    </Drawer>
  );
};