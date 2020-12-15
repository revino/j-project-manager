import { db } from "../../firebase";

export const chartQuery = (selectSheetId,startDateValue,endDateValue) =>{
  console.log("chartQuery")
  return db
  .collection(`tables`)
  .doc(selectSheetId)
  .collection(`items`).where("end_date", ">=",new Date(startDateValue))
}