import {db} from '../../firebase'

const talbeConverter = {
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options);
    return {value:snapshot.id,label:data.project_name};
  }
};
export const getMyWorkListQuery  = (sheetId,username)=>db.collection(`tables`).doc(sheetId).collection(`items`).where('pic','==',username).withConverter(talbeConverter);

