//React
import React from 'react';

//Material UI

//
import { format, startOfWeek, addDays} from "date-fns";
import { ko } from 'date-fns/locale';

function Days(props) {
  const {currentMonth, classes } = props;

  const dateFormat = "eeee";
  const days = [];
  let startDate = startOfWeek(currentMonth);

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className={`${classes.col} ${classes.col_center} ${i===0? "sunday" : i===6? "saturday" : ""}`} key={i}>
        {format(addDays(startDate, i), dateFormat,{locale: ko})}
      </div>
    );
  }

  return (
    <div className={`${classes.row} ${classes.days}`}>{days}</div>
  );
}


export default Days;