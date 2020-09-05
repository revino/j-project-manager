import { useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom";

export default function useApiErrorSnackbar(e) {

  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();

  const handelSnackbar = useCallback((Error) => {
    let errMsg = '';
    let path   = '/'
         if(  Error === "401") {errMsg = '인증이 실패하였습니다.'; path= '/login';}
    else if(  Error === "403") {errMsg = '접근 권한이 없습니다.'; path= '/settings';}
    else if(  Error === "404") {errMsg = '데이터를 찾을 수 없습니다.'; path= '/settings';}
    else if(!!Error          ) {errMsg = '에러 발생'; path= '/login';}
    if(!!errMsg) {enqueueSnackbar(errMsg, { variant: 'error'}); history.push(path);}
  },[enqueueSnackbar,history]);


  useEffect(() =>{ handelSnackbar(e); }, [handelSnackbar,e]);

  return handelSnackbar;

}