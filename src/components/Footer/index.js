import React from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography variant="body1">
        &copy;{' '}
        <Link
          component="a"
          target="_blank"
        >
          DB
        </Link>
        . 2020
      </Typography>
      <Typography variant="caption">
        A.B.C.D.E.F
      </Typography>
    </div>
  );
};

export default Footer;