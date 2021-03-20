//React
import React, { useCallback } from 'react';

//Material UI
import {useStyles} from './style'

//
import {subMonths, addMonths} from "date-fns";

import Header from "./Header"
import Days from "./Days"
import Cells from "./Cells"

function Calendar(props) {

  const classes = useStyles();

  const { workTimes, setWorkTimes, Month, setMonth } = props;

  const onDateClick = useCallback(
    day => {
      setMonth({...Month,selectedDate: day})
    },
    [Month, setMonth]
  );

  const nextMonth = useCallback(
    e => {
      setMonth({...Month,currentMonth: addMonths(Month.currentMonth, 1)})
    },
    [Month, setMonth]
  );

  const prevMonth = useCallback(
    e => {
      setMonth({...Month,currentMonth: subMonths(Month.currentMonth, 1)})
    },
    [Month, setMonth]
  );


  return (
    <div className={classes.calendar}>
      <Header
        prevMonth={prevMonth} nextMonth={nextMonth}
        currentMonth={Month.currentMonth} classes={classes}
      />
      <Days
        prevMonth={prevMonth} nextMonth={nextMonth}
        currentMonth={Month.currentMonth} classes={classes}
      />
      <Cells
        onDateClick={onDateClick} prevMonth={prevMonth}
        currentMonth={Month.currentMonth} selectedDate={Month.selectedDate} classes={classes}
        workTimes={workTimes} setWorkTimes={setWorkTimes}
      />
    </div>
  );

}

export default Calendar;
