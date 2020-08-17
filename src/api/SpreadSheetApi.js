import qs from "qs";

import {getToken} from '../auth';


//const PROXY = "https://cors-anywhere.herokuapp.com/"
const PROXY = "https://revino.herokuapp.com/"
const GETGOOGLESHEETURL= "https://docs.google.com/spreadsheets/d/"
const SHEET_ID = "1Eb2Bwx7aRWc2vwVyqw8rK4vKeM9U99bDPRNnJWIcC_s"
const testapi = "https://sheets.googleapis.com/v4/spreadsheets/"
const SHEETNAME = "Item_Tables"

function getRange(id){
  return `A${id+1}:K${id+1}`;
}

function createData({id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content} ) {
  return [id, progress, company, line, pl, pic, start, end, pjtno, pjtname, content];
  }

async function getQueryData(queryObject) {
  try{
    const token = getToken();
    const tokeType = "Bearer";
  
    const path = `${PROXY}${GETGOOGLESHEETURL}${SHEET_ID}/gviz/tq`
    //const path = `/spreadsheets/d/${SHEET_ID}/gviz/tq`
    const queryStr = qs.stringify(queryObject);
    const fullpath =  path + "?" + queryStr
  
    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token , AccessControlAllowOrigin: '*' },
      method : 'GET',
    })
  
    if(!response.ok) throw new Error(response.status);
  
    //Parsing
    const resText = await response.text();
    const resJson = await JSON.parse(resText.substring(47,resText.length-2));
  
    return resJson;

  }catch(err){
    console.log(err);
    return err.message;
  }
}

async function setData(id,newData) {
  try{
    const token = getToken();
    const tokeType = "Bearer";

    const queryObject = { valueInputOption: "USER_ENTERED"}

    const path  =`${testapi}${SHEET_ID}/values/${SHEETNAME}!${getRange(id)}`
    const queryStr = qs.stringify(queryObject);
    const fullpath =  path + "?" + queryStr

    newData.id = "=ROW()-1";
    const dataArray = createData(newData);

    const data = { 
      range: `${SHEETNAME}!${getRange(id)}`,
      majorDimension: "ROWS",
      values: [dataArray]
    }

    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token},
      method : 'PUT',
      body: JSON.stringify(data)
    })

    if(!response.ok) throw new Error(response.status);

    //Parsing
    const resJson = await response.json();

    return resJson;
  } catch(err){
    console.log(err);
    return err.message;
  }
}

async function addData(newData) {
  try{
    const token = getToken();
    const tokeType = "Bearer";

    const queryObject = { valueInputOption: "USER_ENTERED"}

    const path  =`${testapi}${SHEET_ID}/values/${SHEETNAME}!${getRange(0)}:append`
    const queryStr = qs.stringify(queryObject);
    const fullpath =  path + "?" + queryStr

    newData.id = "=ROW()-1";
    const dataArray = createData(newData);

    const data = { 
      range: `${SHEETNAME}!${getRange(0)}`,
      majorDimension: "ROWS",
      values: [dataArray]
    }

    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token},
      method : 'POST',
      body: JSON.stringify(data)
    })

    if(!response.ok) throw new Error(response.status);

    //Parsing
    const resJson = await response.json();

    return resJson;
  } catch(err){
    console.log(err);
    return err.message;
  }
}


async function deleteData(idx) {
  try{
    const token = getToken();
    const tokeType = "Bearer";

    const path  =`${testapi}${SHEET_ID}:batchUpdate`
    const fullpath =  path;

    const data = { 
      requests: [{deleteDimension: {
            range: {
              dimension: "ROWS",
              sheetId: 0,
              startIndex: idx,
              endIndex: idx+1
            }
      }}]
    }

    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token},
      method : 'POST',
      body: JSON.stringify(data)
    })

    if(!response.ok) throw new Error(response.status);

    //Parsing
    const resJson = await response.json();

    return resJson;
  } catch(err){
    console.log(err);
    return err.message;
  }
}


export default {
  getQueryData,
  setData,
  addData,
  deleteData
};
