import qs from "qs";

import {getToken} from '../auth';


const GOOGLEPROFILEURL = "https://www.googleapis.com/oauth2/v2/userinfo"

async function getProfile() {
  try{
    const token = getToken();
    const tokeType = "Bearer";
    const queryObject = {
        alt: "json",
        access_token: token
    }
  
    const path = `${GOOGLEPROFILEURL}`
    const queryStr = qs.stringify(queryObject);
    const fullpath =  path + "?" + queryStr
  
    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token + "aa"},
      method : 'GET',
    })
  
    if(!response.ok) throw new Error(response.status);

    //Parsing
    const resJson = await response.json();
  
    return resJson;

  } catch(err){
    console.log(err);
  }

}

export default {
  getProfile,
};
