import {db} from '../../firebase'

const progressConverter = {
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options).fieldList;
    return  Object.keys(data).map(el=>({name:el,value:data[el]}));
  }
};


export const progressQuery  = db.collection(`tables`).doc('HYNIX').collection(`props`).doc('progress').withConverter(progressConverter);

export const companyQuery  = db.collection(`tables`).doc('HYNIX').collection(`props`).doc('company').withConverter(progressConverter);

