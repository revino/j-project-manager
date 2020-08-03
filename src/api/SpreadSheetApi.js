import qs from "qs";

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
  const token = localStorage.getItem('ACCESS_TOKEN');
  const tokeType = localStorage.getItem('TOKEN_TYPE');

  const path = `${PROXY}${GETGOOGLESHEETURL}${SHEET_ID}/gviz/tq`
  //const path = `/spreadsheets/d/${SHEET_ID}/gviz/tq`
  const queryStr = qs.stringify(queryObject);
  const fullpath =  path + "?" + queryStr

  console.log("getQueryData 요청 쿼리스트링 :");
  console.log(queryObject);
  console.log(fullpath);

  //Get Request
  const resData = await fetch(fullpath, {
    headers: { Authorization: tokeType + " " + token, AccessControlAllowOrigin: '*' },
    method : 'GET',
  })

  //Parsing
  const resText = await resData.text();
  const resJson = await JSON.parse(resText.substring(47,resText.length-2));
  console.log("getQueryData 리스폰 :");
  console.log(resJson);

  return resJson;
}

async function setData(id,newData) {
  const token = localStorage.getItem('ACCESS_TOKEN');
  const tokeType = localStorage.getItem('TOKEN_TYPE');

  const queryObject = { valueInputOption: "USER_ENTERED"}

  const path  =`${testapi}${SHEET_ID}/values/${SHEETNAME}!${getRange(id)}`
  const queryStr = qs.stringify(queryObject);
  const fullpath =  path + "?" + queryStr

  newData.id = "=ROW()-1";
  const dataArray = createData(newData);
  //const dataArray = [ newData.id, newData.progress, newData.company, "윈팩", "유현준", "김지웅", "2020-09-09", "2020-09-19","change test No","change name", "변경내용"];


  const data = { 
    range: `${SHEETNAME}!${getRange(id)}`,
    majorDimension: "ROWS",
    values: [dataArray]
  }

  console.log("setData 변경 데이터 :");
  console.log(data);

  //Get Request
  const resData = await fetch(fullpath, {
    headers: { Authorization: tokeType + " " + token},
    method : 'PUT',
    body: JSON.stringify(data)
  })

  //Parsing
  const resJson = await resData.json();

  console.log("setData 리스폰 :");
  console.log(resJson);

  return resJson;
}
async function addData(newData) {
  const token = localStorage.getItem('ACCESS_TOKEN');
  const tokeType = localStorage.getItem('TOKEN_TYPE');

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

  console.log("addData 변경 데이터 :");
  console.log(data);

  //Get Request
  const resData = await fetch(fullpath, {
    headers: { Authorization: tokeType + " " + token},
    method : 'POST',
    body: JSON.stringify(data)
  })

  //Parsing
  const resJson = await resData.json();

  console.log("addData 리스폰 :");
  console.log(resJson);

  return resJson;
}


export default {
  getQueryData,
  setData,
  addData
};
