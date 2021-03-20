//React
import React from 'react';

//Material UI
import {  } from '@material-ui/core';

//
import { format, startOfMonth, endOfMonth, isSameDay, isSaturday, isSunday, addDays} from "date-fns";
import {RedditTextField} from './style'

function Cells (props) {
  const {currentMonth, selectedDate, workTimes , setWorkTimes, onDateClick, classes } = props;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth  (monthStart);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = monthStart;
  let formattedDate = "";
  let isHoliday = false;

  while (day <= monthEnd) {
    const cloneDay = day;
    formattedDate = format(day, dateFormat);
    isHoliday = isSunday(day) || isSaturday(day)

      for(let i=0;i<2;i++){
        days.push(
        <div
            className={`${classes.cell} ${classes.col} ${
              isSameDay(day, selectedDate) && i === (isHoliday?1:0)? classes.cell_selected : ""
            } ${isSunday(day)? "sunday" : isSaturday(day)? "saturday":""}`}
            key={`${day}_${i}`}
            onClick={() => onDateClick(cloneDay)}
        >
          <div className="number">{(i === (isHoliday?1:0)) && formattedDate}</div>
        </div>
        );
      }


    days.push(
      <div
        className={`${classes.cell} ${classes.col} overtime`}
        key={`${day}_overtime`}
        onClick={() => onDateClick(cloneDay)}
      >
        <RedditTextField
          type='number'
          value={workTimes[formattedDate-1]}
          onChange={setWorkTimes}
          id={formattedDate}
          label="초과 시간"
          variant="outlined"
          className={`${classes.margin}`}
          step={0.5}
        />
      </div>

    );

    rows.push(
      <div className={`${classes.row} ${classes.body_row}`} key={`${day}_rows`}>
        {days}
      </div>
    );
    day = addDays(day, 1);
    days = [];
  }

  return (
    <div className={classes.body}>{rows}</div>
  );
}


export default Cells;