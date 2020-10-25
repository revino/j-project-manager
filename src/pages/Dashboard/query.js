import {db} from '../../firebase'
import moment from 'moment';

const progressConverter = {
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options).fieldList;
    return  Object.keys(data).map(el=>({name:el,value:data[el]}));
  }
};

const talbeConverter = {
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options);
    const startdate = moment(data.start_date.toDate()).format("YYYY-MM-DD")
    const enddate   = moment(data.end_date.toDate()).format("YYYY-MM-DD")
    return {...data,start_date: startdate, end_date:enddate, id:data.id};
  }
};

export const progressQuery  = (sheetId)=> db.collection(`tables`).doc(sheetId).collection(`props`).doc('progress').withConverter(progressConverter);

export const companyQuery  = (sheetId)=> db.collection(`tables`).doc(sheetId).collection(`props`).doc('company').withConverter(progressConverter);

export const tableQuery = (sheetId)=> db.collection(`tables`).doc(sheetId).collection(`items`).orderBy("created_at", "desc").limit(5).withConverter(talbeConverter);
