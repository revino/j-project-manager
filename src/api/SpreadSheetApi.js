import qs from "qs";

import dotenv from 'dotenv'

dotenv.config()

const PROXY = "https://cors-anywhere.herokuapp.com/"
const GOOGLESHEETURL= "https://docs.google.com/spreadsheets/d/"
const SHEET_ID = "1Eb2Bwx7aRWc2vwVyqw8rK4vKeM9U99bDPRNnJWIcC_s"

async function getQueryData(queryObject) {

        const token = localStorage.getItem('ACCESS_TOKEN');
        const tokeType = localStorage.getItem('TOKEN_TYPE');

        const path = `${PROXY}${GOOGLESHEETURL}${SHEET_ID}/gviz/tq`
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

export default {
  getQueryData,
};
