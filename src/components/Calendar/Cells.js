//React
import React from 'react';

//Material UI
import {  } from '@material-ui/core';

//
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, isSaturday, isSunday} from "date-fns";
import {RedditTextField} from './style'

function Cells (props) {
  const {currentMonth, selectedDate, workTimes , setWorkTimes, onDateClick, classes } = props;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth  (monthStart);
  const startDate  = startOfWeek (monthStart);
  const endDate    = endOfWeek   (monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      days.push(
        <div
          className={`${classes.cell} ${classes.col} ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, selectedDate) ? classes.cell_selected : (isSunday(day)? "sunday" : isSaturday(day)? "saturday" : "")
          }`}
          key={day}
          onClick={() => onDateClick(cloneDay)}
        >
          {isSameMonth(day, monthStart) &&
          <RedditTextField
                type='number'
                value={workTimes[formattedDate-1]}
                onChange={setWorkTimes}
                id={formattedDate}
                label="시간"
                variant="outlined"
                className={` ${isSameDay(day, selectedDate) ? classes.input_selected : classes.margin }`}
                step={0.5}
          />
          }
          <span className="number">{formattedDate}</span>
          <span className="bg">{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className={`${classes.row} ${classes.body_row}`} key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className={classes.body}>{rows}</div>
  );
}


export default Cells;