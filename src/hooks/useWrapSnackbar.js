import { useCallback } from 'react';

import { useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom";

export default function useWrapSnackbar() {

  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();

  const onCall = useCallback(async({event,successMessage,failMessage,redirectUrl}) => {
    try{
      await event();
      enqueueSnackbar(successMessage, { variant: 'success' } );

    }catch(e){
      console.log(e);
      enqueueSnackbar(failMessage, { variant: 'error' } );
      history.push(redirectUrl);
    }
  },[enqueueSnackbar, history]);

  return [onCall];

}