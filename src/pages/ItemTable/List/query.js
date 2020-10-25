import {db, Timestamp} from '../../../firebase'

import moment from 'moment';

const talbeConverter = {
  toFirestore:(item)=>{
    const start = Timestamp.fromDate(moment(item.start_date).toDate());
    const end = Timestamp.fromDate(moment(item.end_date).toDate());
    const created = Timestamp.fromDate(moment().toDate());
    const makeNewData = {...item,start_date:start,end_date:end,created_at:created}
    delete makeNewData.id;
    delete makeNewData.tableData;
    return makeNewData;
  },
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options);
    const startdate = moment(data.start_date.toDate()).format("YYYY-MM-DD");
    const enddate   = moment(data.end_date.toDate()).format("YYYY-MM-DD");
    return {...data,start_date: startdate, end_date:enddate, id:snapshot.id};
  }
};

export const headQuery   = (sheetId) => db.collection(`tables`).doc(sheetId).collection(`props`);
export const tableQuery  = (sheetId) => db.collection(`tables`).doc(sheetId).collection(`items`).withConverter(talbeConverter);

export const tableAdd = async(ref, newData)=>{

  await ref.add(newData);

  await db.runTransaction(async (transaction)=>{
    const progressField = await transaction.get(headQuery.doc('progress'));
    const companyField  = await transaction.get(headQuery.doc('company'));

    const progressFieldList = progressField.data().fieldList;
    const companyFieldList = companyField.data().fieldList;

    ++progressFieldList[newData.progress];
    ++companyFieldList[newData.company];

    transaction.update(headQuery.doc('progress'),{fieldList:progressFieldList});
    transaction.update(headQuery.doc('company'),{fieldList:companyFieldList});
  })

}
export const tableUpdate = async(ref, newData, oldData)=>{
  const start = Timestamp.fromDate(moment(newData.start_date).toDate());
  const end = Timestamp.fromDate(moment(newData.end_date).toDate());
  const makeNewData = {...newData,start_date:start,end_date:end}
  delete makeNewData.id;
  delete makeNewData.tableData;
  delete makeNewData.created_at;

  await db.runTransaction(async (transaction)=>{
    const progressField = await transaction.get(headQuery.doc('progress'));
    const companyField  = await transaction.get(headQuery.doc('company'));

    const progressFieldList = progressField.data().fieldList;
    const companyFieldList = companyField.data().fieldList;

    ++companyFieldList[newData.company];
    if(companyFieldList[oldData.company]>0) --companyFieldList[oldData.company];

    ++progressFieldList[newData.progress];
    if(progressFieldList[oldData.progress]>0) --progressFieldList[oldData.progress];

    transaction.update(ref,makeNewData);
    transaction.update(headQuery.doc('progress'),{fieldList:progressFieldList});
    transaction.update(headQuery.doc('company'),{fieldList:companyFieldList});
  })
}

export const tableDelete = async(ref,oldData)=>{

  await db.runTransaction(async (transaction)=>{
    const progressField = await transaction.get(headQuery.doc('progress'));
    const companyField  = await transaction.get(headQuery.doc('company'));
    
    const progressFieldList = progressField.data().fieldList;
    const companyFieldList = companyField.data().fieldList;

    if(companyFieldList[oldData.company]>0) --companyFieldList[oldData.company];
    if(progressFieldList[oldData.progress]>0) --progressFieldList[oldData.progress];

    transaction.delete(ref);
    transaction.update(headQuery.doc('progress'),{fieldList:progressFieldList});
    transaction.update(headQuery.doc('company'),{fieldList:companyFieldList});
  })
}