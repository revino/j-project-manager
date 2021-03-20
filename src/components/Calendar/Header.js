//React
import React from 'react';

//Material UI
import { IconButton  } from '@material-ui/core';


//
import { format} from "date-fns";

import {ArrowBack, ArrowForward} from '@material-ui/icons';
import clsx from 'clsx';


function Header(props) {

  const dateFormat = "yyyy년 MM월";

  const {prevMonth, nextMonth, currentMonth, classes } = props;

  return (
    <div className={clsx(classes.calendar_header, classes.row)}>
      <div className={clsx(classes.col,classes.col_start)}>
        <IconButton component="span" onClick={prevMonth}>
          <ArrowBack fontSize='small'/>
        </IconButton>
      </div>

      <div className={`${classes.col} ${classes.col_center}`}>
        <span>
          {format(currentMonth, dateFormat)}
        </span>
      </div>

      <div className={`${classes.col} ${classes.col_end}`} onClick={nextMonth}>
          <IconButton component="span" onClick={nextMonth}>
            <ArrowForward fontSize='small'/>
          </IconButton>
      </div>
    </div>
  );
}


export default Header;