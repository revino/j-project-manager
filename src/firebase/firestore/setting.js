//Api
import {db} from '../../firebase'
import {getUid} from '../../auth'

async function getSetting() {
  try{
    const settingRef = db.collection(`users`).doc(getUid());
    const response   = await settingRef.get();
    const data = response.data();
    return data;
  }catch(err){
    console.log(err);
    return err;
  }
}

async function updateSetting(data) {
  try{
    const settingRef = db.collection(`users`).doc(getUid());
    await settingRef.update(data);
  }catch(err){
    console.log(err);
    return err;
  }
}


export {
  getSetting,
  updateSetting
};
