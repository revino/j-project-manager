import qs from "qs";

import {getToken} from '../auth';


//const PROXY = "https://cors-anywhere.herokuapp.com/"
const PROXY = "https://revino.herokuapp.com/"
const GETGOOGLESHEETURL= "https://docs.google.com/spreadsheets/d/"

const testapi = "https://sheets.googleapis.com/v4/spreadsheets/"
const SHEETNAME = "Item_Tables"

function getRange(id){
  return `A${id+1}:L${id+1}`;
}

function createData({id, progress, company, line, pl, pic, start, end, pjtno, pjtname,content,images} ) {
  const imageArray = images.map(el=> el.img);
  return [id, progress, company, line, pl, pic, start, end, pjtno, pjtname, content, imageArray.join(',')];
  }

export async function getQueryData({tq, sheet, selectSheetId}) {
  try{
    const token = getToken();
    const tokeType = "Bearer";
    const qString = {tq, sheet};
    const path = `${PROXY}${GETGOOGLESHEETURL}${selectSheetId}/gviz/tq`
    //const path = `/spreadsheets/d/${SHEET_ID}/gviz/tq`
    const queryStr = qs.stringify(qString);
    const fullpath =  path + "?" + queryStr
  
    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token, AccessControlAllowOrigin: '*' },
      method : 'GET',
    })
    
  
    return response;

  }catch(err){
    console.log(err);
    return err.message;
  }
}

export async function setData({newData, selectSheetId}) {
  try{
    const token = getToken();
    const tokeType = "Bearer";


    const queryObject = { valueInputOption: "USER_ENTERED"}

    const path  =`${testapi}${selectSheetId}/values/${SHEETNAME}!${getRange(newData.id)}`
    const queryStr = qs.stringify(queryObject);
    const fullpath =  path + "?" + queryStr


    const dataArray = createData({...newData,id:"=ROW()-1"});

    const data = { 
      range: `${SHEETNAME}!${getRange(newData.id)}`,
      majorDimension: "ROWS",
      values: [dataArray]
    }

    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token},
      method : 'PUT',
      body: JSON.stringify(data)
    })

    return response;

  } catch(err){
    console.log(err);
    return err.message;
  }
}

export async function addData({newData, selectSheetId}) {
  try{
    const token = getToken();
    const tokeType = "Bearer";

    const queryObject = { valueInputOption: "USER_ENTERED"}

    const path  =`${testapi}${selectSheetId}/values/${SHEETNAME}!${getRange(0)}:append`
    const queryStr = qs.stringify(queryObject);
    const fullpath =  path + "?" + queryStr

    const dataArray = createData({...newData,id:"=ROW()-1"});

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

    return response;
  } catch(err){
    console.log(err);
    return err.message;
  }
}


export async function deleteData({id, selectSheetId}) {
  try{
    const token = getToken();
    const tokeType = "Bearer";

    const path  =`${testapi}${selectSheetId}:batchUpdate`
    const fullpath =  path;

    const data = { 
      requests: [{deleteDimension: {
            range: {
              dimension: "ROWS",
              sheetId: 0,
              startIndex: id,
              endIndex: id+1
            }
      }}]
    }

    //Get Request
    const response = await fetch(fullpath, {
      headers: { Authorization: tokeType + " " + token},
      method : 'POST',
      body: JSON.stringify(data)
    })

    return response;

  } catch(err){
    console.log(err);
    return err.message;
  }
}

