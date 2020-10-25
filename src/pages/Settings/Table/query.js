import {db,Timestamp} from '../../../firebase'

import moment from 'moment';
import { getUid } from '../../../firebase/auth';

const progressConverter = {
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options).fieldList;
    return  {name:snapshot.id,list:data};
    //return  Object.keys(data).map(el=>({name:el,value:data[el]}));
  }
};


const talbeConverter = {
  toFirestore:(item)=>{
    const sampleData = {project_name:"프로젝트이름", project_no:"프로젝트번호", content:"", images:[],
    progress:"진행중",company:"회사",line:"라인",pl:"project Leader",pic:"담당자"}
    const start = Timestamp.fromDate(moment().toDate());
    const end = Timestamp.fromDate(moment().toDate());
    const created = Timestamp.fromDate(moment().toDate());
    const makeNewData = {...sampleData,...item,start_date:start,end_date:end,created_at:created}
    return makeNewData;
  }
};

export const tablesQuery = (tableId) => db.collection(`tables`).doc(tableId);
export const headQuery   = (tableId) => db.collection(`tables`).doc(tableId).collection(`props`).withConverter(progressConverter);
export const updateHeadQuery = (tableId,fieldId) => db.collection(`tables`).doc(tableId).collection(`props`).doc(fieldId);
const ItemQuery   = (tableId) => tablesQuery(tableId).collection(`items`).withConverter(talbeConverter);
const PropQuery   = (tableId) => tablesQuery(tableId).collection(`props`);

export const headAdd = async(tableId,fieldId,newData) =>{
  const query = db.collection(`tables`).doc(tableId).collection(`props`).doc(fieldId);

  await db.runTransaction(async (transaction)=>{
    const getData = await transaction.get(query);
    const fieldData = {...(getData.data())};
    if(!fieldData.fieldList[newData]) fieldData.fieldList[newData]=0;
    transaction.update(query,{fieldList:fieldData.fieldList});
  })
}

export const headDelete = async(tableId,fieldId,newData) =>{
  const query = db.collection(`tables`).doc(tableId).collection(`props`).doc(fieldId);

  await db.runTransaction(async (transaction)=>{
    const getData = await transaction.get(query);
    const fieldData = {...(getData.data())};
    
    delete fieldData.fieldList[newData];
    transaction.update(query,{fieldList:fieldData.fieldList});
  })
}

export const tableDelete = async(tableId) =>{
  await db.runTransaction(async (transaction)=>{
    const getData = await transaction.get(db.collection(`tables`).doc(tableId));
    const created_by = await transaction.get((getData.data()).created_by);
    if(created_by.id === getUid()) {
      transaction.delete(db.collection(`tables`).doc(tableId));
    }
  })
}

export const getTableOwner = async(tableId) =>{
  let id;
  await db.runTransaction(async (transaction)=>{
    const getData = await transaction.get(db.collection(`tables`).doc(tableId));
    const created_by = await transaction.get((getData.data()).created_by);
    id = created_by.id;
  })
  return id;
}

export const tableAdd = async({table_name, table_id})=>{
  const tableField = {
    created_at: Timestamp.fromDate(moment().toDate()),
    title: table_name,
    created_by: db.collection(`users`).doc(getUid())
  }
  const propsField = (name) => ({
    fieldList:{},
    name:name
  })

  let userData = await db.collection(`users`).doc(getUid()).get();
  const tableData = await tablesQuery(table_id).get();
  let sheetList;

  //리스트 설정 안되어있을 경우에 생성
  if(!userData.data()){
    await db.collection(`users`).doc(getUid()).set({sheetList:[],selectSheetId:''});
  }

  //다시 리스트설정 받아오기
  userData = await db.collection(`users`).doc(getUid()).get();

  //Table 없으면 신규추가
  if(!tableData.data()){
    await db.runTransaction(async (transaction)=>{
        transaction.set(tablesQuery(table_id),tableField);
        transaction.set(PropQuery(table_id).doc('company'),propsField('company'));
        transaction.set(PropQuery(table_id).doc('line'),propsField('line'));
        transaction.set(PropQuery(table_id).doc('pic'),propsField('pic'));
        transaction.set(PropQuery(table_id).doc('pl'),propsField('pl'));
        transaction.set(PropQuery(table_id).doc('progress'),propsField('progress'));
        transaction.set(PropQuery(table_id).doc('progress'),propsField('progress'));
    });
    await ItemQuery(table_id).add({content:"샘플"});
  }

  //개인 리스트에 추가
  sheetList = userData.data().sheetList;
  const newSheet = {label:table_name,link:table_id}
  sheetList.push(newSheet);
  await db.collection(`users`).doc(getUid()).update({sheetList});
    

}

/*
export const tableAdd = async({table_name, table_id})=>{
  const tableField = {
    created_at: Timestamp.fromDate(moment().toDate()),
    title: table_name,
    created_by: db.collection(`users`).doc(getUid())
  }
  const propsField = (name) => ({
    fieldList:{},
    name:name
  })
  const userData = await db.collection(`users`).doc(getUid()).get();
  const tableData = await tablesQuery(table_id).get();

  //리스트 설정 안되어있을 경우에 생성
  if(!userData.data()){
    await db.collection(`users`).doc(getUid()).set({sheetList:[],selectSheetId:''});
  }

  if(!tableData.data()){
    console.log("테이블 신규 생성")
    await db.runTransaction(async (transaction)=>{
      let sheetList;
      sheetList = !userData.data()? userData.data().sheetList: [];
      const newSheet = {label:table_name,link:table_id}
      sheetList.push(newSheet);
      transaction.update(db.collection(`users`).doc(getUid()),{sheetList});
      transaction.set(tablesQuery(table_id),tableField);
      transaction.set(PropQuery(table_id).doc('company'),propsField('company'));
      transaction.set(PropQuery(table_id).doc('line'),propsField('line'));
      transaction.set(PropQuery(table_id).doc('pic'),propsField('pic'));
      transaction.set(PropQuery(table_id).doc('pl'),propsField('pl'));
      transaction.set(PropQuery(table_id).doc('progress'),propsField('progress'));
      transaction.set(PropQuery(table_id).doc('progress'),propsField('progress'));
    })
    await ItemQuery(table_id).add({content:"샘플"});
  }
  else{
    await db.runTransaction(async (transaction)=>{
      let sheetList;
      sheetList = !userData.data()? userData.data().sheetList: [];
      const newSheet = {label:table_name,link:table_id}
      sheetList.push(newSheet);
      transaction.update(db.collection(`users`).doc(getUid()),{sheetList});
    })
    console.log('기존 테이블 추가');
  }


}

*/