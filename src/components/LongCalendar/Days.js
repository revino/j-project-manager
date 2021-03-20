//React
import React from 'react';

//Material UI

//

function Days(props) {
  const {classes } = props;

  const days = [];


  days.push(
    <div className={`${classes.col} ${classes.col_center}`} key={"businessDay"}>
      평일
    </div>
  );

  days.push(
    <div className={`${classes.col} ${classes.col_center} sunday`} key={"holiday"}>
      휴일
    </div>
  );

  days.push(
    <div className={`${classes.col} ${classes.col_center} overtime`} key={"overtime"}>
      초과
    </div>
  );

  return (
    <div className={`${classes.row} ${classes.days}`}>{days}</div>
  );
}


export default Days;