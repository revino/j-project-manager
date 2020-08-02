import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Typography, Button, colors } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: colors.grey[50]
  },
  content: {
    padding: theme.spacing(1, 2)
  },
  actions: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    justifyContent: 'center'
  }
}));

export default function UpgradePlan(props) {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.content}>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >테스트 중~
        </Typography>

      </div>

      <div className={classes.actions}>
        <Button
          color="primary"
          component="a"
          href="/"
          variant="contained"
        >
        </Button>
      </div>
    </div>
  );
};
