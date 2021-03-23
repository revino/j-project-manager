//React
import React from 'react';

//Material UI
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

//
import { format, startOfMonth, endOfMonth, isSameDay, isSaturday, isSunday, addDays} from "date-fns";
import {RedditTextField} from './style'

function Cells (props) {
  const {classes, currentMonth, selectedDate, workTimes , setWorkTimes, onDateClick, setDriects, directList } = props;

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
          label="시간"
          variant="outlined"
          className={`${classes.margin} ${classes.OverTimeInput}`}
          step={0.5}
        />
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="direct-checkin-select-outlined-label">출근</InputLabel>
          <Select
            labelId="direct-checkin"
            id={formattedDate}
            value={directList[formattedDate-1].checkin}
            onChange={setDriects}
            label="출근"
            name={`checkin,${formattedDate}`}
            key={formattedDate}
          >
            <MenuItem value={""}><em>None</em></MenuItem>
            <MenuItem value={"이천"}>이천</MenuItem>
            <MenuItem value={"청주"}>청주</MenuItem>
            <MenuItem value={"음성"}>음성</MenuItem>
            <MenuItem value={"안성"}>안성</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="direct-checkout-select-outlined-label">퇴근</InputLabel>
          <Select
            labelId="direct-checkout"
            id={formattedDate}
            value={directList[formattedDate-1].checkout}
            onChange={setDriects}
            label="퇴근"
            name={`checkout,${formattedDate}`}
          >
            <MenuItem value={""}><em>None</em></MenuItem>
            <MenuItem value={"이천"}>이천</MenuItem>
            <MenuItem value={"청주"}>청주</MenuItem>
            <MenuItem value={"음성"}>음성</MenuItem>
            <MenuItem value={"안성"}>안성</MenuItem>
          </Select>
        </FormControl>
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