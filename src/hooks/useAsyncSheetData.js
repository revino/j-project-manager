import { useState, useCallback } from 'react';

import { useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom";

import {getQueryData, setData, deleteData, addData} from '../api/SpreadSheetApi';

const useAsyncSheetData = ({selectSheetId, parserFn, initialData}) => {
  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();

  const [sheetData, setSheetData] = useState(initialData);
  const [error    , setError    ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handelErrorSnackbar = useCallback((Error) => {
    let errMsg = '';
    let path   = '/'
         if(  Error === "401") {errMsg = '인증이 실패하였습니다.'; path= '/login';}
    else if(  Error === "403") {errMsg = '접근 권한이 없습니다.'; path= '/settings';}
    else if(  Error === "404") {errMsg = '데이터를 찾을 수 없습니다.'; path= '/settings';}
    else if(!!Error          ) {errMsg = '에러 발생'; path= '/login';}

    if(!!errMsg) {enqueueSnackbar(errMsg, { variant: 'error'}); history.push(path);}
  },[enqueueSnackbar,history]);

  const handelSuccessSnackbar = useCallback((status) => {
    enqueueSnackbar(status, { variant: 'success' } );
  },[enqueueSnackbar]);

  const loadSheetData = useCallback(async(prop) => {    
    try {
      setIsLoading(true);
      const {tq} = prop;
      const response = await getQueryData({tq,selectSheetId});

      if(!response.ok) throw new Error(response.status);

      const resText   = await response.text();
      const resData   = JSON.parse(resText.substring(47,resText.length-2));
      const resparse  = parserFn(resData);
      console.log(resData);
      setSheetData(resparse);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setIsLoading(false);
      handelErrorSnackbar(err.message);
    }
  },[handelErrorSnackbar,parserFn,selectSheetId]);

  const updateSheetData = useCallback(async(newData, oldData) =>{
    try{
      setIsLoading(true);
      const dataUpdate = [...sheetData];
      const index = oldData.tableData.id;

      const response = await setData({newData, selectSheetId});
      if(!response.ok) throw new Error(response.status);

      dataUpdate[index] = newData;
      setSheetData([...dataUpdate]);

      handelSuccessSnackbar("업데이트성공("+response.status +")");
      setIsLoading(false);

    }catch(err){
      console.log(err);
      setError(err);
      setIsLoading(false);
      handelErrorSnackbar(err.message);
    }
  },[handelSuccessSnackbar,handelErrorSnackbar,sheetData,selectSheetId])

  const deleteSheetData = useCallback(async(oldData) =>{
    try{
      setIsLoading(true);
      const dataDelete = [...sheetData];
      const index = oldData.tableData.id;
      dataDelete.splice(index, 1);
      const response = await deleteData({id:oldData.id, selectSheetId});
      if(!response.ok) throw new Error(response.status);
      setSheetData([...dataDelete]);

      handelSuccessSnackbar("삭제 성공");
      setIsLoading(false);
    }catch(err){
      console.log(err);
      setError(err);
      setIsLoading(false);
      handelErrorSnackbar(err.message);
    }
  },[handelSuccessSnackbar,handelErrorSnackbar,sheetData,selectSheetId]);

  const createSheetData = useCallback(async(newData) =>{
    try{
      setIsLoading(true);
      const response = await addData({newData, selectSheetId});
      if(!response.ok) throw new Error(response.status);

      handelSuccessSnackbar("업데이트성공("+response.status +")");
      setIsLoading(false);
    }catch(err){
      console.log(err);
      setError(err);
      setIsLoading(false);
      handelErrorSnackbar(err.message);
    }
  },[handelSuccessSnackbar,handelErrorSnackbar,selectSheetId])



  return { sheetData, isLoading, error, loadSheetData, updateSheetData, deleteSheetData, createSheetData };
}

export default useAsyncSheetData